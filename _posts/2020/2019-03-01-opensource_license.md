---  
layout: post  
author: chenglong  
title: 开源license介绍
categories: [opensource]
description: 
keywords: opensource, license
---  

@[toc]

最近因为工作相关，学习了下开源license的资料，这里整理如下。同时本文本身遵循permissive license，大量参考了两篇文章，参考资料和作者披露在最后。

<!-- abs -->

# 开源license分类
开源licensen大体分为两类：宽松许可（permissive license）和严格许可（copyleft license）

## 宽松许可
这类许可的核心在于要求使用了开源代码的软件要有披露要求（notice requirement），即需要明确指出使用了哪些开源代码并附上原始作者，宽松许可主要有

### BSD（二条款）
分发软件时，必须保留原始的许可证声明
### BSD（三条款）
分发软件时，必须保留原始的许可证声明。不得使用原始作者的名字为软件促销。
### MIT
分发软件时，必须保留原始的许可证声明，与 BSD（二条款版）基本一致。
### Apache2
分发软件时，必须保留原始的许可证声明。凡是修改过的文件，必须向用户说明该文件修改过；没有修改过的文件，必须保持许可证不变。

## 严格许可（copyleft）
copyleft是GNU基金会的发起人理查德-斯托曼发明的一个词，与copyright一词相对，核心要求在于，阻止任何破坏软件自由的行为，具体来说，凡是使用了遵循copyleft许可代码的软件，则整个文件甚至工程必须全部开放并同样遵循copyleft许可，从这一点上说，copyleft许可就如同病毒一般，只要使用一点则整个软件都要遵循，同时扩散过程中不断加大遵循范围。这类license主要有
### AGPL
如果云服务（即 SAAS）用到的代码是该许可证，那么云服务的代码也必须开源。
### GPL
如果项目包含了 GPL 许可证的代码，那么整个项目都必须使用 GPL 许可证。
### LGPL
如果项目采用动态链接调用该许可证的库，项目可以不用开源。
### MPL
只要该许可证的代码在单独的文件中，新增的其他文件可以不用开源。

# 开源license限制

## 分发（distribution）

- 分发是开源license最重要的关键词之一，如果软件存在从法人传递到其他法人的行为，则称为软件分发，注意这里的主体是法人，因此公司内部使用的软件也是不构成分发的

- 对于设计用来提供云服务（即SaaS）的软件，是被认为不构成分发的，但AGPL license例外，也就是说，除了AGPL license，即使软件中用到开源代码，只要是作为云服务的方式，就不用遵循开源许可。

## 披露要求（notice requirement）
- 所有开源licesen均需要遵循披露要求，按照严格程度主要包括向用户披露软件中包含了开源代码和披露开源代码的作者
- 一般形式是在分发软件中包含license.txt等形式，但总体原则是能够清楚无误地向用户传递license信息

# 闭源软件的开源代码使用策略
以上可以看出，开源代码并不是随意拿来用没有限制地，但也不是说只要用了开源代码就不能闭源，这里分情况讨论

## 有无分发
- 将软件作为无分发使用
因为分发地主体是法人，因此在公司内部使用开源软件和代码制作研发工具等行为都不构成分发，也就可以保持闭源，其他例如提供给公司内部使用的软件如专用内部通讯工具等也属于这个情况

- 将包含开源代码的软件云化（SaaS）
除了AGPL以外，其他license都不将SaaS云华服务软件构成分发，因此对于某些不得不提供给外界作为商业用途的软件，可以考虑是否可以云化，这样就规避了开源许可

## 是否为宽松许可
前面可以看出，宽松许可的限制只是披露要求，而严格许可则几乎无法保持闭源，因此在不得不使用开源代码的时候，尽量选用宽松许可如BSD、MIT下的代码

**【参考资料】**
[阮一峰：开源许可证基础知识扫盲](https://www.oschina.net/news/90054/opensource-license-introduction)
[Heather Meeker-9 open source license management rules for startups](https://opensource.com/article/17/9/9-open-source-software-rules-startups)


