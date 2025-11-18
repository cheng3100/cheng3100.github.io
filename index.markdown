---
layout: default
---

# Welcome to My Tech Blog

This is my personal tech blog where I share tutorials, guides, and thoughts on technology.

**Links:** [👤 About](/about/) | [⭐ GitHub](https://github.com/{{ site.github_username }})

## All Posts

{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
- {{ post.date | date: "%Y-%m-%d" }} - [{{ post.title }}]({{ post.url }})
{% endfor %}

---

## About This Blog

This blog is built with Jekyll and served using Docker + nginx. Check out the README.md for setup instructions!
