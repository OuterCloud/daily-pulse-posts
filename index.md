---
layout: home
title: DailyPulse · 每日脉搏
---

<div class="home-hero">
  <h1>DailyPulse · 每日脉搏</h1>
  <p>AI 驱动的中英双语每日技术简报，聚合全球开发者社区、学术前沿与市场动态</p>
  <div class="source-badges">
    <span class="source-badge">🔥 GitHub Trending</span>
    <span class="source-badge">📰 Hacker News</span>
    <span class="source-badge">📄 arXiv</span>
    <span class="source-badge">🚀 Product Hunt</span>
    <span class="source-badge">📊 财经要闻</span>
  </div>
</div>

---

<ul class="post-list">
  {% for post in site.posts limit:30 %}
  <li class="post-card">
    <a href="{{ post.url | relative_url }}">
      <div class="post-card-meta">
        <span class="post-card-date">{{ post.date | date: "%Y-%m-%d" }}</span>
        {% if post.url contains "research" %}
          <span class="post-card-lang lang-research">Research</span>
        {% elsif post.lang == "en" %}
          <span class="post-card-lang lang-en">EN</span>
        {% else %}
          <span class="post-card-lang lang-zh">中文</span>
        {% endif %}
      </div>
      <h3 class="post-card-title">{{ post.title }}</h3>
      {% if post.excerpt %}
      <p class="post-card-excerpt">{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
      {% endif %}
    </a>
  </li>
  {% endfor %}
</ul>

{% if site.posts.size == 0 %}
<p style="text-align:center;color:var(--dp-text-muted);padding:60px 0;">暂无报告，请先生成并发布。</p>
{% endif %}
