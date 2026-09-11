---
permalink: /
title: "Jiaming Zhong"
author_profile: true
redirect_from: ["/about/", "/about.html"]
---


            <section id="about-me" class="profile-intro">
<p class="eyebrow">LEARNING · CONTROL · MOBILE AUTONOMY</p>
<h1>Trustworthy physical AI<br>for mobile autonomy<span class="title-dot">.</span></h1>
<p class="intro-lead">I combine data-driven learning with model-based methods to help autonomous vehicles and robots operate safely under uncertainty.</p>
<p>I am an <strong>Associate Research Officer</strong> at the <a href="https://nrc.canada.ca/en/research-development/research-collaboration/research-centres/automotive-surface-transportation-research-centre">Automotive and Surface Transportation Research Centre, National Research Council Canada</a>. My work spans learning-based planning and control, multi-agent coordination, and explainable decision-making for mobile autonomy.</p>
<p>I received my Ph.D. in Mechanical Engineering from the University of Waterloo in January 2025, advised by <a href="https://uwaterloo.ca/mechatronic-vehicle-systems-lab/">Prof. Amir Khajepour</a> and co-advised by <a href="https://yashpant.github.io/">Prof. Yash Vardhan Pant</a>. Before joining NRC, I was a postdoctoral fellow in Waterloo's Mechatronic Vehicle Systems Lab. My research is informed by experience building autonomous robots and production vehicle software.</p>
<div class="intro-actions"><a class="primary-link" href="#publications">Explore my research <span aria-hidden="true">↗</span></a><a href="mailto:jiaming.zhong@nrc-cnrc.gc.ca">Get in touch <span aria-hidden="true">→</span></a></div>
<div class="scholar-strip" aria-label="Google Scholar citation metrics">
<div><strong>{{ site.data.scholar.citations }}</strong><span>Citations</span></div>
<div><strong>{{ site.data.scholar.h_index }}</strong><span>h-index</span></div>
<div><strong>{{ site.data.scholar.i10_index }}</strong><span>i10-index</span></div>
<p><a href="https://scholar.google.com/citations?user=kSAQtOoAAAAJ">Google Scholar</a><br>Snapshot · {{ site.data.scholar.checked }}</p>
</div>
</section>
<section id="research" class="profile-section">
<div class="section-heading"><p class="eyebrow">01 / RESEARCH</p><h2>From learning to real-world autonomy</h2></div>
<div class="research-grid">
<article><span class="topic-number">01</span><h3>Learning-based control</h3><p>Hybrid model predictive control, probabilistic learning, and uncertainty-aware optimization with a focus on safety constraints and real-time feasibility.</p></article>
<article><span class="topic-number">02</span><h3>Multi-agent systems</h3><p>Scalable coordination, learned interactions, and distributed decision-making for vehicle systems, robot teams, and fleets.</p></article>
<article><span class="topic-number">03</span><h3>Explainable autonomy</h3><p>Language-model reasoning and safety evaluation for interpretable decisions in complex driving scenarios.</p></article>
</div>
<h3 class="subheading">Current &amp; recent projects</h3>
<div class="project-list">
<article><h4><a href="https://safetrucks.fmi.fi/index.php/project-description/">SafeTrucks</a></h4><p>Hybrid data-driven and model-based control for articulated heavy vehicles at NRC, including Transformer-guided MPC and reinforcement learning for MPC weight tuning. Validation spans hardware-in-the-loop simulation and vehicle testing.</p><span class="project-date">NRC · June 2025–present</span></article>
<article><h4>Off-road autonomous driving</h4><p>Learning-based planning and control combined with model-based methods for vehicles operating on deformable terrain.</p><span class="project-date">NRC · June 2025–present</span></article>
<article><h4>Agent-based holistic vehicle control</h4><p>Gaussian-process learning and multi-objective MPC for interconnected vehicle subsystems, unknown agent dynamics, and efficient coordination.</p><span class="project-date">University of Waterloo · Doctoral research, 2021–2025</span></article>
<article><h4>Collaborative mobile robotics</h4><p>Full-stack AMR software for warehouse automation, fleet planning through shared maps, and free-space navigation for delivery and underground mining robots.</p><span class="project-date">Reel-In Robotics · LoopX · University of Waterloo</span></article>
</div>
</section>
<section id="publications" class="profile-section">
<div class="section-heading"><p class="eyebrow">02 / PUBLICATIONS</p><h2>Publications &amp; research outputs</h2></div>
<p class="section-note">My name is shown in bold. Contributions and publication status are noted below. <a href="https://scholar.google.com/citations?user=kSAQtOoAAAAJ">View Google Scholar ↗</a></p>
{% for group in site.data.publications %}<h3 class="publication-group">{{ group.title }}</h3><ol class="publication-list">{% for paper in group.items %}<li class="publication"><div class="publication-year">{{ paper.year }}</div><div class="publication-body"><h4>{% if paper.url %}<a href="{{ paper.url }}">{{ paper.title }}</a>{% else %}{{ paper.title }}{% endif %}</h4><p class="publication-authors">{{ paper.authors }}</p><p class="publication-venue">{{ paper.venue }}{% if paper.year != '' %} · {{ paper.year }}{% endif %}</p>{% if paper.note or paper.project %}<p class="publication-note">{% if paper.note %}{{ paper.note }}{% endif %}{% if paper.project %} · <a href="{{ paper.project }}">Project &amp; code ↗</a>{% endif %}</p>{% endif %}</div></li>{% endfor %}</ol>{% endfor %}
<h3 class="publication-group">Doctoral thesis &amp; patent application</h3>
<div class="output-item"><h4><a href="https://uwspace.uwaterloo.ca/items/5e5abab6-0aaf-40e2-ade6-825577c16f41">Learning agent-based model predictive controllers for holistic vehicle control</a></h4><p><strong>J. Zhong</strong>. Ph.D. dissertation, University of Waterloo, 2025.</p></div>
<div class="output-item"><h4><a href="https://patents.google.com/patent/US20240300528A1/en">Systems and methods for estimating a state for positioning autonomous vehicles transitioning between different environments</a></h4><p>C. Yu, H. Zheng, J. Zhang, Y. Cui, S. Huang, <strong>J. Zhong</strong>, A. Khajepour. Published U.S. patent application, US 2024/0300528 A1, 2024.</p></div>
</section>
<section id="experience" class="profile-section">
<div class="section-heading"><p class="eyebrow">03 / EXPERIENCE</p><h2>Research meets engineering</h2></div>
<div class="timeline">
<article><p class="timeline-date">Jun 2025–present</p><div><h3>National Research Council Canada</h3><p class="role">Associate Research Officer · Ottawa, Canada</p><p>Hybrid control for articulated heavy vehicles and autonomous off-road systems at the Automotive and Surface Transportation Research Centre.</p></div></article>
<article><p class="timeline-date">Feb–Jun 2025</p><div><h3>University of Waterloo</h3><p class="role">Postdoctoral Fellow · Mechatronic Vehicle Systems Lab</p><p>Warehouse autonomy, multi-robot collaboration, and cooperative infrastructure perception; mentorship of Ph.D. students.</p></div></article>
<article><p class="timeline-date">Feb–Jun 2025</p><div><h3>Reel-In Robotics</h3><p class="role">Autonomous Mobile Robot Lead · Kitchener, Canada</p><p>Led full-stack AMR development and integration with cable robots, conveyors, and a cloud management system.</p></div></article>
<article><p class="timeline-date">Dec 2021–Aug 2023</p><div><h3>LoopX Innovation</h3><p class="role">Co-founder &amp; Planning-Control Team Lead · Waterloo, Canada</p><p>Led planning and control R&amp;D for GoosEX delivery robots and autonomous underground mining vehicles; collaborated on auto-parking and 5G fleet navigation.</p></div></article>
<article><p class="timeline-date">Aug 2020–Jun 2021</p><div><h3>NIO</h3><p class="role">Senior Software Engineer · Shanghai, China</p><p>Led air-suspension functional software development for production electric vehicles.</p></div></article>
<article><p class="timeline-date">May 2017–Jul 2020</p><div><h3>SAIC Motor</h3><p class="role">Software Engineer &amp; Software Product Manager · Shanghai, China</p><p>Led an R&amp;D team of more than ten engineers delivering vehicle control software for production EVs.</p></div></article>
</div>
</section>
<section id="education" class="profile-section">
<div class="section-heading"><p class="eyebrow">04 / EDUCATION</p><h2>Academic background</h2></div>
<div class="timeline">
<article><p class="timeline-date">Sep 2021–Jan 2025</p><div><h3>Ph.D., Mechanical Engineering</h3><p class="role">University of Waterloo</p><p>Mechatronic Vehicle Systems Lab. Supervisors: Amir Khajepour and Yash Vardhan Pant.</p></div></article>
<article><p class="timeline-date">Sep 2014–Mar 2017</p><div><h3>M.Sc., Mechanical Engineering</h3><p class="role">Beijing Institute of Technology</p></div></article>
<article><p class="timeline-date">Sep 2010–Jun 2014</p><div><h3>B.Sc., Vehicle Engineering</h3><p class="role">Beijing Institute of Technology</p></div></article>
</div>
<p class="award-note"><strong>Awards:</strong> Graduate Research Studentship and International Doctoral Student Award, University of Waterloo, 2021–2024.</p>
</section>
<section id="service" class="profile-section">
<div class="section-heading"><p class="eyebrow">05 / TEACHING &amp; SERVICE</p><h2>Sharing knowledge</h2></div>
<h3 class="subheading">Teaching &amp; mentoring</h3>
<ul class="clean-list">
<li><strong>University of New Brunswick · 2026</strong><br>Guest lecture, ME 5833: Introduction to Automotive Technologies. Full-stack introduction to autonomous driving.</li>
<li><strong>University of Waterloo · 2023</strong><br>Guest lectures, ME 780: Introduction to Vehicle Dynamics, Control, and Automated Driving. MPC and active safety; navigation and planning.</li>
<li><strong>Beijing Institute of Technology · 2015</strong><br>Laboratory instructor, Vehicle Electronics. CAN bus communication and electrical signal processing.</li>
<li><strong>University of Waterloo · 2024</strong><br>Team advisor for RoboRacer (formerly F1Tenth) autonomous racing in the CL2 Lab.</li>
</ul>
<h3 class="subheading">Peer review</h3>
<p>Reviewer for IEEE Transactions on Industrial Electronics; IEEE Robotics and Automation Letters; IEEE Control Systems Letters; Transportation Research Part D; IEEE Sensors; Journal of Artificial Intelligence Research; and conferences including IROS, ITSC, CCTA, ACC, and ICC.</p>
<h3 class="subheading">Funding proposal experience</h3>
<p>Contributed to proposals for NRCan's Artificial Intelligence for Canadian Energy Innovation (2025), Mitacs Accelerate (2025), NSERC Alliance (2024), and the OCI TalentEdge Internship Program (2024).</p>
</section>
<section id="contact" class="contact-panel">
<p class="eyebrow">LET'S CONNECT</p>
<h2>Interested in learning, control, or mobile autonomy?</h2>
<p>For research conversations and collaboration, get in touch.</p>
<a href="mailto:jiaming.zhong@nrc-cnrc.gc.ca">jiaming.zhong@nrc-cnrc.gc.ca <span aria-hidden="true">↗</span></a>
</section>
<footer class="profile-footer"><span>© 2026 Jiaming Zhong</span><span>Last updated September 2026</span></footer>
