---
layout: post
title: 在Linux上构建arm开发环境
categories: [arm]
description: 在Linux下搭建arm的开发环境，包括代码构建、编译、调试和烧写
keywords: arm, linux, gdb
---

可能很多人初次接触编译嵌入式工程都是在IDE上，IDE对于初学者会比较方便，因为他隐藏了包括工程构建、代码调试以及镜像烧写的很多细节。如果希望进一步学习SOC体系结构，在完全的linux环境中进行工程构建和调试是非常必要的，这里逐步介绍如何在完全的linux环境下进行工程构建、代码编译、gdb调试以及烧写镜像的方法，并给出对应的demo工程`armdbg`[^1]以供大家参考学习.

<!-- abs -->

# 编译环境

## arm gcc
Linux下的arm cortex编译器为`arm-none-eabi-gcc`, 这是一个编译工具系列，其中不仅包含`gcc`, 也包括`objdump`,`nm`等工具。一般在不同的发行版中可以直接通过包管理下载，例如在Ubuntu上可通过：
`sudo apt install gcc-arm-none-eabi` ,但最好直接去arm官网下载最新版本[^2], 解压后将目录加入环境变量即可。

为确认是否安装成功，在终端中输入：
`arm-none-eabi-gcc --version`， 如果有对应版本信息输出则成功。

# 构建代码工程

## Makefile
首先需要确保`make` 已安装，Makefile的编写具有一定技巧性，内容超过了这篇文章的范围，大家可以参考这个demo项目`armdbg`进行修改移植[^1]

## Link Script
链接脚本用于指定代码和内存各部分在硬件中的分布，同时也可以用于具体控制某段代码的地址范围，展开说的话也是很多内容，这里同样可以先参考我的一个基于stm32的demo `armdbg`[^1]

## Startup File
Startup file是系统启动后最开始进入的代码，按照不同习惯可以作为汇编或者c文件存在，在这个过程中主要是赋予初始栈指针，载入中断handler以及一个简单的bootloader过程，对于含有flash的嵌入式系统来说，一般这个bootloader过程只需要将初始化的全局变量`.data`段从flash复制到内存，以及将未初始的全局变量段`.bss`全部置为0即可。我的demo中包含了一个比较标准的atm-cortex m3的startup汇编文件，大家可以参考[^1]


# Gdb 调试

对于交叉编译环境来说，典型的gdb调试框架如下，其中Host端分为`gdb client`和`gdb server`,通过tcp socket进行连接。而`gdb server`还需要另外和外部的硬件调试器Debugger通信，debugger再和目标板通过jtag等调试接口连接.

其中`debugger`作用是将jtag等调试接口协议转为usb协议到host，而`gdb server`用于起一个监听接口，相当于将硬件的jtag接口转化暴露为一个tcp socket接口，当`gdb client` 连接到`gdb server`后就可以探查内存，控制运行了。
```

+++++++++++++++++++++++++++++++++++++++++
+ Host                                  +
+   -------------       --------------  +
+   | gdb client|       | gdb server |  +
+   |           |------>|            |  +
+   ------------        ----------|---  +
++++++++++++++++++++++++++++++++++|++++++
                                  |
	  |----------------------------
      |
+++++++++++++        jtag  ++++++++++++++++
+  Debugger + <===========>+ arm borad    +
+++++++++++++              ++++++++++++++++


```

## 调试器(Debugger)选择


硬件调试器有多种可供选择，常见的主要有：`Jlink`,`STlink`, `CMSIS-DAP`, `FTDI`,等等，一般推荐使用`Jlink`或者`Stlink`即可

## pyOCD安装

`gdb server`同样有很多实现，这里推荐使用`pyocd`[^3],我的demo项目`armdbg`也是采用的这个，它是一个python编写的开源软件，可以直接通过pip 安装。



## 建立Gdb Server
首先按照上面的框架图连接好。
`armdbg`中已经将gdb建立过程集成到工程中，只需要打开一个终端，在`armdbg`工程目录下输入`make gdbserver`,如果看到已经建立一个端口为`3333`的连接，则gdb server启动成功。

## 连接Gdb Client

打开另外一个终端，在`armdbg`中输入`make gdb`，即可连接到gdb server并自动导入镜像文件，此时可以通过gdb命令进行调试，例如输入`s`进行单步跟踪，输入`bt`查看调用栈信息，输入`c`继续执行等等。

# 烧写镜像

烧写镜像在嵌入式系统中有多种方案，现在大多数系统都会有一个自带的bootloader，可以直接通过串口通讯，由bootloader接收镜像包再写入flash中，例如st的dfu。不过为了了解更多底层细节，还是建议尝试下从`JTAG/SWD`调试接口，通过硬件调试器进行烧写。同时这也是后面要提到的使用gdb进行调试的必须方法。

实际上在`gdb`调试阶段，在gdbclient端输入`load` 命令后已经将镜像烧写到目标板了，不过实际上有更为直接的方法，对于`pyOCD` 可以输入：

`pyocd flash xxx.elf -t xxxx` 即可,其中`-t`代表硬件类型，可以通过`pyocd list --target` 查看， 在`armdbg`中，已经将flash命令集成到makefile，可以直接通过
`make flash`进行烧写

[^1]: [armdbg](https://github.com/cheng3100/armdbg)
[^2]: [arm-none-eabi-gcc download](https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads)
[^3]: [pyOCD](https://github.com/pyocd/pyOCD)
