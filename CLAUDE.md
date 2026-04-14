@AGENTS.md

## Site Architecture & Current State

This is a single-page personal academic site (no navigation tabs). The front page (`_pages/about.md`) contains:
- About/bio section with profile photo
- Inline text links (Email / CV / Scholar / Github) instead of icon-based social links
- News announcements
- All publications (not just selected)
- Dark/light toggle (standalone, top-right corner — navbar is fully removed)

### Key Config Decisions

- `search_enabled: false` — search is disabled (was indexing hidden pages)
- `enable_publication_thumbnails: false` — disabled until images are ready. To re-enable:
  1. Set `enable_publication_thumbnails: true` in `_config.yml`
  2. Add `preview = {filename.png}` to bib entries in `_bibliography/papers.bib`
  3. Place image files in `assets/img/publication_preview/`
- `social: false` in about.md — large social icons at bottom are disabled; inline text links are used instead
- All nav pages set to `nav: false` (blog, publications, projects, teaching, repositories, cv, people, submenus)
- The navbar (`_includes/header.liquid`) was replaced with just the dark/light toggle
- `CLAUDE.md` is in the Jekyll `exclude` list in `_config.yml` (because Liquid tags in code examples cause build errors)

### Publications / BibTeX

- File: `_bibliography/papers.bib`
- **BibTeX requires `and` between authors**, not commas. Example: `author = {Last, F. and Last2, F.}`
  - Commas alone cause the parser to treat all authors as one person
- The about layout (`_layouts/about.liquid`) has a custom `all_papers` block that renders all publications via `{% bibliography %}`
  - Controlled by `all_papers: true` in about.md front matter
  - `selected_papers: false` disables the "selected only" section
- Scholar config in `_config.yml` uses `last_name: [Atieh]` and `first_name: [Fadi, F.]` to bold the site owner's name
- `max_author_limit: 3` — shows 3 authors then "N more authors" expandable
- Supported bib fields for links: `arxiv`, `html`, `pdf`, `doi`, `code`, `video`, `poster`, `slides`, `blog`, `website`

### Teaching

- Teaching entries go in `_teachings/` as markdown files with `layout: course`
- Front matter: `title`, `description`, `instructor`, `year`, `term`, `location`, `time`, `course_id`
- Optional `schedule:` list with `week`, `date`, `topic`, `description`, `materials`
- Teaching page (`_pages/teaching.md`) uses `{% include courses.liquid %}` to render them
- Currently hidden (`nav: false`) but content exists for Theory of Computation (18.404) and Intro to Statistical Data Analysis (6.401)

### Pages That Exist But Are Hidden

All these pages have `nav: false` and can be re-enabled by setting `nav: true`:
- `_pages/blog.md` — blog listing (posts go in `_posts/`)
- `_pages/publications.md` — standalone publications page
- `_pages/projects.md` — project cards (projects go in `_projects/`)
- `_pages/teaching.md` — teaching/courses
- `_pages/repositories.md` — GitHub repos display
- `_pages/cv.md` — rendered CV page
- `_pages/profiles.md` — people/lab members
- `_pages/dropdown.md` — submenu demo

### CV Data

- `_data/cv.yml` — structured CV data (education, experience, interests, languages)
- `_data/socials.yml` — social links (email, github, linkedin, scholar, cv_pdf)

## Blog Post Reference

Blog posts go in `_posts/` with filename format `YYYY-MM-DD-slug.md`.

### Front Matter Options

```yaml
layout: post
title: "post title"
date: 2024-01-01 12:00:00
description: short description
tags: tag1 tag2           # space-separated
categories: category-name
thumbnail: assets/img/thumb.jpg
giscus_comments: true     # enable comments
related_posts: true       # show related posts
related_publications: true # enable cite references
toc:
  sidebar: left           # or beginning: true for inline TOC
mermaid:
  enabled: true           # for diagrams
  zoomable: true
code_diff: true           # for code diff display
```

### Supported Content Features

- **Images**: Use `include figure.liquid` with `path`, `class="img-fluid rounded z-depth-1"`, and row/col grid layout
- **Math**: MathJax via `$$ E = mc^2 $$` (inline) or as a separate paragraph (display mode)
- **Code blocks**: Standard markdown fenced blocks with syntax highlighting
- **Diagrams**: Mermaid diagrams in mermaid code blocks (enable in front matter)
- **Jupyter notebooks**: jupyter_notebook tag wrapped in nomarkdown tags
- **Bibliography/citations**: cite, reference, and quote tags with bib keys
- **Code diffs**: Standard diff code blocks, or rich diffs with diff2html (set `code_diff: true`)
- **Tables**: Standard markdown tables, or Bootstrap tables
- **Videos**: include video.liquid with path, class, and controls
- **Audios**: HTML audio tags
- **Charts**: Chart.js, ECharts, Vega-Lite, Plotly via embedded JSON configs
- **Maps**: GeoJSON with Leaflet
- **Pseudocode**: Via pseudocode.js
- **TikZ**: Via TikZJax
- **Typograms**: ASCII art diagrams rendered as SVG
- **Tabs**: tabs/tab Liquid tags
- **Photo galleries**: Swiper or PhotoSwipe-based galleries
- **Custom blockquotes**: tip, warning, danger, important styles via `> [!TIP]` syntax

## Project Reference

Projects go in `_projects/` as markdown files.

### Front Matter Options

```yaml
layout: page
title: "project title"
description: short description
img: assets/img/image.jpg    # background/thumbnail image
importance: 1                # ordering (lower = higher priority)
category: work               # for categorization
related_publications: true   # link to bib entries
```

Content supports the same features as blog posts (images in grid layouts, code blocks, math, etc.).
