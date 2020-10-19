---
layout: post
author: chenglong
title: vim_all_in_one_1
categories: vim
description: vim配置教程，包括自己的一个vim一键式配置项目
keywords: vim, ide
---

# 总览
近期因为换了工作缘故，尝试完全切换到了vim上进行代码编写工作。在之前其实本人曾多次尝试切换到vim上，但最终总是因为各种各样的问题，或者缺乏某些IDE上熟悉方便的功能替代而放弃，虽然包括vim配置、插件管理等都已经接触过，但一直是抱着认为vim的综合效率实际是不如IDE的想法的。但最近解决了一些之前的几个问题之后，感觉豁然开朗，才真正明白在代码编写的这个场景下，在正确的运用和配置后，vim的确是有极高效率的，效率上限应该是超过ide的，原因在于vim针对代码编写这个场景做了很多特殊的优化。而之前看到的太多vim的介绍文章，要么就是重点不清，要么就是语焉不详以其昏昏使人昭昭，将本身很简单的事情搞得很复杂，因此这里开始自己写一个系列文章，主题就是“vim all in one”，即所有你需要知道的vim知识都在这一个系列文章中即可获得。

======

> 这里我会将完备而又极为精简实用的vim知识按一个合理顺序列出，只要你花费一定理解精力顺序读完这个系列，无须任何多的繁琐配置，就可以轻松获得类似如下界面的vim使用方法，并保证可以完全替代一般的IDE

![image-20200515210546609](/pic/2020/05/image-20200515210546609.png)

**提前给出我自己写的一个vim一键式配置工程**

