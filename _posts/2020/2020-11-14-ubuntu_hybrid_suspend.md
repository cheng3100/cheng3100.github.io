---
layout: post
author: chenglong  
title: ubuntu20.10 休眠耗电问题解决
categories: [ubuntu, suspend]
description: ubuntu20.10 休眠耗电问题解决
keywords: ubuntu, battery drain, suspend
---

最近在新买的thinkpad x13 amd版本上安装了ubuntu20.10, kernel verison 5.8, 所有功能基本正常，但发现合盖后休眠状态耗电稍高，大概一个晚上会耗电15%左右，这样休眠状态大概只能放置两天多，而我另外一台thinkpad t490s intel版本大概只有4~5%左右，经过一些研究后基本解决这个问题，目前休眠一天大概耗电3%左右,基本待机放置一两周都没有问题。

<!-- abs -->

# linux suspend mode

linux 有多种suspend模式，其中这里需要关注的是S3(suspend-to-ram)和S4(suspend-to-disk)模式，S3模式下仅有ram保持供电，恢复速度较快，而S4模式下会在休眠时将ram dump到磁盘中(放在专门的swap分区或者swap文件中)，休眠期间基本不消耗电力，唤醒时再从磁盘中将ram内容恢复出来，此时唤醒速度会慢于S3,具体时间取决于ram大小和ram与disk之间的传输性能。完整可见linux 文档[^1]

一般情况下S3模式已经足够，但可能是由于bios或者纯粹硬件的问题，我这个新款的thinkpad x13 amd版本的确S3模式下耗电稍高了些，大概有0.6w左右(对比intel版本大概只有0.3w),但其实从原理上应该是正常的，这个问题也同样在T14 amd版本上有报出，这里有一个联想官方的[论坛帖子](https://forums.lenovo.com/t5/Other-Linux-Discussions/T14-AMD-battery-drain-in-standby-Linux/m-p/5037674?page=3)在追踪这个问题，联想方面也承认存在这个问题，也许后期通过bios的更新是可以得到改善

但希望较为彻底改善休眠续航的问题，则还是需要使用S4模式，即`hibernate mode`,在ubuntu上默认没有开启，开启后我使用起来也很稳定，同时新一代的高速pci ssd和高速ram的配合下，唤醒时间基本在10s左右，完全可以接受。

# 确认S3模式可用
首先第一步需要确认基本的S3模式可用

```
sudo apt install pm-utils
pm-is-supported --suspend
echo $?
```

结果为0则代表支持，注意由于新的win10版本使用了所谓`modern standby`模式，很多新的电脑需要在bios里设置启动模式，可以参考这里[^2], 目前thinkpad的bios是支持切换的，但很多其他型号笔记本并不支持，这一点在购买电脑时需要注意。


# 确认S4模式可用

```
sudo apt install pm-utils
pm-is-supported --hibernate
echo $?
```
或者直接
```
sudo pm-hibernate
```

如果可以成功进入S4模式，则笔记本会自动息屏，同时按下电源键可以唤醒, 如果不能够成功休眠，使用
```
sudo dmesg | grep PM
```

应该可以查看是否进入`hibernate` 成功或者失败，如果显示fail，则需要使能S4模式.

# 使能S4模式

S4模式需要swap partition或者swap file的支持，目前新的ubuntu版本默认都是使用swap file，位于`/swapfile`， S4模式需要swapfile的大小不小于ram大小，通过swapfile来使能S4模式可以参考这里[^3], 之后再次运行 `sudo  pm-hibernate` 来确认是否可以进入S4.

如果成功，接着
```
service systemd-hibernate start
```

尝试是否可以使用系统服务来进入S4模式，如果失败，使用`service systemd-hibernate status`查看原因，我的例子如这里所示

```
● systemd-hibernate.service - Hibernate
     Loaded: loaded (/lib/systemd/system/systemd-hibernate.service; static)
    Drop-In: /etc/systemd/system/systemd-hibernate.service.d
             └─override.conf
     Active: inactive (dead)
       Docs: man:systemd-suspend.service(8)

Nov 13 01:01:35 cheng-ThinkPad-X13-Gen-1 run-parts[4391]: run-parts: executing /lib/systemd/system-sleep/unattended-upgrades pre
Nov 13 01:01:35 cheng-ThinkPad-X13-Gen-1 systemd[4590]: systemd-hibernate.service: Failed to execute command: No such file or directory
Nov 13 01:01:35 cheng-ThinkPad-X13-Gen-1 systemd[4590]: systemd-hibernate.service: Failed at step EXEC spawning /usr/sbin/s2disk: No such file or directory
Nov 13 01:01:35 cheng-ThinkPad-X13-Gen-1 systemd[1]: systemd-hibernate.service: Main process exited, code=exited, status=203/EXEC
Nov 13 01:01:35 cheng-ThinkPad-X13-Gen-1 systemd[1]: systemd-hibernate.service: Failed with result 'exit-code'.
Nov 13 01:01:35 cheng-ThinkPad-X13-Gen-1 systemd[1]: Failed to start Hibernate.
Nov 13 01:02:03 cheng-ThinkPad-X13-Gen-1 systemd[1]: systemd-hibernate.service: Service has no ExecStart=, ExecStop=, or SuccessAction=. Refusing.
Nov 13 01:06:07 cheng-ThinkPad-X13-Gen-1 systemd[1]: Starting Hibernate...
Nov 13 01:06:49 cheng-ThinkPad-X13-Gen-1 systemd[1]: systemd-hibernate.service: Succeeded.
Nov 13 01:06:49 cheng-ThinkPad-X13-Gen-1 systemd[1]: Finished Hibernate

```

找到服务所用的配置文件，这里是`/lib/systemd/system/systemd-hibernate.service`,找到`ExecStart=`这里，替换为`ExecStart=pm-hibernate`,接着重启重新尝试，看能否启动S4休眠服务。

# 使能混合休眠模式(hybrid-suspend mode)

如果S4模式已经使能，则简单地编辑`/etc/systemd/logind.conf` 文件将各种操作下的`suspend`值全部改为`hibernate`即可，同时注意到还有一个模式即`hybrid-suspend`模式，可以配置`/etc/systemd/sleep.conf`中的`HibernateDelaySec`值来使能S3模式之后N秒如果没有唤醒就进入S4模式

但这里会有个问题，就是放置笔记本一段时间后的延迟自动休眠仍然是调用的`systemd-suspend`服务，而不是`systemd-hybrid-suspend`服务，这里我采取的方法是通过调用`service systemd-suspend status` 找到suspend服务的配置文件，然后删除这个文件，定义一个软链接到systemd-hybrid-suspend服务的配置文件，也就是将所有的suspend模式都变为hybyrid-suspend模式即可。


[^1]: [linux document of suspend mode](https://www.kernel.org/doc/html/v4.15/admin-guide/pm/sleep-states.html)
[^2]: [laptop suspend mode](https://longcheng.zone/2020/11/14/ubuntu_suspend/)
[^3]: [ubuntu enable hibernate by swap file](https://askubuntu.com/questions/6769/hibernate-and-resume-from-a-swap-file)
