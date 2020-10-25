---  
layout: post  
author: chenglong  
title: os临界区保护和互斥锁原理
categories: [os]
description: 
keywords: os, mutex, critical region, 互斥锁, 临界区
---  

# 什么是临界区保护？
>临界区（critical region）是指一段特定的代码行为集合，其中可能包括对数据的修改，执行一段特定逻辑等等。

<!-- abs -->

临界区的概念是因为并发编程(multiprogram)的出现导致的，当出现多个task、多个cpu、甚至网络中多个服务器对同一个逻辑对象操作时，就会有条件竞争出现，如果设对该逻辑对象的操作为A，此时必须对A做特殊保护，约定对这A的这种特殊保护统称为临界区保护（mutex exclue），称A操作的范围为临界区。

# 临界区不保护会出现什么问题？
举例说明，假设有两个task都执行如下代码：
```c
// p is a global var
// ...
	if (p == NULL) {
		p = malloc(N);
	}
// .do some thing
	free(p);
```
这里至少有两个问题：
- 假设任务1和任务2都同步走到判断p是否为NULL的语句，两个任务均判断p为NULL，接着1先分配内存，紧接着2又重新给p分配内存，导致1任务内存泄漏
- 1任务内存泄漏后p实际指向b任务分配区域，此时1释放p会导致2中不可预期的错误，比如访问0地址

因此在这段代码前后都应作为临界区保护

# 临界区保护的原理
临界区保护有多种思路，比如可以重新设计任务改造为无锁算法、比如设计任务之间的执行顺序令不会出现同时访问临界区的情况等，但通用的思路一般是在令任务对临界区访问实现互斥，这种思路称为mutex锁。
mutex主要就2种操作，分别是加锁和解锁，我们这里设为P和V操作，那么上述代码应该改为
```c
// p is a global var
// ...
	P(m);
	if (p == NULL) {
		p = malloc(N);
	}
// .do some thing
	free(p);
	V(m);
```
假设已经实现了P\V接口，则当任务1先获取锁P(m)成功后，此时如果任务2再获取P(m)会发生失败，系统会保证只有任务1释放锁后任务2才可以P成功并进入临界区。
那么mutex接口具体怎么实现呢？
# mutex锁的实现原理
mutex锁的原理核心主要两个部分，分别是
- **原子地判断并设置标志位**
- **对判断结果的处理策略**

这两个部分的具体实现在单核和多核平台、有无cache情况下又有较大区别，这里我们先以单核无cache为例说明
### 原子地判断并置位标志位
这里的标志位本身可以是一个普通内存变量，对于临界区保护而言只需要标志位有两个状态，比如0代表未被上锁，1代表已上锁，只是这里需要注意地是这个过程必须是”原子“的，假设我们这样实现P操作
```c
	// Wrong mutex implement！
	bool P(mutex m)
	{
		if (m == 0) {
			m = 1;
			return true;
		}
		return false;
	}
```
敏锐的读者应该发现这个方式很显然行不通，原因和上面的例子一样，因为可能出现两个任务同步进入判断m是否为0的语句，同时获取到锁，也就没有起到保护作用。
分析起来根本原因就是mutex标志位的判断本身应该是原子性不可分割的，对于单核平台而言，只需要实现这个过程种没有发生调度切到其他任务即可，一般可以通过关中断实现，
```c
	// not complete mutex implement！
	bool P(mutex m)
	{
		LockInt(); 	// key step! ensure atomic!
		if (m == 0) {
			m = 1;
			UnLockInt();
			return true;
		}
		UnLockInt();
		return false;
	}
```

这样便保证了mutex的持有与否的判断是可用的了，但实际上这个实现还是有问题，这个就是对这个判断结果如何处理

### 对判断结果的处理策略
如果获取到锁，自然是继续往下执行。但如果获取不到锁应该如何处理呢？mutex以及各种变形的具体实现的差异主要就在这里，总体上，分为两种策略 switch/spin

- switch 策略
如果获取不到锁，则立刻把当前任务挂起，或者直接切换到其他任务，一般可以在mutex变量里维持一个链表，将未获取到锁的任务挂起并附在这个链表上，一旦已经持有锁的任务释放锁，就会检查这个链表上的任务并唤醒。这样好处是cpu运行效率更高，但任务切换本身有开销，如果对于临界区本身执行时间很短的情况下会造成性能下降

- spin 策略
spin，自旋，顾名思义就是当获取不到锁的时候，立刻或者隔一段时间再询问是否获取锁，反复如此直到能够获取到锁，实际上这种策略下一般称为spinlock，而且往往只能用于多核平台，想象一下如果单核平台CPU始终被某任务占据始终轮询锁的标志位，那么实际持有锁的任务无法得到调度也就无法释放锁，便造成死锁。
这种策略由于没有调度开销对于多核平台会有更高效率，但如果临界区时间较长，会造成CPU被浪费大量时钟只用于轮询，造成CPU利用率的下降

# 进一步延生
以上只涉及到mutex以及各种变形实现的一个极其简化的基础框架，其中尤其涉及到对锁标志位的原子判断和处理策略在多核平台下有大量的实现方式和研究成果，后面有机会会再整理详述

如果希望阅读os对mutex的源码实现的朋友，建议先读一些RTOS的实现，其原理和思想与linux非常接近，而linux本身需要适配的场景和平台太多，有太多与核心思想无关的代码，尤其是各种适配宏，没有实现理解者很难读。
> TIP 打个广告，本人作为开源操作系统Liteos的内核开发组人员，欢迎大家在github上下载使用！
[liteos一个开源IOT系统](https://github.com/LiteOS/LiteOS)
