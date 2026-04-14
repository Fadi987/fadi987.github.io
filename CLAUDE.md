@AGENTS.md

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
related_publications: true # enable {% cite key %} references
toc:
  sidebar: left           # or beginning: true for inline TOC
mermaid:
  enabled: true           # for diagrams
  zoomable: true
code_diff: true           # for code diff display
```

### Supported Content Features

- **Images**: Use `{% include figure.liquid path="assets/img/file.jpg" class="img-fluid rounded z-depth-1" %}` with row/col grid layout
- **Math**: MathJax via `$$ E = mc^2 $$` (inline) or as a separate paragraph (display mode)
- **Code blocks**: Standard markdown fenced blocks with syntax highlighting
- **Diagrams**: Mermaid diagrams in ` ```mermaid ` blocks (enable in front matter)
- **Jupyter notebooks**: `{% jupyter_notebook path %}` wrapped in `{::nomarkdown}` tags
- **Bibliography/citations**: `{% cite key %}`, `{% reference key %}`, `{% quote key %}`
- **Code diffs**: Standard ` ```diff ` blocks, or rich diffs with diff2html (set `code_diff: true`)
- **Tables**: Standard markdown tables, or Bootstrap tables
- **Videos**: `{% include video.liquid path="url" class="img-fluid rounded z-depth-1" controls=true %}`
- **Audios**: `<audio>` tags
- **Charts**: Chart.js, ECharts, Vega-Lite, Plotly via embedded JSON configs
- **Maps**: GeoJSON with Leaflet
- **Pseudocode**: Via pseudocode.js
- **TikZ**: Via TikZJax
- **Typograms**: ASCII art diagrams rendered as SVG
- **Tabs**: `{% tabs group_name %}{% tab label %}content{% endtab %}{% endtabs %}`
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
