---
layout: post
author: chenglong
title: ubuntu启动失败黑屏解决方案
categories: linux
description: ubuntu启动失败黑屏解决方案
keywords: ubuntu, 启动失败, 黑屏
---

# 现象
启动直接进入黑屏，左上角有光标但不闪烁，ctrl+alt+fx也无法进入命令行界面
<!-- abs -->

# 异常前操作
在有程序安装过程中直接reboot，接着就一直如此


# 最终解决
尝试了很多网上的方法，包括进入grub后按e改磁盘ro为rw啊，进入recovery模式该grub配置啊等等都无效，后来发现这种操作后就恢复正常了，即进入recovery模式后执行软件包升级和恢复即可，具体如下

- 进入grub模式
一旦启动后，在有读条的时候按住左shitf键即可，注意一定要赶在在启动一开始时，另外虚拟机的情况下要注意按键前用鼠标点击屏幕进入虚拟机，否则识别为虚拟机外部的输入，进入后如图  
![1.png](/pic/2019/01/1.png)

- 进入recovery模式
grup中选择Advanced模式进入如下状态  
![2.png](/pic/2019/01/2.png)
每个人显示可能会略有不同，但只要选择后面带有 recovery mode即可进入，如下  
![3.png](/pic/2019/01/3.png)

- 配置为读写模式并以root登陆
出问题时一般会发现上图中recovery菜单中文件系统时只读的，此时只要选中“network”选项就会使能网络并改为读写模式，接着再选择“root”选项就可以root登陆

- 更新软件包并恢复有问题的安装
登陆后就很简单了
`apt-get update; apt-get upgrade -f`
注意upgrade后面加了-f参数，这是因为我的情况中软件包有损坏提示用这个选项做修复

接着reboot就会正常登陆GUI界面了

# 回顾
这个问题的根因[1]可能是当更新安装包等关键操作时发生了强制重启或关机，导致ubuntu的文件系统保护性地进入只读模式[2]，而启动中有些关键项是需要写入的，导致无法启动，因此这种情况的解决思路应该集中在如何恢复文件系统的读写性上，这个问题很早之前也遇到过一次，当时好像也是发生在软件包升级的过程中。

[^1]:https://www.howtogeek.com/196740/how-to-fix-an-ubuntu-system-when-it-wont-boot/
[^2]:http://forum.ubuntu.org.cn/viewtopic.php?p=3198914
