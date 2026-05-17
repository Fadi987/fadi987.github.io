---
layout: page
permalink: /notes/
title: notes
description: Working notes where I elaborate on concepts I'm currently studying. When a proof or technique seems to come out of the blue, I try to reverse-engineer how one might have arrived at it, reconstructing the chain of reasoning from scratch.
nav: false
nav_order: 1
---

{% assign sorted_notes = site.notes | sort: 'date' | reverse %}

{% comment %} Collect all unique tags across notes {% endcomment %}
{% assign all_tags = "" | split: "" %}
{% for note in sorted_notes %}
  {% for tag in note.tags %}
    {% unless all_tags contains tag %}
      {% assign all_tags = all_tags | push: tag %}
    {% endunless %}
  {% endfor %}
{% endfor %}

{% if all_tags.size > 0 %}
<div class="note-filters" style="margin-bottom: 2rem;">
  <button class="note-filter-btn active" data-tag="all" onclick="filterNotes('all')">All</button>
  {% for tag in all_tags %}
    <button class="note-filter-btn" data-tag="{{ tag }}" onclick="filterNotes('{{ tag }}')">{{ tag }}</button>
  {% endfor %}
</div>
{% endif %}

<div class="notes-list">
{% for note in sorted_notes %}
  <div class="note-item" data-tags="{{ note.tags | join: ' ' }}" style="margin-bottom: 1.5rem;">
    <h3><a href="{{ note.url | relative_url }}">{{ note.title }}</a></h3>
    <p class="post-meta">{{ note.date | date: '%B %d, %Y' }}</p>
    <p>{{ note.description }}</p>
  </div>
{% endfor %}
</div>

{% if all_tags.size > 0 %}
<style>
.note-filter-btn {
  background: none;
  border: 1px solid var(--global-divider-color);
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  margin: 0 0.25rem 0.5rem 0;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--global-text-color);
  transition: all 0.2s ease;
}
.note-filter-btn:hover {
  border-color: var(--global-theme-color);
  color: var(--global-theme-color);
}
.note-filter-btn.active {
  background-color: var(--global-theme-color);
  border-color: var(--global-theme-color);
  color: white;
}
.note-item {
  transition: opacity 0.2s ease;
}
.note-item.hidden {
  display: none;
}
</style>

<script>
function filterNotes(tag) {
  var buttons = document.querySelectorAll('.note-filter-btn');
  buttons.forEach(function(btn) {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tag') === tag) {
      btn.classList.add('active');
    }
  });

  var notes = document.querySelectorAll('.note-item');
  notes.forEach(function(note) {
    if (tag === 'all') {
      note.classList.remove('hidden');
    } else {
      var noteTags = note.getAttribute('data-tags').split(' ');
      if (noteTags.indexOf(tag) !== -1) {
        note.classList.remove('hidden');
      } else {
        note.classList.add('hidden');
      }
    }
  });
}
</script>
{% endif %}
