---  
layout: post  
author: chenglong  
title: x86 实模式和32位保护模式
categories: [os]
description: 
keywords: os, real mode, protect mode, x86, 实模式, 保护模式
---  

@[TOC]

# x86寻址方式
## 基址-偏移寻址
x86 cpu的寻址方式在历史早期主要是**分片寻址(segmentation)**，其基本设计是任何地址由base 和 offset组成，通过将地址空间按不同规则切分成多块，每块起始地址作为base，在每个区块的偏移作为offset即可定位到具体物理地址，分片寻址在x86历史主要有两种

<!-- abs -->

- real mode
- 32bit protect mode
real mode(实模式) 主要用在早期16bit机器上，其寻址范围为`[0, 1Mb]`, 32bit protect mode是从里程碑式的80386 cpu开始使用的，将寻址范围扩展到整个32位空间即`[0, 4Gb]`.

## 分页寻址
在现代的操作系统和处理器中已经基本不再使用分片寻址方式，仅作为历史适配，更为广泛使用的是分页寻址(paging)， 分页寻址将地址区分为虚拟地址和物理地址，通过页表将两者映射，这样对于编程语言而言只需要关注虚拟地址即可，因为这种情况下虚拟地址空间是完全平坦统一的，因此又被称为flat addr space(平坦地址空间).

# 实模式寻址
实模式寻址（real mode）非常简单，其形式为`cs:ip`，其中`cs`为分片寄存器（segment register），x86一共有6个分片寄存器，这里暂时只需要关注`cs`知道其为代码段的分片寄存器即可。`cs`作为基址，`ip`为`eip`寄存器代表偏移值，两者的范围均为`[0, 0xffff]`, 可以发现只使用了16位，这是因为实模式只在16位机器时代运用，现代32或者64bit机器出于适配在启动时仍然会进入模拟16bit模式以使用实模式。

实模式下地址为`addr = cs * 0x10 + ip`，因此该模式下最多访问到1Mb地址空间，每个分片寻址空间为64kb。
## x86 分片寄存器

|register|usage |
| -- | -- |
|CS  |  Code Segment|
|DS | Data Segment|
|SS | Stack Segment|
|ES  | Extra Segment|
|FS  | General Purpose Segments|
| GS   |General Purpose Segments|

# 32位保护模式寻址

32 bit protected mode 是随着80386诞生而出现的，该寻址模式将地址空间扩展到整个32bit，最大寻址4Gb，这里的**保护模式**指的是每个分片可以指定CPU的执行权限等级，即 cpu ring0~ ring3，这样同时增加了权限保护。

这种模式的分片不再是固定，而是通过一个特殊格式的表来确定，称为`GDT(global descriptor table)`, 使能时需要将该表的地址通过`lgdt`命令载入，GDT表的有多个entry，对应多个分片，运行时`cs`寄存器不再使用具体的值，而是赋值为需要的分片entry在GDT中的偏移。

## GDT结构 

### GDT head
![2020/09/GDT](/pic/2020/09/GDT.png)

- size 为所有GDT entry的大小减1，减1是因为最大size可为65536，而32bit最大只能表示65535，同时size也不会为0.
- offset为之后的GDT entry 表的起始物理地址

### GDT entry
![2020/09/gdt_entry](/pic/2020/09/gdt_entry.png)

每个GDT entry 大小为8个byte, 其中Base一共有4个字节，范围[0, 4Gb], Limit一共占据20bit, 范围 [0, 1Mb], 剩余为一个8bit的AccessByte 和Flags，他们的结构如下：

![2020/09/gdt_flag](/pic/2020/09/gdt_flag.png)


其中每个位的详细含义可以查阅 [^1][^2],其中值得关注的主要有：
- Privi : 0~3代表CPU ring0~ring3
- Ex: 为1代表可执行用于代码段，为0用于数据段
- Gr: 分片粒度，为0则每个offset代表一个byte,为1则每个offset代表4Kb,如果此时将base设为0，Limit设为0xfffff,则此时一个分片即扩展到整个32bit空间即4Gb，通常在用不到分片而使用页表时这样设置



[^1]: [80386 reference guide](https://pdos.csail.mit.edu/6.828/2018/readings/i386/toc.htm)
[^2]: [Global Descriptor Table](https://wiki.osdev.org/GDT)



