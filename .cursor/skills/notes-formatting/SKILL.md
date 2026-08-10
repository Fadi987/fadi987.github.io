---
name: notes-formatting
description: >-
  Formats working notes for this Jekyll academic site (_notes/), including
  Kramdown-safe MathJax, front matter, cross-links, media embeds, and
  punctuation. Use when creating or editing notes under _notes/, converting
  draft math into site-ready markdown, fixing MathJax/Kramdown rendering, or
  when the user mentions notes formatting, display math, inline math, or
  em dashes in notes.
---

# Notes Formatting (Site Conventions)

Content-agnostic rules for writing and editing `_notes/*.md`. Preserve the author's voice and technical content; apply only structure and formatting.

## File & front matter

1. Path: `_notes/kebab-case-slug.md` (filename becomes `/notes/kebab-case-slug/`).
2. Required front matter:

```yaml
---
layout: page
title: Note Title
description: One-line description shown in listings
date: YYYY-MM-DD
tags: topic-tag
math: true
---
```

3. `math: true` whenever the note has math (almost always).
4. `tags:` space-separated; reuse existing tags when possible (`generative-modeling`, `reinforcement-learning`, `optimization`, etc.).
5. Notes auto-appear on the front page and `/notes/`; do not manually edit listing pages unless asked.
6. Quote the title if it contains special YAML characters (e.g. `:`).

## Math / MathJax (Kramdown-critical)

Kramdown conflicts with MathJax. Follow these strictly:

| Rule | Do | Don't |
|------|----|-------|
| Delimiters | Always `$$...$$` | Never single `$...$` |
| Inline | `$$...$$` on the same line as prose | — |
| Display | `$$` alone on its line, **blank line before and after** the block | Adjacent prose without blank lines |
| Norms | `\lVert \rVert` | `\|\| ... \|\|` |
| Absolute values | `\lvert \rvert` | raw `\|` |
| Conditionals / "such that" | `\mid` | raw `\|` in inline math |

### Display math template

```markdown
Some prose.

$$
L(\theta) = \mathbb{E}_{x}\big[\lVert f_\theta(x) - y\rVert^2\big] \tag{1}
$$

More prose.
```

### Inline math template

```markdown
The density $$p_t(x)$$ satisfies the transport equation.
```

### Extra math hygiene

- Prefer `\lVert...\rVert` / `\lvert...\rvert` even in display math for consistency.
- Equation tags: `\tag{1}` inside the display block when numbering.
- Multi-line derivations: use `\begin{align}...\end{align}` inside a display `$$` block; end non-numbered lines with `\notag` when needed.
- Highlight key identities with `\boxed{...}` sparingly (existing notes do this for punchlines).
- Avoid raw `|` in inline math; Kramdown treats it as a table separator.

## Punctuation

- **Never use em dashes (`—`) or en dashes (`–`) as clause separators** in notes.
- Replace with `;`, `,`, parentheses, or a sentence break, whichever reads cleanest.
- Prefer ASCII hyphens only for compounds (`state-action`, `cost-to-go`) and minus signs in math via LaTeX (`-`).

Examples:

- Bad: `attacks these two points — though...`
- Good: `attacks these two points; though...`
- Bad: `the action-value function — the expected return — and let`
- Good: `the action-value function, the expected return, and let`

## Cross-links & citations

- Other notes: `[Title]({{ '/notes/slug-name/' | relative_url }})`
- Optional section anchors: `[Title]({{ '/notes/slug-name/#section-id' | relative_url }})`
- External papers: normal markdown links, e.g. `[DAgger](https://arxiv.org/pdf/...)`
- Do not use wiki-link syntax `[[...]]`.

## Videos / media

- Store files under `assets/video/<note-slug>/`.
- Side-by-side grids: raw HTML with Bootstrap columns; set `style="width: 100%"` on `<video>`. Do **not** use `{% include video.liquid %}` in grids.
- Column widths: `col-sm-4` (3-up), `col-sm-6` (2-up), `col-sm-12` (full).
- Standalone single video: `{% include video.liquid %}` is fine.

```html
<div class="row mt-3">
  <div class="col-sm-4 mt-3 mt-md-0">
    <figure>
      <video src="{{ 'assets/video/note-slug/file.mp4' | relative_url }}" style="width: 100%;" class="rounded z-depth-1" autoplay loop muted controls></video>
      <figcaption class="caption">Caption</figcaption>
    </figure>
  </div>
</div>
```

## Headings & prose structure

- Use `#` / `##` section headings as in existing notes (not only front-matter title).
- Keep the author's conversational academic voice; fix grammar/typos without flattening style.
- When converting a draft: apply formatting rules above; do not invent new sections unless asked.

## Pre-publish checklist

- [ ] Front matter complete; `math: true` if needed
- [ ] No single-`$` math delimiters
- [ ] Display math has blank lines before/after
- [ ] No raw `|` / `||` in inline math; norms/abs use `\lVert`/`\lvert`
- [ ] No em/en dashes used as punctuation
- [ ] Internal note links use `relative_url`
- [ ] Video grids use raw HTML + `width: 100%` if applicable
