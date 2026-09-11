---
permalink: /
title: "Jiaming Zhong"
author_profile: true
redirect_from: ["/about/", "/about.html"]
---

<section id="about-me" class="profile-intro">
<p class="eyebrow">LEARNING · CONTROL · MOBILE AUTONOMY</p>
<h1>Learning and control<br>for mobile autonomy<span class="title-dot">.</span></h1>
<p class="intro-lead">I build adaptive autonomy by combining data-driven learning with model-based control.</p>
<p>I am an Associate Research Officer at <a href="https://nrc.canada.ca/en">National Research Council Canada</a>. I earned my Ph.D. at the <a href="https://uwaterloo.ca/">University of Waterloo</a>, advised by <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">Amir Khajepour</a> and <a href="https://yashpant.github.io/">Yash Vardhan Pant</a>, then joined the <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">Mechatronic Vehicle Systems Lab</a> as a postdoctoral fellow.</p>
<p>My work connects academic research with hands-on engineering: co-founding <a href="https://loopx.ai/">LoopX</a>, leading AMR development at <a href="https://reelinrobotics.ca/">Reel-In Robotics</a>, and developing production vehicle software at <a href="https://www.nio.com/">NIO</a> and <a href="https://www.saicmotor.com/english/">SAIC Motor</a>. I previously studied at <a href="https://english.bit.edu.cn/">Beijing Institute of Technology</a>.</p>
<div class="intro-actions"><a href="#research">Research projects <span aria-hidden="true">↓</span></a><a href="mailto:{{ site.author.email }}">Get in touch <span aria-hidden="true">↗</span></a></div>
</section>

<section id="research" class="profile-section">
<div class="section-heading"><p class="eyebrow">01 / RESEARCH</p><h2>A shared principle, across scales</h2></div>
<div class="research-vision" aria-label="Trustworthy Physical AI equals data-driven learning plus model-based structure">
<p class="vision-title">{{ site.data.research.vision.title }}</p>
<div class="vision-equation"><span class="equation-symbol" aria-hidden="true">=</span><div><strong>{{ site.data.research.vision.learning }}</strong><span>{{ site.data.research.vision.learning_detail }}</span></div><span class="equation-symbol" aria-hidden="true">+</span><div><strong>{{ site.data.research.vision.structure }}</strong><span>{{ site.data.research.vision.structure_detail }}</span></div></div>
</div>
<p class="vision-description">{{ site.data.research.vision.description }}</p>
{% include research-projects.html %}
</section>

<section id="ongoing" class="profile-section">
<div class="section-heading"><p class="eyebrow">02 / ONGOING RESEARCH</p><h2>From ideas to robot experiments</h2></div>
<p class="section-note">Independent platforms for exploring adaptive autonomy.</p>
<div class="platform-grid">
{% for platform in site.data.ongoing %}<article class="platform" id="{{ platform.id }}"><a class="media-link" href="{{ platform.image }}" aria-label="View {{ platform.title }} photograph"><img src="{{ platform.image }}" alt="{{ platform.image_alt | escape }}" loading="lazy" width="800" height="350"></a><div class="platform-body"><p class="project-context">{{ platform.focus }}</p><h3>{{ platform.title }}</h3><p>{{ platform.description }}</p><div class="project-links">{% for link in platform.links %}<a href="{{ link.url }}">{{ link.label }} <span aria-hidden="true">↗</span></a>{% endfor %}{% if platform.video_url %}<a href="{{ platform.video_url }}">Video <span aria-hidden="true">↗</span></a>{% endif %}</div></div></article>{% endfor %}
</div>
</section>

<section id="publications" class="profile-section">
<div class="section-heading"><p class="eyebrow">03 / SELECTED PUBLICATIONS</p><h2>Selected publications</h2></div>
<p class="section-note">First-author, co-first-author, and corresponding-author papers. <a href="{{ site.author.googlescholar }}">Full list on Google Scholar <span aria-hidden="true">↗</span></a></p>
{% include selected-publications.html %}
</section>

<section id="experience" class="profile-section compact-section">
<div class="section-heading"><p class="eyebrow">04 / EXPERIENCE</p><h2>Research &amp; engineering</h2></div>
<div class="career-list">{% for item in site.data.career.experience %}<article><p class="career-date">{{ item.dates }}</p><div><h3><a href="{{ item.url }}">{{ item.organization }}</a></h3><p>{{ item.role }}</p></div></article>{% endfor %}</div>
</section>

<section id="education" class="profile-section compact-section">
<div class="section-heading"><p class="eyebrow">05 / EDUCATION</p><h2>Education</h2></div>
<div class="career-list">{% for item in site.data.career.education %}<article><p class="career-date">{{ item.dates }}</p><div><h3>{{ item.degree }}</h3><p><a href="{{ item.url }}">{{ item.institution }}</a></p></div></article>{% endfor %}</div>
</section>

<section id="contact" class="contact-panel"><p>Interested in learning, control, or robot autonomy?</p><a href="mailto:{{ site.author.email }}">{{ site.author.email }} <span aria-hidden="true">↗</span></a></section>
<footer class="profile-footer"><span>© 2026 Jiaming Zhong</span><a href="#about-me">Back to top ↑</a></footer>
