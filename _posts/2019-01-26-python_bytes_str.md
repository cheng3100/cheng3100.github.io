---
layout: post
author: chenglong
title: python byte类型与int、str类型转换
---

# bytes类型解释
python中的bytes类型可以类比为C中的uint8型数组，本质就是顺序排列的8bit二进制数字，例如以二进制方式从文件中读取时返回的就是bytes类型，或以b前缀的字符串也是bytes类型，如

``` python
 a = b'abcd'
print(type(a))
```

返回`<class 'bytes'>`

## bytes类型与ascii码、str类型区别
bytes类型非常容易和ascii码以及str类型混淆，我也中间被绕晕几次，现在整理如下
- bytes类型和ascii码

```python
import sys

b = b'\x61\x62\x63\x64'  #代表4个beyte的16进制数字，分别是0x61 0x62 0x63 0x64 即97~100
b = b'abcd'       #代表abcd的ascii码对应的4个1byte数字，分别是97、98、99、100
for i in b:
    print(b)    # 97 98 99 100

print(a==b)  #True
```
bytes只是一个8bit数字为一个单位元素的数组，而ascii是解析这样一个数字数组的解码方式，类似的还有utf-8等

- bytes类型与str类型

 ```python

b = b'abcd'
print(b[0])        #97
print(int(b[0])    #97

s = 'abcd'      #并不代表内存中是按abcd的ascii码存储的！str实际是一个对象而不是一个简单数组
print(int(s[0]))    #error 因为str类型的每个元素不是一个简单数字！

```
str是一个对象类型，不是C中的字符串概念，无法直接强转为数字

>bytes类型就是最基本的"code"，即连续的二进制数字，而对bytes类型做不同的”解释“, 按照ascii码解析得到了str，按照utf-8解析，可以得到更多字符表示

# bytes类型的解析

bytes类型的解析可以分为两类，一类是解析为数字类型，一类是解析为文本

## bytes解析为数字

主要分为解析为 UINT8、UINT16、UINT32、UINT64等数字类型，即分别对应将每1、2、4、8个字节放一起解释为一个数字，这其中对于多于一个字节的情况又分大小端处理
推荐使用自带的struct库解析，方法比较通用

- 用法
`strcut.unpack(fmt, byte)`
其中fmt为格式化字符串，分为两部分，开头控制大小端，后面通过字符控制数字类型，常用如下

|fmt|含义|
|:--|:--|
|!|大端序，和>相同 |
|>|大端序|
|<|小端序|
|B|uint8类型|
|b|int8类型|
|H|uint16类型|
|h|int16类型|
|I|uint32类型|
|i|int32类型|
|L|uint64类型|
|l|int64类型|
|s|ascii码，s前带数字表示个数|

更多详细fmt的用法可用`help(strcut)`
- 例子
```python
import struct

m = b'\x01\x01\x02\x01\x02\x03\x04' #7个字节
a=struct.unpack('!BHI', m) 

for i in a:
    print(hex(i)) # 0x1 0x102 0x1020304
```


## bytes解析为文本

文本最终是属于某一种字符集的，ascii码是一种最常见的字符集，而为了表示汉字等还有utf-8以及unicode等字符集，从bytes解析到文本常用两种方法

- decode方法(通用)
```python

b = b'\x61\x62'
b2=b'\xe4\xbd\xa0\xe5\xa5\xbd'

print(b.decode('ascii'))  #a b
print(b2.decode('utf-8')) #你好

errb = b'\x80\x61'
print(errb.decode('ascii'))  #error！ 0x80不是ascii字符集的元素！
```
bytes类型自带的decode方法即可，入参指定解析字符集，但有的时候bytes流中可能包含不止一种字符集的数字，此时解析就会有问题，如解析报文流的时候

- struct方法(解析ascii)
```python
import struct
b= b'\x80\x61'

m=struct.unpack('!B1s', b)
for i in m:
    print(m) # 0x80, b'a'

print(m[1].decode())
```
通过s前指定数字来限定解析为ascii的byte范围，这样就对bytes中混合代表数字和代表ascii的字节做分别解析了
>注意，strcut的s解析出认为bytes类型，需要进一步decode解析为str类型

