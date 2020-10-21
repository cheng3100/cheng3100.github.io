---  
layout: post  
author: chenglong  
title: python使用ctype调用C库的方法
categories: [python]
description: 
keywords: python, ctype, lib
---  

@[toc]

python中可以通过ctype库来实现调用C库，这里给出相关的使用说明

<!-- abs -->

# 1 生成被调用的C dll
## 1.1 C文件编译为C动态链接库
- 在windows下，需要配置visual studio的工程设置，将工程编译为dll，细节不在这里赘述
- gcc环境下，需要编译为.so文件，需要修改makefile的链接参数，这里也不再赘述

## 1.2 用于外部引用的C函数声明

### 1.2.1 声明用于作为dll符号给外部调用

在函数声明加入前缀，如
`
__declspec(dllexport) int Fun(int a, int b)`
否则在加载该dll时会提示找不到该符号

在windows下可以通过vs自带的dumpbin工具查看可被调用符号
`dumpbin /exports test.dll`

### 1.2.2 C函数的调用规定
C函数在调用过程中关于参数传递和压栈由多种规定，作为dll提供给其他程序调用时，必须明确并统一为同一种调用规定，否则会导致栈破坏，编译器负责具体实现调用规定，主要有以下几种调用规定

|调用规定|声明|编译符号修饰|调用规则|说明|
|:-|:-|:-|:-|:-|
|_stdcall|`__declspec(dllexport) int __stdcall fun(int a, int b)`|_fun@number|参数从右向左入栈，调用者压栈，被调者负责弹栈|win32 API默认调用规则|
|_cdecl|`__declspec(dllexport)int __cdecl fun(int a, int b)`|_fun|参数从右向左入栈，调用者负责压栈和弹栈|C/C++默认调用规则|
|_fastcall|`__declspec(dllexport)int __fastcall fun(int a, int b)`|@fun@number|寄存器和栈共同参数与参数传递|寄存器传参提高性能，难以跨平台|



# 2 ctypes加载dll库接口
python下调用C库有多种方式，ctypes是其中一种比较方便的，调用时首先需要加载dll文件，根据C dll的调用规定不同需要使用不同接口，使用ctypes需要`import ctypes`库


- 对于stdcall的C dll
```python
import ctypes
Objdll = ctypes.windll.LoadLibrary("dllpath") #接口1
Objdll = ctypes.WinDLL("dllpath") #接口2
```
>以上两种接口都是可用的

- 对于cdecl的C dll
```python
import ctypes
Objdll = ctypes.cdll.LoadLibrary("dllpath")  
Objdll = ctypes.CDLL("dllpath")  
```

对于简单的C函数，例如`int add(int a, int b)`， 此时就可以直接调用了，如
```python
import ctypes
Objdll = ctypes.cdll.LoadLibrary("dllpath")  
Objdll = ctypes.CDLL("dllpath")  

c = Objdll.all(1,3)
print(c) # 4
```



# 3 ctypes调用C函数参数传递
对于较复杂的C函数的参数情况，ctypes调用时对入参和出餐做一定处理，这里分情况讨论

## 3.1 出参为指针
- C代码
```C
/* Divide two numbers */
int divide(int a, int b, int *remainder)
{
    int quot = a / b;
    *remainder = a % b;
    return quot;
 }
```
- python代码
```python
# int divide(int, int, int *)
_divide = _mod.divide_divide.argtypes = (ctypes.c_int, ctypes.c_int, ctypes.POINTER(ctypes.c_int))_divide.restype = ctypes.c_int

def divide(x, y):
    rem = ctypes.c_int()
    quot = _divide(x, y, rem)

    return quot,rem.value
```

## 3.2 入参为字符串
- C代码
```C
void PrintfInfo(char *str)
{
    printf("the str is %s\n", str);
}
```
- python代码
```python
sBuf = 'aaaaaaaaaabbbbbbbbbbbbbb'
pStr = ctypes.c_char_p( )
pStr.value = sBuf.decode() #c_char_p类型的value只接受bytes类型数据

dll.PrintInfo(pStr)
```
>这里使用了ctypes的内置类型c_char_p，对应于C的char数组，更多ctypes类型与C类型对照在后面附上


## 3.4 入/出参为结构体

- C代码
```C

typedef struct   

{  

char words[10];  

}keywords;  



typedef struct   

{  

keywords *kws;  

unsigned int len;  

}outStruct;  

extern "C"int __declspec(dllexport) test(outStruct *o);  

int test(outStruct *o)  

{  

unsigned int i = 4;  

o->kws = (keywords *)malloc(sizeof(unsigned char) * 10 * i);  

strcpy(o->kws[0].words, "The First Data");  

strcpy(o->kws[1].words, "The Second Data");  



o->len = i;  

return 1;  

}  
```
- python代码
```python
# C结构体需要专门定义class对应
class keywords(Structure):  

        _fields_ = [('words', c_char *10),]  



class outStruct(Structure):  

        _fields_ = [('kws', POINTER(keywords)),  

                    ('len', c_int),]  

o = outStruct()  

dll.test(byref(o))  



print o.kws[0].words;  

print o.kws[1].words;  

print o.len  
```

以上包含了几种主要的参数传递情况，ctypes也提供了一个较为完整的python类型和C类型的对照，如下：
![2020/ctype](/pic/2020/ctype.png)
