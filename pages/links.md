---
layout: page
title: Links
description: Friend links
keywords: 友情链接
comments: true
menu: 链接
permalink: /links/
---

> More about me

<ul>
{% for link in site.data.links %}
  {% if link.src == 'blog' %}
  <li><a href="{{ link.url }}" target="_blank">{{ link.name}}</a></li>
  {% endif %}
{% endfor %}
</ul>

> 友情链接

<ul>
{% for link in site.data.links %}
  {% if link.src == 'friends' %}
  <li><a href="{{ link.url }}" target="_blank">{{ link.name}}</a></li>
  {% endif %}
{% endfor %}
</ul>
