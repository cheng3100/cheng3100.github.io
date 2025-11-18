---
layout: post
# Title: Can be set manually, or left empty to auto-derive from filename
# If empty, layout will extract title from filename (format: YYYY-MM-DD-title.md)
# Example: filename "2020-11-28-arm-development.md" → title "Arm Development"
title: template page
# Author: Optional - if not set, will use site.author from _config.yml automatically
# Access in layout: {{ page.author | default: site.author }}
categories: [cate1, cate2]
description: some word here
keywords: keyword1, keyword2
---

Abstract

<!-- abs -->


this is ref[^1]

> the excerpt_separator var in _config.yml setting the symbol of abstract

Content here

[^1]: [ref](website)
