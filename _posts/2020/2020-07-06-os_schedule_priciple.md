---  
layout: post  
author: chenglong  
title: os调度原理
categories: [os]
description: 
keywords: os, schedule, 调度
---  

@[toc]

# 为什么要做任务调度-why
操作系统中最为显著的特性就是任务调度，任务调度主要来自于以下几种需求：
 
- 程序并发（multiprogram）
- 任务间同步、消息传递
- 实时性能要求

<!-- abs -->

1. 其中第一点程序并发很好理解，对于一般意义的单核硬件平台而言，任何特定时间实际只能有一个机器指令在执行（实际上对于现代cpu不准确，例如pipeline等硬件技术实际可以令单核cpu实现一定程度并行指令执行），因此只有实现任务调度才能实现多任务“齐头并进”的效果，各种任务调度算法实际是让每个任务在用户模式下有了独占cpu的“假象”，是对cpu硬件在时间维度上的抽象。这类任务调度一般表现为时间片形式。

2. 任务间的执行顺序和时机有时会需要按照一定逻辑规则进行，例如两个进程A\B，A向B写事件，B读取事件，逻辑上要求只有当A已经写过事件后，B才可以去读时间并执行操作，因此需要在读写事件的实现中显式地执行任务调用

3. 对于RTOS而言，对实时性有高要求，因此在有外部事件到达时，根据优先级需要立即进行响应，不同的外部事件一般对应不同的任务，因此在执行低优先级任务中有外部高优先级事件到达，则需要立即做任务调度

# 任务调度需要做什么？-what
任务调度实际做的就是实现两个任务的上下文切换（context）,或者可以理解未某一时刻某一个任务的所有状态信息，任务调度实际做的就是保存当前任务的状态并将要切换的任务状态恢复出来，一般而言，一个任务的上下文主要有以下几部分

- stack，函数调用栈、局部变量等
- heap， 动态申请的内存，而且一般由于heap中内存由局部指针变量指向，实际heap的信息也是需要stack共同参与保存
- register 具体执行时，函数中的各种变量间的运算、赋值，实际都是通过寄存器直接实现或者中转的，任务执行中一旦中断需要保存重要寄存器的信息，一般通用的保存方法是将寄存器最后压入栈中
- 系统状态 系统状态和具体硬件平台和os kernel实现有关，比如一些特殊寄存器，或者全局任务控制块（TCB）中的特定信息等

> 涉及任务上下文的操作需要在硬件的特权模式下使用特定指令执行，如切换sp指针等，所以os一般在任务调度的句柄中使用汇编直接处理

# 怎样实现任务调度？-how
不同os的任务调度的实现思路基本一致，这里用一种优秀的支持任务优先级抢占的Liteos源码举例说明，Liteos源码开源可在github上下载

开始任务调度后，主要分4个步骤

-   选取下一个需要调度的任务
```C
/* Find the highest task */
    g_stLosTask.pstNewTask = LOS_DL_LIST_ENTRY(osPriqueueTop(), LOS_TASK_CB, stPendList);

    /* In case that running is not highest then reschedule */
    if (g_stLosTask.pstRunTask != g_stLosTask.pstNewTask) {
    // do real schedual
    osTaskSchedule();
    //....
    }
```
Liteos支持任务抢占，按任务队列中最高优先级任务作为待切换任务

-  进入特权模式以及特权模式句柄
```asm
osTaskSchedule:
    LDR     R0, =OS_NVIC_INT_CTRL
    LDR     R1, =OS_NVIC_PENDSVSET
    STR     R1, [R0]
    BX      LR
```
osTaskSchedule开始进入汇编，
进入特权模式的方式取决于具体硬件平台，这里用arm-cotex-M架构举例，通过给NVIC_INT_CTRL寄存器置位，触发一个特定中断进入pendSV句柄
-   保存当前任务上下文
```asm
TaskSwitch:
    /**
     * R0 = now stack pointer of the current running task.
     */
    MRS     R0, PSP


    STMFD   R0!, {R4-R12}          /* save the core registers and PRIMASK. */

    LDR     R5, =g_stLosTask
    MOV     R8, #OS_TASK_STATUS_RUNNING

    /**
     * Save the stack pointer of the current running task to TCB.
     * (g_stLosTask.pstRunTask->pStackPointer = R0)
     */
    LDR     R6, [R5]
    STR     R0, [R6]

    /**
     * Clear the RUNNING state of the current running task.
     * (g_stLosTask.pstRunTask->usTaskStatus &= ~OS_TASK_STATUS_RUNNING)
     */
    LDRH    R7, [R6, #4]
    BIC     R7, R7, R8
    STRH    R7, [R6, #4]

    /**
     * Switch the current running task to the next running task.
     * (g_stLosTask.pstRunTask = g_stLosTask.pstNewTask)
     */
    LDR     R0, [R5, #4]
    STR     R0, [R5]
```
上面是保存当前任务contex的核心代码，`MRS     R0, PSP`指令获取当前任务sp指针，并通过接下来的STMFD指令将r4~r12保存到当前任务栈中，接下来修改全局os任务控制块信息，将当前任务状态由running切换为ready，并切换当前任务控制块到下个任务

> 注意，arm-m架构中，进入中断后，硬件会自动压入r0~r3,r12,Lr,pc,xpsr 8个核心寄存器到任务栈中，从中断返回也会自动对应出栈

-   恢复下一任务上下文，返回继续执行
```asm
    /**
     * Set the RUNNING state of the next running task.
     * (g_stLosTask.pstNewTask->usTaskStatus |= OS_TASK_STATUS_RUNNING)
     */
    LDRH    R7, [R0, #4]
    ORR     R7, R7, R8
    STRH    R7, [R0, #4]

    /**
     * Restore the stack pointer of the next running task from TCB.
     * (R1 = g_stLosTask.pstNewTask->pStackPointer)
     */
    LDR     R1, [R0]

 
    LDMFD   R1!, {R4-R12}          /* restore the core registers and PRIMASK. */

    /**
     * Set the stack pointer of the next running task to PSP.
     */
    MSR     PSP, R1

    /**
     * Restore the interruption state of the next running task.
     */
    MSR     PRIMASK, R12
    BX      LR
```
与保存旧任务现场类似，最后使用`MSR     PSP, R1`指令将任务栈指针sp切到新的任务的栈顶，并使用跳转指令BX从中断返回，一旦返回，则所有现场信息均恢复为新任务上次中断调度走的状态，其中包括PC指针，则下一个机器周期就会继续从新任务上次中断的地方执行，这样就实现了任务调度


【REF】
> [ref 1] [arm汇编指令集手册](https://developer.arm.com/architectures/cpu-architecture/m-profile/docs/ddi0553/latest/armv8-m-architecture-reference-manual)
> [ref 2] [内联汇编和汇编的两种语法规范(ATT/intel)](http://www.ibiblio.org/gferg/ldp/GCC-Inline-Assembly-HOWTO.html)



