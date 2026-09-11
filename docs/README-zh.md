# Jiaming Zhong — 个人学术主页

学习、控制与移动自主系统研究。基于 Jekyll 和 AcadHomepage。

[English README](../README.md) · [GitHub 仓库](https://github.com/jiamingZhong93/jiamingZhong93.github.io)

## 本地预览

安装 **Node.js 20.19 或更新版本（含 npm）**，然后在仓库目录运行：

| 系统 | 命令 |
| --- | --- |
| Windows | `.\preview.cmd`，也可以双击 `preview.cmd` |
| Ubuntu | `bash preview.sh` |

打开终端显示的本地地址。首次启动需要联网安装依赖。保持终端运行，**修改文件并保存后，预览会自动重新构建并刷新**。按 **Ctrl+C** 停止。

只更新本地预览时，保存即可，**不需要 commit、push 或上线**。如果页面没有刷新，检查终端中的 YAML/JSON 错误，修正后重新保存。修改依赖后重新启动脚本；锁文件变化时，脚本会自动执行 `npm ci`。

这个轻量预览器用于当前主页；额外的 Jekyll 页面或插件可能需要完整 Jekyll 构建。不要编辑生成的 `_site/` 文件，应修改下面的源文件。

## 常用文件说明

| 文件或目录 | 修改内容 |
| --- | --- |
| [`_pages/about.md`](../_pages/about.md) | 个人简介、各部分标题和页面结构 |
| [`_config.yml`](../_config.yml) | `author` 下的姓名、照片、职位、单位、大学及个人链接 |
| [`_data/research.yml`](../_data/research.yml) | Research vision 公式、解释及研究项目 |
| [`_data/publications.json`](../_data/publications.json) | 论文记录，以及哪些显示在 Selected publications |
| [`_data/publication_roles.yml`](../_data/publication_roles.yml) | 自动加粗的作者姓名、作者角色符号及图例 |
| [`_data/career.yml`](../_data/career.yml) | 简洁的工作经历和教育经历 |
| [`_data/navigation.yml`](../_data/navigation.yml) | 顶部导航文字及其对应的页面锚点 |
| [`_data/translations.yml`](../_data/translations.yml) | 项目链接名称的通用中文翻译 |
| [`images/research/`](../images/research/) | 研究项目的照片和图示 |
| [`images/background/`](../images/background/) | 主页顶部横幅的背景照片 |
| [`_data/background.yml`](../_data/background.yml) | 横幅照片、裁切位置、高度和显示开关 |
| [`assets/css/profile.css`](../assets/css/profile.css) | 布局、颜色、字体和不同屏幕尺寸下的样式 |
| [`images/site.webmanifest`](../images/site.webmanifest) 及 favicon 文件 | 浏览器和网站图标，不是个人照片 |

### 更换个人照片

1. 用新照片替换 `images/avatar.jpg`；当前头像就保存在这里。建议使用约 600 × 600 像素的正方形照片。
2. 在 `_config.yml` 中修改现有的 `author.avatar`：

```yaml
author:
  avatar: "/images/avatar.jpg"
```

保留 `author` 下其他字段，不要用这两行覆盖整个配置。也可以填写外部 HTTPS 图片地址。保存后检查本地预览；如果更换文件名或格式，让 `avatar` 与实际路径完全一致。

职位对应 `author.bio`，单位及链接对应 `employer` / `employer_url`，大学及链接对应 `education` / `education_url`。Google Scholar 以简洁的个人链接显示。

### 自定义顶部背景照片

导航栏上方有一条扁平的照片横幅。当前示例是从 `images/research/xlerobot.jpg` 复制到 `images/background/` 的照片。

将自己的照片放进 `images/background/`，然后修改 `_data/background.yml`：

```yaml
enabled: true
image: "/images/background/xlerobot.jpg"
image_alt: "XLeRobot mobile robot and robotic arms in a home environment"
position: "50% 45%"
height: "220px"
mobile_position: "65% 45%"
mobile_height: "150px"
```

- `image`：照片路径；`image_alt`：照片内容说明，供屏幕阅读器使用。
- `position`：先横向、后纵向。`0%` 对齐左侧/顶部，`50%` 居中，`100%` 对齐右侧/底部。例如 `"50% 20%"` 更偏向照片上方，`"50% 80%"` 更偏向下方。
- `height`：桌面横幅高度，默认 `220px`；可以使用 `px`、`rem` 或 `vh`。
- `mobile_position` / `mobile_height`：屏幕宽度不超过 800px 时的裁切位置与高度，默认高度为 `150px`。
- `enabled: false`：隐藏横幅。

照片采用 `object-fit: cover` 等比例缩放填满横幅，超出区域直接裁切，不会拉伸变形。只有存在裁切空间的方向才能移动；例如照片宽度刚好填满横幅时，横向位置不会有明显变化。建议最终换成宽约 2000 像素的高清照片；当前示例分辨率较低，仅用于确认效果。

保存后，本地预览会自动刷新，无需提交或上线。调整源文件即可，不要修改 `_site/` 中的生成文件。

### 修改研究项目、图片和视频

在 `_data/research.yml` 中，`vision` 控制研究公式和解释，`projects` 统一保存全部项目并按照文件顺序展示，包括 F1TENTH 和 XLeRobot。

Research 项目展示项目名称、简短介绍、图片（如有）及链接。正在进行的工作直接在 `description` 中说明，无需单独的 section 或导航项。每项的 `id` 应保持唯一。

替换图片最简单的方法是：用新图片覆盖 `images/research/` 中对应的文件，**保持文件名不变**。如果使用新文件名，则修改相应项目的字段：

```yaml
image: "/images/research/my-project.jpg"
image_alt: "Test vehicle following a planned path on a wet track"
video_url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
links:
  - label: "Paper"
    url: "https://doi.org/YOUR_DOI"
```

这段是放在已有项目内的字段示例。请将示例地址换成真实链接，不需要的字段可以省略。`video_url` 是可选的演示视频链接。图片支持 JPG、PNG、GIF（含动图）、WebP、SVG；建议宽约 1200 像素，并在 `image_alt` 中简短说明图片内容。

使用 GIF 时，将文件放入 `images/research/`，再设置 `image: "/images/research/demo.gif"` 即可。动图加载后由浏览器原生播放，保持比例，点击可打开原图。本地预览以 `image/gif` 提供文件，不会转成静态图片。

### 维护中英文内容

右上角的语言选择器可切换 English / 中文，每次新打开页面默认英文。切换语言不会跳到其他页面或改变项目链接。

- `_pages/about.md`：开场句及中英两套简介段落。
- `_data/research.yml`：在英文项目字段旁维护 `title_zh`、`description_zh`、`image_alt_zh`。紧凑公式使用 `vision.title`、`vision.learning`、`vision.prior` 及对应的 `_zh` 字段，解释文字放在 `vision.description` 中。
- `_data/publications.json`：`title_zh` 为辅助阅读的译文；引用论文时应使用原始英文题目、作者姓名和期刊信息。
- `_data/career.yml`：维护 `dates` / `dates_zh`、机构和职位翻译。工作经历使用完整月份范围，例如 `Feb 2025 – Jun 2025` / `2025年2月 – 2025年6月`。
- `_data/navigation.yml`、`_data/publication_roles.yml` 和 `_data/translations.yml`：分别维护导航、作者角色和项目链接的翻译。

缺少中文字段时会回退到英文，不需要接入翻译服务。若扩展页面模板，给纯文本元素添加 `data-zh="中文"`；图片说明和无障碍标签分别使用 `data-zh-alt`、`data-zh-aria-label`。链接和图标不要放进会被替换的纯文本元素内部。

目前项目图片来自提供的 research statement；之后可以直接换成新的实验照片、结果图或系统示意图。

| `images/research/` 中的文件 | 对应项目 |
| --- | --- |
| `drivellm.jpg` | DriveLLM |
| `multi-agent.jpg` | 多智能体协作 |
| `learning-mpc.jpg` | Learning-based MPC |
| `f1tenth.jpg` | F1TENTH |
| `xlerobot.jpg` | XLeRobot |

### 维护 Selected publications

`_data/publications.json` 的顶层是一个分组数组，每组包含 `title` 和 `items`。新增论文时，放进相应组的 `items` 中。下面是一个完整的最小格式示例：

```json
[
  {
    "title": "Journal articles",
    "items": [
      {
        "title": "Learning agent-based model predictive control for holistic vehicle performance",
        "authors": "J. Zhong, R. V. Mehrizi, M. Pirani, C. Yu, A. Kasaiezadeh, Y. V. Pant, A. Khajepour",
        "venue": "IEEE Transactions on Intelligent Transportation Systems",
        "year": "2024",
        "url": "https://ieeexplore.ieee.org/document/10623843",
        "selected": true,
        "role": "first"
      }
    ]
  }
]
```

日常维护只需修改这几个字段：

- `selected: true`：显示该论文；`false`：保留记录但隐藏。2016 年 test-system 论文已设为隐藏。
- `authors`：按论文作者顺序填写普通文本，用英文逗号分隔；不需要写 HTML 或添加符号。系统自动加粗准确匹配的 `J. Zhong`，并在姓名后加入角色符号。
- `role`：填写下表中的一个值。符号仅描述 Jiaming Zhong 的角色。

| `role` | 自动符号 | 含义 |
| --- | --- | --- |
| `first` | † | 第一作者 |
| `co-first` | * | 共同第一作者 |
| `corresponding` | ‡ | 通讯作者 |
| `coauthor` | § | 合作者 |

特殊作者角色应以论文说明为准。若要更换符号、英文说明或自动加粗的姓名，只需修改 `_data/publication_roles.yml`，section 开头的图例和每篇论文的标注会同时更新。

论文按照数据文件中各分组和条目的顺序显示。`note` 可保留为内部备注，不会在页面输出；`project` 是可选的项目链接。JSON 使用双引号和布尔值 `true` / `false`，最后一项后不要多加逗号。

## 把代码同步到 GitHub

**上传仓库代码和发布网页是两件事。**

本地修改后，先查看改动，再提交实际修改的文件。例如：

```bash
git status --short
git diff
git add _pages/about.md _data/research.yml images/research
git diff --cached
git commit -m "Update research projects"
git push origin main
```

请根据实际改动调整 `git add` 后面的路径；例如换了头像，也要加入新的图片文件。

小改动也可以直接在 GitHub 完成：打开文件，点击 **铅笔 → Commit changes**。上传图片时，进入目标目录，选择 **Add file → Upload files → Commit changes**。这样只会更新 GitHub 中的文件。先提交已有的本地改动，再拉取远端更新：

```bash
git pull --ff-only origin main
```

本地预览仍在运行时，会自动读取拉取后的新内容。

## 手动上线和下线

打开仓库的 [Settings → Pages](https://github.com/jiamingZhong93/jiamingZhong93.github.io/settings/pages)。**Source** 就在 **Build and deployment** 下方，是显示发布方式的下拉框。

| 操作 | 步骤 |
| --- | --- |
| 上线 | 将 **Source** 设为 **Deploy from a branch**，选择 **main** 和 **/ (root)**，点击 **Save**。如果重新上线时没有开始构建，再向 `main` 提交并推送一次内容更新。在 **Actions** 查看部署是否完成。 |
| 下线 | 先将 **Source** 改为 **GitHub Actions**。然后在 **Your site is live at** 的网址旁点击 **⋯ → Unpublish site**。 |

**本仓库没有 Pages 部署工作流。因此，只要 Source 保持 GitHub Actions，普通 git push 就不会部署主页。** 想保持下线，就保留这个设置，并且不要新增 Pages 部署工作流。其他 Actions 运行记录不一定代表网站部署。

仅修改 Source 不会移除已上线的网站，还需要 **Unpublish site**。相反，选择从 `main` 发布期间，后续推送会自动更新公开网页。部署和缓存更新可能需要几分钟。无论公开网站是否上线，本地预览都可照常使用。

参考 GitHub 官方的[发布来源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)和[下线说明](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site)。

## 致谢

基于 [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) 和 [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)。许可证见 [LICENSE](../LICENSE)。