[my vim auto config](https://github.com/cheng3100/myvim)

# 0. 字符说明

后面会给出一些命令格式说明，这些命令格式也是通用于vim的各种说明文档，其中注意：

- `gg` : 单个或连续的普通字符，代表一般命令，按顺序按下即可，例如这里`gg`来代表连续按下两次`g`可以回到页首
- `<C-w>` : <> 包含的为特殊按键，如这里的C代表ctrl按键，w为普通字符按键w，注意中间的`-`代表需要按下`ctrl`键不放同时按下`w`按键
- `<Leader>` : 一个特殊字符，vim的引导键，是一个用户自定义的按键，默认没有指定，作用是用于方便用户自定义的命令，，可以都以这个按键开头作为用户自定义命令
-  `{char}` : 代表一个任意的字符，如命令`r{char}`， 先按下`r`键，再按下需要的字符，代表将光标当前的字符替换为需要的字符，类似的还有`{n}`,代表需要的一个数字

# 1. vim mode

不同于如notepad这样的常规编辑器，vim有3种基本模式，分别是

## 1.1 insert mode

即一般的编辑模式，进入方式是按下`i`按键进入，此模式下正常输入字符

## 1.2 normal mode

打开vim后默认进入该模式，当任意状态下按下`<esc>`也进入该模式，该模式下主要是用于发送vim命令以及进行vim的临时配置，分别举例如下：

- 发送命令：vim打开一份示例文档，按下`<esc>`进入normal mode，然后按下命令`G`,注意此处为大写，可以看到光标立即跳转到页尾行，该命令的意义即是跳转到当前页面的最后一样，再按下`gg`，则回到第一行
- 临时配置：进入normal mode，输入`:set number`,注意不要省略开头的`:`，可以发现此时所有行都被标记上行号，再次输入`:set nonumber`,可以发现此时行号又消失了，这两个配置即为行号显示/隐藏配置，但这里的配置是**临时的**，重新打开文档后配置不会保存下来，需要永久配置只需要将命令保存到`~/.vimrc`中即可，后面会讲到

## 1.3 visual mode

选择模式，在normal mode下按下`v`，再上下左右移动，可以发现从初始光标位置开始文档内容被高亮选中，该模式的作用就是选中指定区域的内容，以供后续的修改复制等操作。

# 2. vim config file structure

这里单独加上这一节，说明以下vim的配置文件结构，或者说，配置vim一共需要牵涉哪些文件，这里很多文章都解释的很烂，其实只需要关注一个文件，就是`~/.vimrc`,这里我说一下这个文件

`.vimrc`是唯一的vim用户配置文件，格式遵循vim自己的一个vim脚本语言，这个文件是可选的，当vim每一次被打开后，vim会在**指定的目录**下查找`.vimrc`文件，如果存在则根据vim脚本语言将其执行一遍，一般其中会包含一些配置命令，如上面提到的显示行号命令，这样每次打开vim都会显示行号了。

这里需要注意的是**指定目录**，vim会在一个系统环境变量`$HOME`下去找这个`.vimrc`文件，对于linux系统这个环境变量本身就是存在的就是用户的家目录，可以通过`echo $HOME`查看，对于windows系统，一般需要自己去增加这样一个环境变量指定一个家目录，并将.vimrc文件放到这个目录即可。

> **.vim/ 目录**

这里要注意的是另外一个特殊目录，`~/.vim/`目录，这个目录准确说其实并不是一个额外的新的设计，它作用是存放vim的插件管理脚本文件，这个目录本身也是需要在`.vimrc`文件中告知其路径，然后进行插件管理，所谓插件其实也是一系列vim脚本文件，只是为方便起见没有全部放在`.vimrc`一个文件中，而是单独存放，通过一个特殊vim脚本即插件管理插件进行管理，常见的插件管理如`vundle`

> 其实以上便是理解vim的核心关键了，剩余的主要是查找需要的命令/插件并掌握使用了



# 3 vim 基本使用

> 在盲目使用任何插件配置前，首先需要的是了解vim本身自定义的命令和配置的范围，而这个本身其实就已经针对代码编辑做了很多特殊处理优化了

## 3.1 basic control

- **move**  
    - line move  
    `<c-e>`, `<c-y>`: 不移动光标下逐行翻页  
    `<c-f>`， `<c-b>`: 整页上下翻页，光标相对位置不变  
    `zt`、 `zz `、`zb`: 将当前行置于页首、中、尾  
    `：{n} `  移动到n 行  
    `H`、 `M` 、`L `: 移动光标到当前页面的上/中/下位置  
 
    - word move  
    `w`，`b`：右移、左移，以单词分隔  
    `W`，`B`：右移、左移，以空格分隔  
    `e`，`ge`：右移、左移到单词尾  
    `E`，`gE`：右移、左移尾，以空格分隔  

    - block move  
    `]]` / `[[` : move to next/pre fun start( which is included by " { }"  


- **edit**  
    - create:  
    `o` / `O` : start a empty line after/before current line  
    - delete  
    `dd` : delete current line  
    - change  
    `cw` : change a word(delete current word and enter insert mode)  
    `C` : change from current to end of line  
    `cc` : change entire line  
    ` r{char}`  : change the char with {char}, and you can repeat it through move with `.`  

- **search**  
`nohl` : close the highlight of search result  

- **substitute**  
`:{作用范围}s/{目标}/{替换}/{替换标志}`  
    - `:%s/foo/bar/g` : 全局将foo替换为bar  
    - `:%s/foo/bar/gc` : 全局将foo替换为bar，with check confirm  
    - `'<,'>’s/foo/bar/g` : 选中区域替换  

- **format**  
    - format tab/space  
    `=` : you can use `gg=G` format all the page  
    `gg=G` : format all the pages  
    `nnoremap <silent> <F5> :let _s=@/ <Bar> :%s/\(\s\\|\t\)\+$//e <Bar> :let @/=_s <Bar> :nohl <Bar> :unlet _s <CR>` : remove the backend tab/spaces  

 - **show**  
    - `<ctrl-r>-l` : refresh the output draw  
    -  `<ctrl-r>-z` : return to bash
    - `fg` : back to vim  
    
- **windows**  
    - `<C-w>x` 、`<C-w>X` : exchange two Windows in a row or column  
    - `<c-w>r` 、 `<c-w>R` : rotation in row or column  
    - `<C-w>j` 、`<C-w>k` 、`<C-w>-h` 、`<C-w>l` : jump to up/down/left/right windows  

## 3.2 basic setting  
- **display**  
    - show tab/enter  
    `:set invlist` : toggle between show/not show  
    - tab as space  
    `set expandtab` : set tab as space  
    `set tabstop=4` : set tab as 4 spaces  
    `set shifwidth=4` : set tab as 4 spaces when format  
    `set softtabstop=4` : regard continuous spaces as tab  
    
 - **search**  
 `set incsearch` : search online  
 `set hlsearch ` : highlight search results  
