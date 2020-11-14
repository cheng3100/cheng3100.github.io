---
layout: post
author: chenglong  
title: ubuntu20.10 无法休眠
categories: [ubuntu]
description:
keywords: ubuntu, linux, suspend,
---

最近在新买的thinkpad x13 amd version上安装Ubuntu20.10时发现合盖无法休眠，也无法唤醒，结果发现是bios中设置suspend模式的问题导致的

<!-- abs -->

# 解决方法

重启后按下`F1`或者`Enter`按键来使能进入bios，在 `Power` > `SetupMode`中将启动模式由`Win10` 改为`Linux`, 按下`F10`使能重启

# 原因分析

微软在新版本的win10系统中使用了一种新的休眠模式`Moderstandby Mode`[^1], 而传统linux和windows使用的休眠模式为`S3`或者称为`Stand to Ram`模式，S3模式下仅保持ram供电，其他外设和cpu都会下线，而微软的新的休眠模式下仍然会保持网络连接和基本的系统活动，也就是类似手机的休眠模式，因此也会耗电更高，微软目前不知出于什么原因将这两种模式作为互斥而不是兼容处理，而linux目前也不支持这种模式。

[^1]: [microsoft modern standby](https://docs.microsoft.com/en-us/windows-hardware/design/device-experiences/modern-standby) 

