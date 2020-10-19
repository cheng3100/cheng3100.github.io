---  
layout: post  
author: chenglong  
title: vim_all_in_one_2  
categories: vim
description: vim配置教程，包括自己的一个vim一键式配置项目
keywords: vim, ide
---  

# 4 vim with plugin  
vim 一大扩展方式是使用插件，所谓插件其实还是一系列vim脚本，但以一种便于管理的形式组织了起来，其中用于管理插件的本身就是一种插件，插件管理插件比较常用的是`vundle`  
======

## 4.1 vundle框架  

vundle的组织形式是将所有未来将要安装的插件统一放在一个目录下，这个目录一般命名为`.vim`并放在家目录下如`~/.vim/`，vundle这个管理插件本身也放在这个目录下，**注意这个目录本身对于命名和位置没有特殊要求**，vim的**唯一**的默认配置文件是`~/.vimrc`,通过在`.vimrc`中指定.vim文件夹路径的方式将插件管理器关联并加载进来  

## 4.2 vundle安装  

执行`git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim`,或者手动下载下来后，将目录解压到`~/.vim`中即可  

## 4.3 vundle配置  

前面说到vundle的插件目录本身vim是不知道的，需要在.vimrc中进行配置，这里给出通用方法：  

```shell  
set nocompatible              " 这是必需的  
filetype off                  " 这是必需的  

" 在此设置vundle插件本身的路径  
set rtp+=~/.vim/bundle/Vundle.vim  

call vundle#begin()			"插件列表起始  
" vundle 插件管理器本身需要列在其中  
Plugin 'VundleVim/Vundle.vim'  
" 放置需要的插件名称  
Plugin 'scrooloose/nerdtree'  

call vundle#end()            " 插件列表结束  
filetype plugin indent on    " 这是必需的  

```  



如上图，主要两部分，一部分是必须的配置如第一行，第二部分即为插件列表，注意这里的插件名称前面加上"https://github.com/"即为该插件在github上地址，即vundle的插件全部通过github进行下载安装  

## 4.4 vundle使用  

打开vim，命令模式下按下`:PluginInstall` 即可安装上面插件列表中列出的插件，注意命令模式下支持tab联想，可以自行查看插件更新、删除等更多命令  

当install完成后，便可以使用这些插件了  



## 4.5 常用插件推荐  

- nerdtree  

  可以打开一个侧边栏实现目录管理  

- nerdtree-git-plugin  

  配合nerdtree，在目录的文件上显示git的状态，如修改文件末尾显示`*`，新增文件显示`+`等  

- cscope  

  注意这里是cscope的插件，需要已经安装了cscope，用于c/c++代码查找函数定义、查看被调用等，插件实现了搜索结果以新增窗口显示等功能，更加方便使用  

- ctrlp  

  模糊文件查找插件，动态模糊进行文件查找，非常方便也很快  

- octol/vim-cpp-enhanced-highlight  

  一个不错的c/cpp代码高亮插件  

以上几个插件的具体使用方法可以见各自插件的github页说明，同时为了方便起见，一般插件都可以在`.vimrc`中自定义快捷键映射，一般来说对于c/c++工程以上插件就足以使用了，不过你可以根据需要找到各种各样的插件进行安装使用，或者参考[我的vim例子](https://github.com/cheng3100/myvim/)  



# 5 vim with others  

vim常常会需要在其他场景下配合使用，例如git中查看diff等  

## 5.1 git difftools  
**config git editor**  
`git config --global core.editor vim`  

**configure vim as git diff tools**  
`git config --global diff.tool vimdiff`  
`git config --global difftool.prompt fasle`  

**vimdiff use**  
`git difftools` : open diff with difftools  
`]c` : jump to next change  
`[c` : jump to last change  
`qa!` : close vim diff  
`qa` : close current file diff ,will auto jump to next file diff  

> git diff use:  
> `git diff --cache` : show diff include staged file  
> `git diff --stat`  : show overview of diff  
> `git diff -vv` : show diff between staged and unstaged file  

效果如下，还是非常方便的  

![image-20200519210746252](/pic/2020/05/image-20200519210746252.png)  
