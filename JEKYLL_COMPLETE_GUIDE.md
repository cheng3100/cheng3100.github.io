# Jekyll Complete Guide

A comprehensive guide covering all aspects of working with Jekyll blogs, from content organization to styling and customization.

## Table of Contents

1. [Content Organization](#part-1-content-organization)
   - [Posts vs Pages](#posts-vs-pages)
   - [Hiding Blog Posts](#hiding-blog-posts)
   - [Creating Pages Outside `_posts/`](#creating-pages-outside-_posts)
   - [Practical Examples](#practical-examples)
   - [Best Practices](#best-practices)

2. [Markdown Styling](#part-2-markdown-styling)
   - [Where Styles Come From](#where-styles-come-from)
   - [What You Can Customize](#what-you-can-customize)
   - [How to Customize](#how-to-customize)
   - [Style Examples](#style-examples)
   - [Quick Reference](#quick-reference)

3. [Using Local Images from _pic/ Directory](#part-3-using-local-images-from-_pic-directory)
   - [Directory Structure](#directory-structure)
   - [How to Reference Images](#how-to-reference-images)
   - [Path Reference](#path-reference)
   - [Configuration](#configuration)
   - [Best Practices](#best-practices-1)
   - [Troubleshooting](#troubleshooting)

---

# Part 1: Content Organization

This section explains how Jekyll organizes content, the difference between posts and pages, and how to control what appears on your site.

## Posts vs Pages

### Posts (`_posts/` directory)

**Posts** are time-based content entries that follow strict naming conventions:

- **Location**: Must be in the `_posts/` directory
- **Naming**: Must follow `YYYY-MM-DD-title.md` format (e.g., `2025-10-30-my-post.md`)
- **Date**: Automatically extracted from filename
- **Collection**: Available via `site.posts` (sorted by date, newest first)
- **URL**: Generated based on permalink pattern (default: `/YYYY/MM/DD/title.html`)
- **Use Cases**: Blog posts, news articles, time-sensitive content

**Example Post Structure:**
```markdown
---
layout: post
title: "My Blog Post"
date: 2025-10-30
tags: [jekyll, tutorial]
published: true
---

Your post content here...
```

### Pages (anywhere in your site)

**Pages** are standalone content files that can be placed anywhere:

- **Location**: Can be anywhere in your site root (except `_posts/`)
- **Naming**: Any valid filename (e.g., `about.md`, `projects.md`, `docs/index.md`)
- **Date**: Optional (not required)
- **Collection**: Available via `site.pages`
- **URL**: Based on file path (e.g., `about.md` → `/about.html`, `docs/index.md` → `/docs/index.html`)
- **Use Cases**: About pages, documentation, project pages, static content

**Example Page Structure:**
```markdown
---
layout: default
title: "About"
permalink: /about/
---

Your page content here...
```

### Key Differences Summary

| Feature | Posts | Pages |
|---------|-------|-------|
| Location | `_posts/` only | Anywhere |
| Naming | `YYYY-MM-DD-title.md` | Any filename |
| Date Required | Yes (from filename) | No |
| Collection | `site.posts` | `site.pages` |
| Sorting | Automatic (by date) | Manual |
| Use Case | Blog entries | Static content |

---

## Hiding Blog Posts

**Yes!** There are multiple ways to hide posts from appearing on your site:

### Method 1: Front Matter `published: false`

Add `published: false` to the post's front matter:

```markdown
---
layout: post
title: "Hidden Post Example"
date: 2025-10-30
published: false
---

This post won't appear in site.posts by default.
```

**Pros**: Simple, post-specific control  
**Cons**: Post still exists in `site.posts`, needs filtering

### Method 2: Front Matter `draft: true`

Use `draft: true` (requires Jekyll draft support or custom filtering):

```markdown
---
layout: post
title: "Draft Post"
date: 2025-10-30
draft: true
---

This is a draft post.
```

### Method 3: Filter in Templates

Filter out hidden posts in your templates:

```liquid
{% for post in site.posts %}
  {% unless post.published == false %}
    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endunless %}
{% endfor %}
```

Or using `where` filter:

```liquid
{% assign published_posts = site.posts | where: "published", true %}
{% for post in published_posts %}
  <li><a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
```

### Method 4: Exclude in `_config.yml`

Add posts to the `exclude` list in `_config.yml`:

```yaml
exclude:
  - _posts/2025-10-30-hidden-example.md
  - _posts/drafts/
```

**Pros**: Complete exclusion from build  
**Cons**: Less flexible, requires config changes

### Method 5: Move to Drafts Folder

Create a `_drafts/` folder and move posts there:

```
_drafts/
  - my-draft-post.md
```

**Note**: Jekyll doesn't process `_drafts/` by default, but you can enable it with `--drafts` flag.

---

## Creating Pages Outside `_posts/`

**Absolutely!** Pages can be created anywhere in your site. Here are examples:

### Example 1: Root-Level Page

Create `projects.md` in the root:

```markdown
---
layout: default
title: "Projects"
permalink: /projects/
---

# My Projects

List of projects here...
```

**URL**: `/projects/`

### Example 2: Nested Pages

Create `docs/index.md`:

```markdown
---
layout: default
title: "Documentation"
permalink: /docs/
---

# Documentation Index

Welcome to the docs...
```

**URL**: `/docs/`

### Example 3: Subdirectory Pages

Create `docs/getting-started.md`:

```markdown
---
layout: default
title: "Getting Started"
permalink: /docs/getting-started/
---

# Getting Started Guide

Step-by-step instructions...
```

**URL**: `/docs/getting-started/`

### Accessing Pages in Templates

To list all pages:

```liquid
{% for page in site.pages %}
  {% if page.title %}
    <li><a href="{{ page.url }}">{{ page.title }}</a></li>
  {% endif %}
{% endfor %}
```

To link to a specific page:

```liquid
<a href="{{ '/projects/' | relative_url }}">Projects</a>
```

Or using the page object:

```liquid
{% assign projects_page = site.pages | where: "permalink", "/projects/" | first %}
<a href="{{ projects_page.url }}">{{ projects_page.title }}</a>
```

---

## Practical Examples

### Example: Filtering Hidden Posts in Index

Update your `index.markdown` to exclude hidden posts:

```markdown
---
layout: default
---

# Welcome to My Blog

## Recent Posts

{% assign published_posts = site.posts | where_exp: "post", "post.published != false" %}
{% for post in published_posts %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%B %d, %Y" }}
{% endfor %}
```

### Example: Navigation Menu with Pages

Create a navigation that includes both posts and pages:

```liquid
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about/">About</a></li>
    <li><a href="/projects/">Projects</a></li>
    <li><a href="/docs/">Documentation</a></li>
  </ul>
</nav>
```

### Example: Organizing Content Structure

```
myblog/
├── _posts/                    # Blog posts only
│   ├── 2025-10-30-post1.md
│   └── 2025-10-30-post2.md
├── about.md                   # About page
├── projects.md                # Projects page
├── docs/                      # Documentation section
│   ├── index.md
│   └── getting-started.md
└── index.markdown            # Homepage
```

---

## Best Practices

### 1. Content Organization

- **Use Posts** for: Blog entries, news, time-sensitive content
- **Use Pages** for: About, contact, documentation, project showcases

### 2. Hiding Posts

- Use `published: false` for posts you want to keep but hide temporarily
- Use `exclude` in `_config.yml` for posts you never want to build
- Always filter in templates to ensure hidden posts don't appear

### 3. Page Organization

- Group related pages in subdirectories (e.g., `docs/`, `projects/`)
- Use `permalink` in front matter for clean URLs
- Create `index.md` files for section landing pages

### 4. URL Management

- Set explicit `permalink` in front matter for predictable URLs
- Use trailing slashes for directories (`/docs/` not `/docs`)
- Keep URLs lowercase and use hyphens for spaces

### 5. Performance

- Filter posts in templates rather than iterating over all posts
- Use `where` filters for efficient querying
- Consider pagination for large post collections

---

# Part 2: Markdown Styling

This section explains how to customize markdown styling in your Jekyll blog.

## Where Styles Come From

Markdown styling comes from **three sources**:

1. **Jekyll Theme CSS** (`_site/assets/css/style.css`)
   - Provided by your theme (e.g., `jekyll-theme-cayman`)
   - Base styling for all elements

2. **Custom CSS File** (`assets/css/markdown-custom.css`)
   - Your custom markdown styles
   - Overrides theme styles
   - **This is what you should edit!**

3. **Layout Files** (`_layouts/post.html`)
   - Links to CSS files
   - Can include inline styles

## What You Can Customize

### 1. **Headings** (H1-H6)
- Font size, weight, color
- Margins and padding
- Underlines/borders
- Spacing between levels

**File to edit:** `assets/css/markdown-custom.css`  
**Sections:** `.post-body h1`, `.post-body h2`, etc.

### 2. **Inline Code** (`code`)
- Background color
- Text color
- Border and padding
- Font family

**File to edit:** `assets/css/markdown-custom.css`  
**Section:** `.post-body code`

### 3. **Code Blocks** (`pre` and `.highlight`)
- Background color
- Border and border-radius
- Padding and margins
- Syntax highlighting colors

**File to edit:** `assets/css/markdown-custom.css`  
**Sections:** `.post-body pre`, `.post-body .highlight`

### 4. **Links** (`a`)
- Color
- Hover effects
- Underlines
- Transitions

**File to edit:** `assets/css/markdown-custom.css`  
**Section:** `.post-body a`

### 5. **Lists** (`ul`, `ol`, `li`)
- List style (disc, circle, square, decimal)
- Indentation
- Spacing
- Nested list styles

**File to edit:** `assets/css/markdown-custom.css`  
**Sections:** `.post-body ul`, `.post-body ol`, `.post-body li`

### 6. **Blockquotes** (`blockquote`)
- Border color and width
- Background color
- Padding and margins
- Border radius

**File to edit:** `assets/css/markdown-custom.css`  
**Section:** `.post-body blockquote`

### 7. **Tables** (`table`, `th`, `td`)
- Border styles
- Cell padding
- Alternating row colors
- Header styling

**File to edit:** `assets/css/markdown-custom.css`  
**Sections:** `.post-body table`, `.post-body th`, `.post-body td`

## How to Customize

### Step 1: Edit the CSS File

Open `assets/css/markdown-custom.css` and modify the styles you want.

**Example - Change H1 color:**
```css
.post-body h1 {
  color: #ff0000; /* Red color */
  border-bottom: 3px solid #ff0000;
}
```

**Example - Change inline code style:**
```css
.post-body code {
  background-color: #f0f0f0;
  color: #333;
  padding: 0.3em 0.5em;
  border-radius: 4px;
}
```

### Step 2: Rebuild Your Site

After making changes:
```bash
bundle exec jekyll build
```

Or if running locally:
```bash
bundle exec jekyll serve
# Then refresh your browser
```

### Step 3: Test Changes

View your blog posts to see the changes. Use browser DevTools (F12) to inspect elements and test different styles.

## Style Examples

### Websites to Preview Markdown Styles

#### 1. **Markdown Style Preview Sites:**

- **Markdown Guide**: https://www.markdownguide.org/
  - Shows standard markdown syntax
  - Good reference for what elements exist

- **Dillinger**: https://dillinger.io/
  - Live markdown editor
  - See how markdown renders

- **StackEdit**: https://stackedit.io/
  - Markdown editor with preview
  - Multiple themes available

#### 2. **CSS Theme Inspiration:**

- **GitHub Markdown CSS**: https://github.com/sindresorhus/github-markdown-css
  - GitHub's markdown styling
  - Can copy CSS directly

- **Typora Themes**: https://theme.typora.io/
  - Beautiful markdown themes
  - Can adapt CSS from these

- **Markdown CSS Themes**: https://github.com/markdowncss
  - Collection of markdown CSS themes
  - Various styles (air, retro, etc.)

#### 3. **Jekyll Theme Showcases:**

- **Jekyll Themes**: http://jekyllthemes.org/
  - See different Jekyll themes
  - Inspect how they style markdown

- **GitHub Pages Themes**: https://pages.github.com/themes/
  - Official GitHub Pages themes
  - See markdown styling examples

### Popular Markdown Style Examples

#### GitHub Style (Clean & Professional)
```css
.post-body h1 {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}
.post-body code {
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  padding: 0.2em 0.4em;
}
```

#### Minimal Style (Simple & Clean)
```css
.post-body h1 {
  font-weight: 300;
  color: #333;
  margin-top: 2em;
}
.post-body code {
  background-color: #f5f5f5;
  color: #e83e8c;
}
```

#### Dark Theme Style
```css
.post-body {
  color: #c9d1d9;
  background-color: #0d1117;
}
.post-body code {
  background-color: #161b22;
  color: #79c0ff;
}
```

## Quick Reference

### CSS Selectors

| Markdown Element | CSS Selector |
|-----------------|--------------|
| H1 Heading | `.post-body h1` |
| H2 Heading | `.post-body h2` |
| Inline Code | `.post-body code` |
| Code Block | `.post-body pre` |
| Syntax Highlighted | `.post-body .highlight` |
| Links | `.post-body a` |
| Lists | `.post-body ul`, `.post-body ol` |
| Blockquote | `.post-body blockquote` |
| Tables | `.post-body table` |
| Images | `.post-body img` |

### Tips

1. **Use Browser DevTools**: Right-click → Inspect to see current styles
2. **Test Incrementally**: Change one thing at a time
3. **Check Responsiveness**: Test on mobile devices
4. **Keep It Readable**: Don't sacrifice readability for style
5. **Use CSS Variables**: For easy theme switching

### Need Help?

- Check browser console for CSS errors
- Validate CSS at https://jigsaw.w3.org/css-validator/
- Test markdown at https://dillinger.io/
- Look at theme source code for inspiration

---

# Part 3: Using Local Images from _pic/ Directory

This section explains how to organize and use images stored locally in your Jekyll site.

## Directory Structure

Create a `_pic/` directory at the root of your Jekyll site to store images:

```
myblog/
├── _pic/              # Images directory
│   ├── example-1.jpg
│   ├── example-2.png
│   └── diagram.svg
├── _posts/
└── _config.yml
```

**Important**: Jekyll copies directories starting with `_` to the output site without the underscore. So `_pic/` becomes `/pic/` in the built site.

## How to Reference Images

### Method 1: Markdown Image Syntax

The simplest way to add an image:

```markdown
![Alt text](/pic/example-1.jpg)
```

### Method 2: Markdown with Title

Add a title that appears on hover:

```markdown
![Alt text](/pic/example-1.jpg "Image title or description")
```

### Method 3: HTML Image Tag

For more control over size, alignment, and styling:

```html
<img src="/pic/example-1.jpg" alt="Alt text" width="400" height="300">
```

**With responsive styling:**
```html
<img src="/pic/example-1.jpg" alt="Alt text" style="max-width: 100%; height: auto;">
```

### Method 4: Using Jekyll's Base URL

If your site uses a base URL:

```markdown
![Image]({{ site.baseurl }}/pic/example-1.jpg)
```

## Path Reference

When referencing images from `_pic/`:

- **Source location**: `myblog/_pic/example.jpg`
- **Reference in markdown**: `/pic/example.jpg`
- **Built site location**: `_site/pic/example.jpg`

## Configuration

Ensure `_pic/` is included in your `_config.yml`:

```yaml
include:
  - _pic
```

## Best Practices

1. **Use descriptive filenames**: 
   - ✅ `docker-setup-diagram.png`
   - ❌ `img1.png`

2. **Optimize images**: Compress images before adding them to reduce page load time

3. **Use appropriate formats**:
   - **JPG**: For photographs
   - **PNG**: For images with transparency
   - **SVG**: For logos and diagrams
   - **WebP**: For modern browsers (with fallback)

4. **Add alt text**: Always include descriptive alt text for accessibility

5. **Organize by topic**: Consider subdirectories for better organization:
   ```
   _pic/
   ├── tutorials/
   ├── screenshots/
   └── diagrams/
   ```

## Troubleshooting

### Image Not Showing?

1. **Check the path**: Use `/pic/` (without underscore) in markdown
2. **Verify file exists**: Check that the image exists in `_pic/` directory
3. **Rebuild site**: Run `bundle exec jekyll build`
4. **Check configuration**: Ensure `_pic` is in the `include` list in `_config.yml`

### Path Examples

- ✅ Correct: `/pic/image.jpg`
- ❌ Wrong: `/_pic/image.jpg` (underscore removed in output)
- ❌ Wrong: `pic/image.jpg` (missing leading slash)

---

# Part 4: Future Sections

*This section is reserved for future additions to the guide. New sections will be appended here.*

---

## Summary

### Content Organization
- **Posts** (`_posts/`): Time-based content with strict naming (`YYYY-MM-DD-title.md`)
- **Pages**: Flexible content files that can be anywhere
- **Hide Posts**: Use `published: false`, filter in templates, or exclude in config
- **Show Pages**: Create files anywhere, use `permalink` for URLs, link in navigation

### Markdown Styling
- Edit `assets/css/markdown-custom.css` to customize styles
- Styles come from theme CSS, custom CSS, and layout files
- Use browser DevTools to inspect and test changes
- Rebuild site after making CSS changes

Jekyll gives you flexibility in organizing content and styling. Use posts for blog entries, pages for static content, and custom CSS for styling!
