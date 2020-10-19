---  
layout: post  
author: chenglong  
title: wlan 架构层次  
categories: [wlan, linux driver]
description: wlan 架构层次 
keywords: wlan, host, wifi, linux driver
---  

# 1. wlan 设备层次架构  
对wlan host和firmware的架构从整体上做了一个整理。
<!-- abs -->

## 1.1 host-device架构  
用于手机或者其他cpu性能较强场景，模块上划分为host和device，中间通过usb/sdio等总线连接  

![image-20200509165357413](/pic/2020/05/image-20200509165357413.png)  

## 1.2 single firmware架构  

![image-20200509165941408](/pic/2020/05/image-20200509165941408.png)  

用于iot芯片等独立SOC场景，其中将应用层、sdk、wlan firmware、driver等全部放在统一的SOC芯片上，作为一个整体模块  

# 2. wlan协议层次架构  

![image-20200509161742333](/pic/2020/05/image-20200509161742333.png)  

wlan实现主要在OSI模型的link layer和physical layer，其中802.11协议在其中做了内部细分为MAC层和PHY层，802.11各协议的数据帧格式处理、数据帧交互、碰撞避免等横跨了MAC和PHY层，而wlan连接管理、身份认证/数据加密/完整性等放到了链路层。  

## 2.1 link layer  

- 802.2  

  主要是用于连接控制的管理，该层本身并不为802.11无线协议专用，统一适用于如以太网等各种链路协议  

- 802.1X[^1]  

  用于安全相关的管理控制，包括组件：  

  - PAE(Port access entity): 端口实例，是对LAN 端口的协议抽象，是后续的身份认证等功能的主体对象  

  - Authenticator：认证网关，一般位于AP的的一个端口，是用于管理认证请求的PAE  

  - supplicant：认证请求者，一般位于client的一个端口  

  - Authentication server：认证管理服务器，认证网关向其转发认证请求完成认证过程。  

    ![image-20200509163805408](/pic/wlan/image-20200509163805408.png)  

    一个典型802.1x框架如上  

## 2.2 MAC&PHY layer  

![image-20200509163844328](/pic/2020/05/image-20200509163844328.png)  

802.11主要的实现部分在这里，横跨了MAC和PHY两层，其中包含了具体的数据帧处理 以及如CSMA算法等部分  



# 3. wlan linux软件层次架构  

![image-20200509170510216](/pic/2020/05/image-20200509170510216.png)  

## 3.1 host driver/control plane  

- nl80211  

  用户态的wlan配置管理实现  

- wpa_supplicant  

  主要实现了802.1x并提供接口[^3]  

- cfg80211  

  内核态的80211的控制api接口，用于提供802.11协议的大多数功能给外部,用于承接mac80211或者fullmac  

- mac80211  

  即**“soft mac”**,将mac层实现上移到host层，相对的将mac放在device层的实现称为**“fullMac”**.[^2]  

- wlan driver  

  这里主要是连接host与device的各种总线协议的驱动，如usb、sdio、pci等，由于涉及帧格式的转换这里的驱动与普通usb等驱动又有所区别，更为复杂  

## 3.2 device firmware/data plane  

- 802.11 firmware  

  实现具体的802.11协议的固件，一般与芯片绑定  



[^1]:[802.1x protocol](https://1.ieee802.org/security/802-1x/)  
[^ 2]:[mac80211/fullmac](https://wireless.wiki.kernel.org/en/developers/documentation/glossary)  
[^3]:[wpa/802.1x](http://w1.fi/wpa_supplicant/)  
