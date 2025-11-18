---
layout: default
---

# Welcome to My Tech Blog

This is my personal tech blog where I share tutorials, guides, and thoughts on technology.

## Recent Posts

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}

---

## About This Blog

This blog is built with Jekyll and served using Docker + nginx. Check out the README.md for setup instructions!
