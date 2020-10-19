---
layout: page
title: About
description: My Zone
keywords: Long Cheng, 程龙
comments: true
menu: 关于
permalink: /about/
---

Fun, Codiing and Hacking !

对所有好玩的东西都感兴趣，喜欢时不时整理自己的学习，希望可以一直保持学习的状态到老

> 要多锻炼身体，少加班，多提PR ;)

## 联系

<ul>
{% for website in site.data.social %}
<li>{{website.sitename }}：<a href="{{ website.url }}" target="_blank">@{{ website.name }}</a></li>
{% endfor %}

{% if site.url contains 'mazhuang.org' %}
<!-- <li> -->
<!-- 微信公众号：<br /> -->
<!-- <img style="height:192px;width:192px;border:1px solid lightgrey;" src="{{ assets_base_url }}/assets/images/qrcode.jpg" alt="闷骚的程序员" /> -->
<!-- </li> -->
{% endif %}
</ul>


## Skill Keywords

{% for skill in site.data.skills %}
### {{ skill.name }}
<div class="btn-inline">
{% for keyword in skill.keywords %}
<button class="btn btn-outline" type="button">{{ keyword }}</button>
{% endfor %}
</div>
{% endfor %}
