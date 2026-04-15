---
layout: page
permalink: /notes/
title: notes
description: Working notes on topics I'm learning, with re-derivations and insights.
nav: false
nav_order: 1
---

<div class="notes-list">
{% assign sorted_notes = site.notes | sort: 'date' | reverse %}
{% for note in sorted_notes %}
  <div class="note-item" style="margin-bottom: 1.5rem;">
    <h3><a href="{{ note.url | relative_url }}">{{ note.title }}</a></h3>
    <p class="post-meta">{{ note.date | date: '%B %d, %Y' }}</p>
    <p>{{ note.description }}</p>
  </div>
{% endfor %}
</div>
