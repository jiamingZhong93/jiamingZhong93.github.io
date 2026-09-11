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
| [`_config.yml`](../_config.yml) | `author` 下的姓名、照片、职位、单位、大学、地点及个人链接 |
| [`_data/research.yml`](../_data/research.yml) | Research vision 公式、解释及研究项目 |
| [`_data/ongoing.yml`](../_data/ongoing.yml) | Ongoing research，包括 F1TENTH 和 XLeRobot |
| [`_data/publications.json`](../_data/publications.json) | 论文记录，以及哪些显示在 Selected publications |
| [`_data/career.yml`](../_data/career.yml) | 简洁的工作经历和教育经历 |
| [`_data/navigation.yml`](../_data/navigation.yml) | 顶部导航文字及其对应的页面锚点 |
| [`images/research/`](../images/research/) | 研究项目的照片和图示 |
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

### 修改研究项目、图片和视频

在 `_data/research.yml` 中，`vision` 控制研究公式和解释，`projects` 中的项目按照文件顺序展示。`_data/ongoing.yml` 则保存正在开展的研究项目。

每个项目包含标题、简短描述及链接。Research 项目的 `context` 表示单位或时期，Ongoing research 的 `focus` 表示研究主题。每项的 `id` 应保持唯一。

替换图片最简单的方法是：用新图片覆盖 `images/research/` 中对应的文件，**保持文件名不变**。如果使用新文件名，则修改相应项目的字段：

```yaml
image: "/images/research/my-project.jpg"
image_alt: "Test vehicle following a planned path on a wet track"
video_url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
links:
  - label: "Paper"
    url: "https://doi.org/YOUR_DOI"
```

这段是放在已有项目内的字段示例。请将示例地址换成真实链接，不需要的字段可以省略。`video_url` 是可选的演示视频链接。图片支持 JPG、PNG、SVG；建议宽约 1200 像素，并在 `image_alt` 中简短说明图片内容。

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
        "authors": "<strong>J. Zhong</strong> et al.",
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

只有已发表且确认属于第一作者、共同第一作者或通讯作者的论文才设为 `selected: true`。`role` 分别填写 `first`、`co-first`、`corresponding`。其他记录设为 `selected: false`，可保留在数据文件中，但不在页面显示。JSON 使用双引号和布尔值 `true` / `false`，最后一项后不要多加逗号。

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
