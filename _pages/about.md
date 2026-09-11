---
permalink: /
title: "Jiaming Zhong"
author_profile: true
redirect_from: ["/about/", "/about.html"]
---

<section id="about-me" class="profile-intro">
<p class="intro-lead" data-zh="👋 欢迎！我致力于打造能在真实世界中学习与适应的物理人工智能（Physical AI）。">👋 Welcome! I’m building Physical AI that learns and adapts in the real world.</p>
<div class="localized-copy" lang="en">
<p>I am an Associate Research Officer at <a href="https://nrc.canada.ca/en">National Research Council Canada</a>. I earned my Ph.D. at the <a href="https://uwaterloo.ca/">University of Waterloo</a>, advised by <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">Amir Khajepour</a> and <a href="https://yashpant.github.io/">Yash Vardhan Pant</a>, then joined the <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">Mechatronic Vehicle Systems Lab</a> as a postdoctoral fellow.</p>
<p>My work connects academic research with hands-on engineering: co-founding <a href="https://loopx.ai/">LoopX</a>, leading AMR development at <a href="https://reelinrobotics.ca/">Reel-In Robotics</a>, and developing production vehicle software at <a href="https://www.nio.com/">NIO</a> and <a href="https://www.saicmotor.com/english/">SAIC Motor</a>. I previously studied at <a href="https://english.bit.edu.cn/">Beijing Institute of Technology</a>.</p>
</div>
<div class="localized-copy" lang="zh-CN">
<p>我目前在<a href="https://nrc.canada.ca/en">加拿大国家研究委员会</a>担任副研究员（Associate Research Officer）。我在<a href="https://uwaterloo.ca/">滑铁卢大学</a>获得博士学位，导师为 <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">Amir Khajepour</a> 和 <a href="https://yashpant.github.io/">Yash Vardhan Pant</a>，随后在<a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">机电车辆系统实验室</a>从事博士后研究。</p>
<p>我的工作连接学术研究与工程实践：联合创办 <a href="https://loopx.ai/">LoopX</a>，在 <a href="https://reelinrobotics.ca/">Reel-In Robotics</a> 主导自主移动机器人研发，并曾在<a href="https://www.nio.com/">蔚来</a>与<a href="https://www.saicmotor.com/english/">上汽集团</a>从事量产汽车软件开发。此前，我在<a href="https://english.bit.edu.cn/">北京理工大学</a>完成本科与硕士阶段学习。</p>
</div>
<div class="intro-actions"><a href="#projects"><span data-zh="研究项目">Research projects</span> <span aria-hidden="true">↓</span></a></div>
</section>

<section id="research" class="profile-section" aria-labelledby="research-label">
<h2 class="section-label" id="research-label" data-zh="01 / 研究">01 / RESEARCH</h2>
<div class="research-vision">
<div class="vision-equation" role="img" aria-label="{{ site.data.research.vision.title | escape }} equals {{ site.data.research.vision.learning | escape }} plus {{ site.data.research.vision.prior | escape }}" data-zh-aria-label="{{ site.data.research.vision.title_zh | escape }}等于{{ site.data.research.vision.learning_zh | escape }}加上{{ site.data.research.vision.prior_zh | escape }}">
<span class="vision-title" data-zh="{{ site.data.research.vision.title_zh | escape }}">{{ site.data.research.vision.title }}</span>
<span class="equation-symbol equation-equals" aria-hidden="true">=</span>
<span class="vision-learning" data-zh="{{ site.data.research.vision.learning_zh | escape }}">{{ site.data.research.vision.learning }}</span>
<span class="equation-symbol equation-plus" aria-hidden="true">+</span>
<span class="vision-prior" data-zh="{{ site.data.research.vision.prior_zh | escape }}">{{ site.data.research.vision.prior }}</span>
</div>
</div>
<p class="vision-description" data-zh="{{ site.data.research.vision.description_zh | escape }}">{{ site.data.research.vision.description }}</p>
{% include research-projects.html %}
</section>

<section id="publications" class="profile-section" aria-labelledby="publications-label">
<h2 class="section-label" id="publications-label" data-zh="02 / 代表论文">02 / SELECTED PUBLICATIONS</h2>
{% include publication-legend.html %}
{% include selected-publications.html %}
</section>

<section id="experience" class="profile-section compact-section" aria-labelledby="experience-label">
<h2 class="section-label" id="experience-label" data-zh="03 / 工作经历">03 / EXPERIENCE</h2>
<div class="career-list">{% for item in site.data.career.experience %}<article><p class="career-date" data-zh="{{ item.dates_zh | default: item.dates | escape }}">{{ item.dates }}</p><div><h3><a href="{{ item.url }}" data-zh="{{ item.organization_zh | default: item.organization | escape }}">{{ item.organization }}</a></h3><p data-zh="{{ item.role_zh | default: item.role | escape }}">{{ item.role }}</p></div></article>{% endfor %}</div>
</section>

<section id="education" class="profile-section compact-section" aria-labelledby="education-label">
<h2 class="section-label" id="education-label" data-zh="04 / 教育经历">04 / EDUCATION</h2>
<div class="career-list">{% for item in site.data.career.education %}<article><p class="career-date">{{ item.dates }}</p><div><h3 data-zh="{{ item.degree_zh | default: item.degree | escape }}">{{ item.degree }}</h3><p><a href="{{ item.url }}" data-zh="{{ item.institution_zh | default: item.institution | escape }}">{{ item.institution }}</a></p></div></article>{% endfor %}</div>
</section>

<footer class="profile-footer"><span>© 2026 Jiaming Zhong</span><a href="#about-me" data-zh="返回顶部 ↑">Back to top ↑</a></footer>
