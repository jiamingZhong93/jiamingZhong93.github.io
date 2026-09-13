---
permalink: /
title: "Jiaming Zhong"
author_profile: true
redirect_from: ["/about/", "/about.html"]
---

<section id="about-me" class="profile-intro">
<p class="intro-lead" data-zh="👋 欢迎！我致力于打造在真实世界中审慎学习与行动的可信物理人工智能（Physical AI）。">👋 Welcome! I’m building trustworthy Physical AI that learns and acts with caution in the real world.</p>
<div class="localized-copy" lang="en">
<p>I am a postdoctoral fellow at the <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">Mechatronic Vehicle Systems Lab</a>, <a href="https://uwaterloo.ca/">University of Waterloo</a>, where I earned my Ph.D. under the supervision of Professors <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/profiles/amir-khajepour-phd-peng">Amir Khajepour</a> and <a href="https://yashpant.github.io/">Yash Vardhan Pant</a>. Before my current postdoctoral appointment, I conducted research as an Associate Research Officer at the <a href="https://nrc.canada.ca/en/research-development/research-collaboration/research-centres/automotive-surface-transportation-research-centre">Automotive and Surface Transportation Research Centre</a>, <a href="https://nrc.canada.ca/en">National Research Council Canada</a> (NRC).</p>
<p>My work spans research and deployment: co-founding <a href="https://loopx.ai/">LoopX</a> and leading planning and control for delivery robots, developing full-stack software for warehouse robots at <a href="https://reelinrobotics.ca/">Reel-In Robotics</a>, and managing production EV software development at <a href="https://www.nio.com/">NIO</a> and <a href="https://www.saicmotor.com/english/">SAIC Motor</a>. I previously studied at <a href="https://english.bit.edu.cn/">Beijing Institute of Technology</a>.</p>
</div>
<div class="localized-copy" lang="zh-CN">
<p>我目前在<a href="https://uwaterloo.ca/">滑铁卢大学</a>的<a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">机电车辆系统实验室</a>从事博士后研究，也在该校获得博士学位，导师为 <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/profiles/amir-khajepour-phd-peng">Amir Khajepour</a> 教授和 <a href="https://yashpant.github.io/">Yash Vardhan Pant</a> 教授。在开始目前的博士后研究之前，我曾在<a href="https://nrc.canada.ca/en">加拿大国家研究委员会</a>（NRC）的<a href="https://nrc.canada.ca/en/research-development/research-collaboration/research-centres/automotive-surface-transportation-research-centre">汽车与地面交通研究中心</a>担任副研究员（Associate Research Officer）。</p>
<p>我的工作涵盖研究与落地：联合创办 <a href="https://loopx.ai/">LoopX</a> 并主导配送机器人的规划与控制，在 <a href="https://reelinrobotics.ca/">Reel-In Robotics</a> 开发仓储机器人的全栈软件，以及在<a href="https://www.nio.com/">蔚来</a>与<a href="https://www.saicmotor.com/english/">上汽集团</a>管理量产电动汽车的软件开发。此前，我曾就读于<a href="https://english.bit.edu.cn/">北京理工大学</a>。</p>
</div>
<div class="home-vision" aria-labelledby="vision-label">
<h2 id="vision-label" class="vision-heading" data-zh="研究愿景">Research vision</h2>
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
<ul class="vision-points">
{% for point in site.data.research.vision.bullets %}<li data-zh="{{ point.text_zh | default: point.text | escape }}">{{ point.text }}</li>{% endfor %}
</ul>
{% include research-trajectory.html %}
</div>
</section>

<section id="research" class="profile-section" aria-labelledby="research-label">
<h2 class="section-label" id="research-label" data-zh="01 / 研究">01 / RESEARCH</h2>
{% include research-projects.html %}
</section>

<section id="publications" class="profile-section" aria-labelledby="publications-label">
<h2 class="section-label" id="publications-label" data-zh="02 / 代表论文">02 / SELECTED PUBLICATIONS</h2>
{% include publication-legend.html %}
{% include selected-publications.html %}
</section>

<section id="teaching" class="profile-section compact-section" aria-labelledby="teaching-label">
<h2 class="section-label" id="teaching-label" data-zh="03 / 教学经历">03 / TEACHING</h2>
<div class="career-list">{% for item in site.data.career.teaching %}<article><p class="career-date">{{ item.dates }}</p><div><h3><a href="{{ item.url }}" data-zh="{{ item.organization_zh | default: item.organization | escape }}">{{ item.organization }}</a></h3><p data-zh="{{ item.role_zh | default: item.role | escape }}">{{ item.role }}</p></div></article>{% endfor %}</div>
</section>

<section id="experience" class="profile-section compact-section" aria-labelledby="experience-label">
<h2 class="section-label" id="experience-label" data-zh="04 / 工作经历">04 / EXPERIENCE</h2>
<div class="career-list">{% for item in site.data.career.experience %}<article><p class="career-date" data-zh="{{ item.dates_zh | default: item.dates | escape }}">{{ item.dates }}</p><div><h3><a href="{{ item.url }}" data-zh="{{ item.organization_zh | default: item.organization | escape }}">{{ item.organization }}</a></h3><p data-zh="{{ item.role_zh | default: item.role | escape }}">{{ item.role }}</p></div></article>{% endfor %}</div>
</section>

<section id="education" class="profile-section compact-section" aria-labelledby="education-label">
<h2 class="section-label" id="education-label" data-zh="05 / 教育经历">05 / EDUCATION</h2>
<div class="career-list">{% for item in site.data.career.education %}<article><p class="career-date">{{ item.dates }}</p><div><h3 data-zh="{{ item.degree_zh | default: item.degree | escape }}">{{ item.degree }}</h3><p><a href="{{ item.url }}" data-zh="{{ item.institution_zh | default: item.institution | escape }}">{{ item.institution }}</a></p></div></article>{% endfor %}</div>
</section>

<footer class="profile-footer"><span>© 2026 Jiaming Zhong</span><a href="#about-me" data-zh="返回顶部 ↑">Back to top ↑</a></footer>
