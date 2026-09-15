---
permalink: /
title: "Jiaming Zhong"
author_profile: true
redirect_from: ["/about/", "/about.html"]
---

<section id="about-me" class="profile-intro">
<p class="intro-lead" data-zh="👋 我致力于构建在真实世界中安全学习与行动的可信物理人工智能。">👋 I’m building trustworthy Physical AI that learns and acts safely in the real world.</p>
<div class="localized-copy" lang="en">
<p>I am an incoming postdoctoral fellow at the <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">Mechatronic Vehicle Systems Lab</a>, <a href="https://uwaterloo.ca/">University of Waterloo</a>, where I earned my Ph.D. under the supervision of Professors <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/profiles/amir-khajepour-phd-peng">Amir Khajepour</a> and <a href="https://yashpant.github.io/">Yash Vardhan Pant</a>. Previously, I conducted research as an Associate Research Officer at the <a href="https://nrc.canada.ca/en/research-development/research-collaboration/research-centres/automotive-surface-transportation-research-centre">Automotive and Surface Transportation Research Centre</a>, <a href="https://nrc.canada.ca/en">National Research Council Canada</a> (NRC). My earlier studies were at <a href="https://english.bit.edu.cn/">Beijing Institute of Technology</a>.</p>
<p>Beyond academic research, my entrepreneurial and industry experience has shaped how I bridge theory and deployment. I co-founded <a href="https://loopx.ai/">LoopX</a> and led software R&amp;D for autonomous delivery and mining mobility, directed full-stack warehouse robot development at <a href="https://reelinrobotics.ca/">Reel-In Robotics</a>, and contributed to production EV software and release cycles at <a href="https://www.nio.com/">NIO</a> and <a href="https://www.saicmotor.com/english/">SAIC Motor</a>. I turn research into deployable AI while building partnerships for joint funding and student training.</p>
</div>
<div class="localized-copy" lang="zh-CN">
<p>我即将在<a href="https://uwaterloo.ca/">滑铁卢大学</a>的<a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">机电车辆系统实验室</a>从事博士后研究。我在该校获得博士学位，导师为 <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/profiles/amir-khajepour-phd-peng">Amir Khajepour</a> 教授和 <a href="https://yashpant.github.io/">Yash Vardhan Pant</a> 教授。此前，我曾在<a href="https://nrc.canada.ca/en">加拿大国家研究委员会</a>（NRC）的<a href="https://nrc.canada.ca/en/research-development/research-collaboration/research-centres/automotive-surface-transportation-research-centre">汽车与地面交通研究中心</a>担任副研究员（Associate Research Officer）。更早之前，我就读于<a href="https://english.bit.edu.cn/">北京理工大学</a>。</p>
<p>学术研究之外，创业与产业经历塑造了我连接理论与实际部署的研究方式。我联合创办 <a href="https://loopx.ai/">LoopX</a>，主导自主配送与矿区运输的软件研发；在 <a href="https://reelinrobotics.ca/">Reel-In Robotics</a> 负责仓储机器人的全栈开发；在<a href="https://www.nio.com/">蔚来</a>和<a href="https://www.saicmotor.com/english/">上汽集团</a>参与量产电动汽车软件研发与版本发布。我推动科研成果转化为可部署的人工智能系统，并通过合作支持联合项目申请与学生培养。</p>
</div>
<div class="home-vision" aria-labelledby="vision-label">
<h2 id="vision-label" class="vision-heading home-subheading" data-zh="研究愿景">Research vision</h2>
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
<h2 id="core-questions-label" class="home-subheading core-focus-heading" data-zh="核心问题">Core questions</h2>
<ul class="vision-points" aria-labelledby="core-questions-label">
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
<div class="career-list">{% for item in site.data.career.experience %}
<article><p class="career-date" data-zh="{{ item.dates_zh | default: item.dates | escape }}">{{ item.dates }}</p><div>
<h3>{% if item.organizations %}{% for organization in item.organizations %}<a href="{{ organization.url }}" data-zh="{{ organization.name_zh | default: organization.name | escape }}">{{ organization.name }}</a>{% unless forloop.last %} <span class="career-organization-separator">/</span> {% endunless %}{% endfor %}{% else %}<a href="{{ item.url }}" data-zh="{{ item.organization_zh | default: item.organization | escape }}">{{ item.organization }}</a>{% endif %}</h3>
<p data-zh="{{ item.role_zh | default: item.role | escape }}">{{ item.role }}</p>
</div></article>{% endfor %}</div>
</section>

<section id="education" class="profile-section compact-section" aria-labelledby="education-label">
<h2 class="section-label" id="education-label" data-zh="05 / 教育经历">05 / EDUCATION</h2>
<div class="career-list">{% for item in site.data.career.education %}<article><p class="career-date">{{ item.dates }}</p><div><h3 data-zh="{{ item.degree_zh | default: item.degree | escape }}">{{ item.degree }}</h3><p data-zh="{{ item.institution_zh | default: item.institution | escape }}">{{ item.institution }}</p></div></article>{% endfor %}</div>
</section>

<footer class="profile-footer"><span data-zh="© 2026 {{ site.author.name_zh | escape }}">© 2026 Jiaming Zhong</span><a href="#about-me" data-zh="返回顶部 ↑">Back to top ↑</a></footer>
