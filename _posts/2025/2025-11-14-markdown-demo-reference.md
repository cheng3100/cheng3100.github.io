---
layout: post
title: "Markdown Demo & Reference Guide"
date: 2025-11-14
tags: [markdown, demo, reference, tutorial]
description: "Complete reference guide demonstrating all Markdown syntax including images and Mermaid diagrams"
header_numbering: true
header_numbering_style: nested
---

# Markdown Demo & Reference Guide

This page demonstrates all Markdown syntax features available in this Jekyll blog, including basic formatting, images, and Mermaid diagrams.

---

## Basic Markdown Syntax

### Headings

All six heading levels are available:

# H1 - Main Heading (Level 1)
## H2 - Section Heading (Level 2)
### H3 - Subsection Heading (Level 3)
#### H4 - Minor Heading (Level 4)
##### H5 - Small Heading (Level 5)
###### H6 - Smallest Heading (Level 6)

**Markdown Syntax:**
```markdown
# H1 - Main Heading
## H2 - Section Heading
### H3 - Subsection Heading
#### H4 - Minor Heading
##### H5 - Small Heading
###### H6 - Smallest Heading
```

---

### Text Formatting

**Bold text** using double asterisks or double underscores.

*Italic text* using single asterisks or single underscores.

***Bold and italic*** using triple asterisks.

~~Strikethrough~~ using double tildes.

**Markdown Syntax:**
```markdown
**Bold text** or __Bold text__
*Italic text* or _Italic text_
***Bold and italic***
~~Strikethrough~~
```

---

### Lists

#### Unordered Lists

- First item
- Second item
- Third item
  - Nested item 1
  - Nested item 2
- Fourth item

**Markdown Syntax:**
```markdown
- First item
- Second item
- Third item
  - Nested item 1
  - Nested item 2
- Fourth item
```

#### Ordered Lists

1. First item
2. Second item
3. Third item
   1. Nested numbered item
   2. Another nested item
4. Fourth item

**Markdown Syntax:**
```markdown
1. First item
2. Second item
3. Third item
   1. Nested numbered item
   2. Another nested item
4. Fourth item
```

#### Task Lists

- [x] Completed task
- [x] Another completed task
- [ ] Incomplete task
- [ ] Another incomplete task

**Markdown Syntax:**
```markdown
- [x] Completed task
- [ ] Incomplete task
```

---

### Links

