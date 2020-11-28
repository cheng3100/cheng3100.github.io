---
layout: post
title: arm cortex m3 启动流程解析
categories: [arm]
description: arm cortex m3 的启动流程
keywords: arm, linux, gdb
---

arm cortex m3 是非常常用的一个芯片框架，主要用于一些消费电子场景中，这里对它的启动流程做一个详细的介绍

<!-- abs -->

# start up file

# 初始化栈指针

# 载入中断向量表

# 载入初始化的全局变量段(.data)

# 载入未初始化的全局变量段(.bss)

# 载入代码段(.text)

# 跳转主函数入口
