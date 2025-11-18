---
layout: post
categories: [nginx, jekyll]
description: 
keywords: nginx, jekyll
---
# Project Guide: Blog (Jekyll) & Multi-Site Static Hosting (nginx)

---

## I. Jekyll Blog Site Setup & Usage

### 1. Jekyll Installation (Linux)
```bash
sudo apt update
sudo apt install -y ruby-full build-essential zlib1g-dev
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
gem install bundler jekyll
```

---

### 2. Create a New Blog
```bash
jekyll new my_blog --skip-bundle
cd my_blog
```

---

### 3. Key Jekyll Files & Folders
- `_config.yml`: Global site settings (title, theme, permalinks)
- `_posts/`: Blog articles, as `YYYY-MM-DD-title.md`
- `index.md`: Home page (markdown)
- `about.md`: Standalone example page

---

### 4. Editing Content
**Update config in `_config.yml`:**
```yaml
title: "My Tech Blog"
description: "Clean, simple tech notes"
theme: jekyll-theme-cayman
permalink: /:year/:month/:day/:title.html
```

**Write new posts in `_posts/`:**
```markdown
---
layout: post
title: "My First Post"
date: 2025-10-30
tags: [intro]
---
Welcome to my new tech blog!
```

---

### 5. Serve Blog Locally (for writing and preview)
```bash
bundle install
bundle exec jekyll serve --livereload
```
Visit [http://127.0.0.1:4000](http://127.0.0.1:4000)

If want to access it outside localhost, add `--host 0.0.0.0` as below:
```bash
bundle exec jekyll serve --host 0.0.0.0 --livereload
```

Visit [http:/<ip_addr>:4000](http://xx.xx.xx.x:4000)


---

## II. nginx Docker Hosting: Static Blog & Multi-Site Setup

### 1. Serve Blog with nginx in Docker
**Generate static site:**
```bash
bundle exec jekyll build
```
**Serve static blog using nginx:**
```bash
docker run --rm -p 8080:80 -v $(pwd)/_site:/usr/share/nginx/html:ro nginx:alpine
```
Access via [http://localhost:8080](http://localhost:8080)

**Docker Compose (optional):**
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./_site:/usr/share/nginx/html:ro
```
Run with:
```bash
docker-compose up
```

---

### 2. Serve Multiple Static Sites On One nginx Docker Container (Advanced)
Serve multiple sites at different ports with a custom nginx config.

#### **Prepare directory structure:**
```
nginx-multi/
|-- nginx.conf
|-- blog/   # Contains blog static files (from my_blog/_site)
|-- wiki/   # Contains wiki static files (from my_wiki/_site)
```
Copy blog and wiki contents:
```bash
cp -r /home/cheng/work/web/my_blog/_site ./blog
cp -r /home/cheng/work/web/my_wiki/_site ./wiki
```

#### **Example nginx.conf:**
```nginx
events {}
http {
    server {
        listen 8080;
        server_name blog.local;
        root /usr/share/nginx/html/blog;
        index index.html;
    }
    server {
        listen 8081;
        server_name wiki.local;
        root /usr/share/nginx/html/wiki;
        index index.html;
    }
}
```

#### **Run nginx with this config:**
```bash
docker run --rm \
  -p 8080:8080 -p 8081:8081 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/blog:/usr/share/nginx/html/blog:ro \
  -v $(pwd)/wiki:/usr/share/nginx/html/wiki:ro \
  nginx:alpine
```
- Access blog: [http://localhost:8080](http://localhost:8080)
- Access wiki: [http://localhost:8081](http://localhost:8081)

#### **Docker Compose for Multi-Site nginx:**
Create a `docker-compose.yml` like this in your `nginx-multi` directory:
```yaml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:8080"
      - "8081:8081"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./blog:/usr/share/nginx/html/blog:ro
      - ./wiki:/usr/share/nginx/html/wiki:ro
```
Then start all at once:
```bash
docker-compose up
```
- Blog: [http://localhost:8080](http://localhost:8080)
- Wiki: [http://localhost:8081](http://localhost:8081)

---

**Tips:**
- Jekyll is for content writing; use `bundle exec jekyll build` before deploying each change.
- nginx in Docker = quick fast static hosting, for blogs, docs, wikis, etc.
- For more or more complex routing, expand `nginx.conf` as needed.

---

## Resources
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [nginx Documentation](https://nginx.org/en/docs/)