[Inline link](https://www.example.com)

[Link with title](https://www.example.com "Example Website")

[Reference-style link][reference-link]

[reference-link]: https://www.example.com

**Markdown Syntax:**
```markdown
[Inline link](https://www.example.com)
[Link with title](https://www.example.com "Example Website")
[Reference-style link][reference-link]

[reference-link]: https://www.example.com
```

---

### Code

#### Inline Code

Use `inline code` with backticks for code snippets within text.

**Markdown Syntax:**
```markdown
Use `inline code` with backticks
```

#### Code Blocks

```python
def hello_world():
    print("Hello, World!")
    return True

result = hello_world()
```

```javascript
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("World"));
```

**Markdown Syntax:**
````markdown
```python
def hello_world():
    print("Hello, World!")
```
````

---

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> And include multiple paragraphs.

> **Nested blockquote:**
> > This is a nested quote inside another quote.

**Markdown Syntax:**
```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And include multiple paragraphs.
```

---

### Horizontal Rules

---

**Markdown Syntax:**
```markdown
---
```

---

### Tables

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | Info     |
| Row 2    | More     | Details  |
| Row 3    | Even     | More     |

**Alignment:**

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left         | Center         | Right         |
| Text         | Text            | Text          |

**Markdown Syntax:**
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data     | Info     |

| Left | Center | Right |
|:-----|:------:|------:|
| Left | Center | Right |
```

---

### Escaping Characters

Use backslash to escape special characters: \*asterisk\*, \`backtick\`, \#hash

**Markdown Syntax:**
```markdown
\*asterisk\*, \`backtick\`, \#hash
```

---

## Images

### Basic Image Syntax

![Alt text](/pic/example-image.txt "Image title")

**Markdown Syntax:**
```markdown
![Alt text](/pic/example-image.txt "Image title")
```

### Images from _pic/ Directory

Images stored in the `_pic/` directory can be referenced using `/pic/` path (note: no underscore in the path).

**Example:**
```markdown
![My Image](/pic/my-image.jpg)
```

**With title/tooltip:**
```markdown
![Screenshot](/pic/screenshot.png "Screenshot of the application")
```

### HTML Image Tag (More Control)

For more control over image size and styling:

<img src="/pic/example-image.txt" alt="Example image" width="400" style="border-radius: 8px;">

**HTML Syntax:**
```html
<img src="/pic/example-image.txt" alt="Example image" width="400" style="border-radius: 8px;">
```

### Responsive Image

```html
<img src="/pic/example-image.txt" alt="Responsive image" style="max-width: 100%; height: auto;">
```

### Image with Caption

<figure>
  <img src="/pic/example-image.txt" alt="Example" style="max-width: 100%;">
  <figcaption>Figure 1: Example image with caption</figcaption>
</figure>

**HTML Syntax:**
```html
<figure>
  <img src="/pic/example-image.txt" alt="Example">
  <figcaption>Figure 1: Example image with caption</figcaption>
</figure>
```

### Centered Image

<div style="text-align: center;">
  <img src="/pic/example-image.txt" alt="Centered image" width="300">
</div>

**HTML Syntax:**
```html
<div style="text-align: center;">
  <img src="/pic/example-image.txt" alt="Centered image" width="300">
</div>
```

---

## Mermaid Diagrams

Mermaid diagrams are created using code blocks with `mermaid` as the language.

### Flowchart

```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

**Markdown Syntax:**
````markdown
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
```
````

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    participant Database
    
    User->>Browser: Enter URL
    Browser->>Server: HTTP Request
    Server->>Database: Query Data
    Database-->>Server: Return Data
    Server-->>Browser: HTTP Response
    Browser-->>User: Display Page
```

**Markdown Syntax:**
````markdown
```mermaid
sequenceDiagram
    participant User
    participant Browser
    User->>Browser: Enter URL
    Browser->>Server: HTTP Request
```
````

### Class Diagram

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +eat()
        +sleep()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat
```

**Markdown Syntax:**
````markdown
```mermaid
classDiagram
    class Animal {
        +String name
        +eat()
    }
    Animal <|-- Dog
```
````

### State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Completed: Success
    Processing --> Error: Failure
    Error --> Idle: Retry
    Completed --> [*]
```

**Markdown Syntax:**
````markdown
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Completed: Success
```
````

### Gantt Chart

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Planning           :2025-11-01, 7d
    Design             :2025-11-08, 10d
    section Phase 2
    Development        :2025-11-18, 20d
    Testing            :2025-12-08, 7d
    section Phase 3
    Deployment         :2025-12-15, 5d
```

**Markdown Syntax:**
````markdown
```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Planning :2025-11-01, 7d
```
````

### Pie Chart

```mermaid
pie title Programming Languages Usage
    "JavaScript" : 35
    "Python" : 25
    "Java" : 20
    "C++" : 10
    "Other" : 10
```

**Markdown Syntax:**
````markdown
```mermaid
pie title Programming Languages Usage
    "JavaScript" : 35
    "Python" : 25
```
````

### Git Graph

```mermaid
gitgraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature A"
    commit id: "Feature B"
    checkout main
    commit id: "Release"
    merge develop
    commit id: "Hotfix"
```

**Markdown Syntax:**
````markdown
```mermaid
gitgraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature A"
```
````

### Entity Relationship Diagram

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    PRODUCT ||--o{ LINE-ITEM : "ordered in"
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date orderDate
    }
    PRODUCT {
        string name
        float price
    }
```

**Markdown Syntax:**
````markdown
```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
```
````

### Journey Diagram

```mermaid
journey
    title User Journey
    section Discovery
      Visit Website: 5: User
      Browse Products: 4: User
    section Purchase
      Add to Cart: 3: User
      Checkout: 5: User
      Payment: 4: User
    section Post-Purchase
      Receive Email: 5: System
      Review Product: 4: User
```

**Markdown Syntax:**
````markdown
```mermaid
journey
    title User Journey
    section Discovery
      Visit Website: 5: User
      Browse Products: 4: User
```
````

---

## Combining Elements

### Code Block with Mermaid

You can combine code explanations with Mermaid diagrams:

Here's a flowchart showing a simple decision process:

```mermaid
graph LR
    A[Input] --> B{Valid?}
    B -->|Yes| C[Process]
    B -->|No| D[Error]
    C --> E[Output]
    D --> F[Log Error]
```

### Image with Description

Here's an example workflow:

```mermaid
graph TD
    A[Start] --> B[Load Image]
    B --> C[Process Image]
    C --> D[Display Image]
    D --> E[End]
```

And here's how to reference the image in Markdown:

```markdown
![Workflow Diagram](/pic/workflow-diagram.png "Workflow visualization")
```

---

## Quick Reference

### Basic Syntax Cheat Sheet

| Element | Syntax | Example |
|---------|--------|---------|
| Heading | `# H1` to `###### H6` | `## Heading` |
| Bold | `**text**` | **bold** |
| Italic | `*text*` | *italic* |
| Code | `` `code` `` | `code` |
| Link | `[text](url)` | [link](url) |
| Image | `![alt](url)` | ![alt](url) |
| List | `- item` or `1. item` | • item |
| Blockquote | `> quote` | > quote |
| Table | `\| col \|` | Table |
| Horizontal Rule | `---` | --- |

### Image Path Reference

- **Source**: `myblog/_pic/image.jpg`
- **Reference**: `/pic/image.jpg` (no underscore)
- **Built site**: `_site/pic/image.jpg`

### Mermaid Quick Reference

- **Flowchart**: `graph TD` or `graph LR`
- **Sequence**: `sequenceDiagram`
- **Class**: `classDiagram`
- **State**: `stateDiagram-v2`
- **Gantt**: `gantt`
- **Pie**: `pie`
- **Git**: `gitgraph`
- **ER**: `erDiagram`
- **Journey**: `journey`

---

## Tips and Best Practices

1. **Use descriptive alt text** for images
2. **Keep Mermaid diagrams simple** for better readability
3. **Test your syntax** before publishing
4. **Use consistent formatting** throughout your posts
5. **Optimize images** before adding them to `_pic/`
6. **Preview diagrams** using [Mermaid Live Editor](https://mermaid.live/)


## Progress Bar

### Inline Progress Bar

- [ ] the target is ongoing <img src="https://progress-bar.xyz/29/" alt="29%" style="display: inline; vertical-align: middle;">

### Multiple Progress Bars

- [ ] Task 1: <img src="https://progress-bar.xyz/45/" alt="45%" style="display: inline; vertical-align: middle;">
- [ ] Task 2: <img src="https://progress-bar.xyz/78/" alt="78%" style="display: inline; vertical-align: middle;">
- [ ] Task 3: <img src="https://progress-bar.xyz/100/" alt="100%" style="display: inline; vertical-align: middle;">

### Progress Bar Syntax

**HTML syntax (works inline):**
```html
- [ ] Task <img src="https://progress-bar.xyz/29/" alt="29%" style="display: inline; vertical-align: middle;">
```

**Progress bar URL format:**
```
https://progress-bar.xyz/[PERCENTAGE]/
```

**Examples:**
- `https://progress-bar.xyz/0/` - 0%
- `https://progress-bar.xyz/25/` - 25%
- `https://progress-bar.xyz/50/` - 50%
- `https://progress-bar.xyz/75/` - 75%
- `https://progress-bar.xyz/100/` - 100%

**Note**: Use HTML `<img>` tag with `display: inline` style to keep progress bars on the same line. 

---

---

## Automatic Header Numbering

The header numbering feature automatically adds sequence numbers to markdown headers without modifying the markdown source.

### How It Works

Headers are automatically numbered when the feature is enabled. Notice the headers below - they will show numbers if numbering is enabled for this page.

### Example with Nested Numbering

This page demonstrates nested numbering (1.1.1 style). The numbers are added automatically by JavaScript.

#### First Subsection

This is a subsection under the main section.

##### Sub-subsection

Even deeper nesting works!

##### Another Sub-subsection

Another sub-subsection at the same level.

#### Second Subsection

Another subsection under the main section.

### How to Enable

#### Method 1: Enable for This Post

Add to the front matter:

```yaml
---
layout: post
title: "My Post"
header_numbering: true
header_numbering_style: nested
---
```

#### Method 2: Enable Site-Wide

Add to `_config.yml`:

```yaml
header_numbering: true
header_numbering_style: nested
```

#### Method 3: Disable for Specific Post

```yaml
---
header_numbering: false
---
```

### Numbering Styles

- **Nested** (default): `1`, `1.1`, `1.1.1`, `1.2`, `2`, `2.1`, etc.
- **Flat**: Only numbers H1 headers (`1`, `2`, `3`, etc.)

### Configuration Options

**Per-page options:**
- `header_numbering: true/false` - Enable/disable for this post
- `header_numbering_style: nested/flat` - Choose numbering style

**Site-wide options** (in `_config.yml`):
- `header_numbering: true/false` - Enable/disable globally
- `header_numbering_style: nested/flat` - Default style

### Notes

- Numbers are added automatically - no need to modify markdown
- Page-level settings override site-wide settings
- Numbers are styled with CSS and can be customized
- Works with all header levels (H1-H6)

---

## Hiding Blog Posts

You can hide blog posts from appearing in listings (like the index page) while keeping them accessible via direct URL.

### Method 1: Hide Individual Post

Add `published: false` to the post's front matter:

```yaml
---
layout: post
title: "My Draft Post"
date: 2025-11-14
published: false
---
```

**Note:** The post will still be accessible via direct URL, but won't appear in `site.posts` collections or listings.

### Method 2: Hide Posts Site-Wide

Add posts to the `exclude` list in `_config.yml`:

```yaml
exclude:
  - _posts/2025-11-14-draft-post.md
  - _posts/drafts/
```

**Note:** Excluded posts won't be processed by Jekyll at all and won't be accessible via URL.

### Tips

- Use `published: false` for drafts you want to keep accessible but hidden from listings
- Use `exclude` in `_config.yml` for posts you don't want processed at all
- You can exclude entire directories (e.g., `_posts/drafts/`) or specific files
- Excluded files won't appear in any collections or be built by Jekyll

---
## Summary

This demo page showcases:

✅ **Basic Markdown**: Headings, text formatting, lists, links, code, tables  
✅ **Images**: From `_pic/` directory with various display options  
✅ **Mermaid Diagrams**: Flowcharts, sequence diagrams, class diagrams, and more  
✅ **Progress Bars**: Inline progress indicators  
✅ **Header Numbering**: Automatic sequence numbering for headers  

Use this page as a reference when writing your blog posts!