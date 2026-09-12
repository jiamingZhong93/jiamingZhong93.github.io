# 主页日常维护指南

[公开主页](https://jiamingzhong.world/) · [English README](../README.md) · [发布设置](https://github.com/jiamingZhong93/jiamingZhong93.github.io/settings/pages)

**日常流程：** 本地预览 → 同步修改中英文 → 检查电脑和手机效果 → 提交并推送 → 确认上线。

## 1. 启动本地预览

安装 **Node.js 20.19 或更新版本（含 npm）**，在仓库文件夹启动：

| 系统 | 启动方式 |
| --- | --- |
| Windows | 双击 `preview.cmd`，或运行 `.\preview.cmd` |
| Ubuntu | `bash preview.sh` |

打开终端显示的地址，通常是 `http://127.0.0.1:4000/`。首次启动需要联网安装依赖。保持终端运行，保存修改后页面会自动重新构建、刷新；按 **Ctrl+C** 停止。

仅本地保存不会发布。修改源文件，不要编辑生成的 `_site/`。预览不再刷新时，查看终端中的 YAML/JSON 报错。当前预览器用于这份主页；新增 Jekyll 页面或插件可能需要完整 Jekyll 构建。

## 2. 找到需要修改的内容

| 修改内容 | 文件和位置 |
| --- | --- |
| 开场句、个人简介、各部分标题 | [_pages/about.md](../_pages/about.md) |
| 默认/备用头像、个人链接 | [_config.yml](../_config.yml) 的 `author` |
| 中英文职位及单位 | [_config.yml](../_config.yml) 的 `author.roles` |
| Home 研究愿景、研究项目 | [_data/research.yml](../_data/research.yml) 的 `vision` 和 `projects` |
| 论文、作者角色符号 | [_data/publications.json](../_data/publications.json)、[_data/publication_roles.yml](../_data/publication_roles.yml) |
| 教学、工作与教育经历 | [_data/career.yml](../_data/career.yml) |
| 导航、项目链接的翻译 | [_data/navigation.yml](../_data/navigation.yml)、[_data/translations.yml](../_data/translations.yml) |
| 顶部背景照片、裁切位置、中英文标题与描述 | [_data/background.yml](../_data/background.yml) |
| 浏览器标题、搜索简介 | [_includes/seo.html](../_includes/seo.html)；英文简介在 [_config.yml](../_config.yml) |
| 字体、间距、手机布局 | [assets/css/profile.css](../assets/css/profile.css) |

导航名称、中英文翻译和章节链接统一在 `_data/navigation.yml` 中维护。**Home / 主页** 与其他导航项使用相同样式。手机上导航固定在顶部，显示当前章节；轻触后从下拉菜单切换章节。

Teaching 数据在 `_data/career.yml` 的 `teaching` 下，使用与 Experience 相同的中英文字段，显示在 Experience 前面。

### 中英文要一起维护

右上角按钮在同一页面切换语言，每次刷新默认英文。中文由你手动维护，不会自动翻译。

- **数据文件：** 成对修改 `title/title_zh`、`description/description_zh`、`image_alt/image_alt_zh`。公式还包括 `learning/learning_zh`、`prior/prior_zh`。
- **个人简介：** 在 `_pages/about.md` 中分别修改 `lang="en"` 和 `lang="zh-CN"` 的两个 `localized-copy` 区块。开场句和各部分标题的中文在 `data-zh="中文"` 中。
- **个人职位：** 在 `_config.yml` 的 `author.roles` 列表统一修改中英文。每项包含 `title/title_zh`、`institution/institution_zh` 和 `url`；列表顺序即显示顺序。
- **工作经历：** `dates` 和 `dates_zh` 都填写起止月份，例如 `Feb 2025 – Jun 2025` / `2025年2月 – 2025年6月`。
- **新项目链接名称：** 在 `_data/translations.yml` 的 `links` 下加入中文对应值。项目字段和链接名称缺少翻译时显示英文。

不要把链接或图标包在会被 `data-zh` 替换的文字元素内。每次更新内容后都切换语言检查一次。

## 3. 修改研究愿景、项目和图片

**Home 末尾的 Research vision / 研究愿景** 在 `_data/research.yml` 的 `vision` 下维护：修改公式字段、`description/description_zh` 简介，以及 `bullets` 简短要点。每条要点同时填写中英文：

```yaml
  bullets:
    - text: "One concise research direction."
      text_zh: "一句简短的研究方向。"
```

在 `_data/research.yml` 中复制现有项目即可新增。每个 `id` 必须唯一；调整条目顺序即可调整显示顺序，删除整项即可移除。介绍保持简短，同时填写中文。

```yaml
  - id: my-project
    title: "My project: Short focus"
    title_zh: "我的项目：简短方向"
    description: "One sentence about the project."
    description_zh: "用一句话介绍项目。"
    image: "/images/research/my-project.gif"
    image_alt: "A short description of the demonstration."
    image_alt_zh: "简短描述演示内容。"
    links:
      - label: "Project"
        url: "https://example.com/"
```

把示例文字、网址换成真实项目内容。`image` 可省略；需要视频时可添加 `video_url` 链接。

| 图片 | 替换方式 |
| --- | --- |
| 默认头像 | 替换 `images/avatar.jpg`；若改名，同步修改 `_config.yml` 中的 `author.avatar`。 |
| 备用头像 | 替换 `images/portraits/alternate.jpg`；若改名，同步修改 `author.avatar_alternate`。 |
| 项目图片 | 放进 `images/research/`，修改项目的 `image` 路径。支持 JPG、PNG、GIF 动图、WebP、SVG，保持原图比例。 |
| 顶部背景 | 直接往 `images/background/` 添加或删除照片；支持的图片会自动进入随机池，无需维护文件列表。 |

### 头像

在 `_config.yml` 的 `author` 下维护：

```yaml
  avatar: "/images/avatar.jpg"
  avatar_position: "50% 50%"
  avatar_alternate: "/images/portraits/alternate.jpg"
  avatar_alternate_position: "50% 50%"
  avatar_alternate_alt: "A short description of the alternate photo"
  avatar_alternate_alt_zh: "备用照片的简短中文说明"
```

位置参数依次控制横向、纵向裁切。每次刷新先显示默认头像，搜索和社交分享也继续使用默认头像。鼠标每次进入头像或点击头像都会切换；触屏上每轻触一次切换一次。未配置备用照片或图片加载失败时禁用切换，保留默认头像。删除 `avatar_alternate` 即可关闭此功能。

头像尺寸在 `assets/css/profile.css` 中设置：电脑为 208 × 236 px，窗口宽度不超过 1050 px 时为 198 × 224 px；手机宽度为 96–112 px，高度跟随旁边的职位文字。改尺寸时调整 CSS，改裁切位置时调整上面的 position 参数。

头像采用轻柔的 3D 翻面；动画中再次点击会流畅地反向切换，触发区域始终固定。系统开启“减少动态效果”时直接切换。如需调整动画，在 `assets/css/profile.css` 的 `.portrait-flipper` 中修改 `720ms` 时长和缓动参数。

当前备用图是 **SafeTrucks 雪地照片的临时示例**，与横幅照片来源相同。之后换成自己的照片，并同步更新中英文说明。

### 顶部背景照片

所有设备的横幅都只显示一张铺满宽度的照片，刷新时随机选择首张。每张停留 3 秒，再用 1 秒柔和淡入淡出切换下一张；点击照片也会切换。照片多于一张时，相邻两张不会重复。调整窗口大小或切换语言保留当前照片和已选好的下一张。建议使用清晰的宽幅照片；裁切只发生在浏览器中，不修改原文件。

电脑上，鼠标悬停在**照片任意区域**，同时显示当前照片说明和下一张预告，不再显示角落图标。点击说明区以外的照片区域切换；只要鼠标仍在横幅内，两条说明就保持显示并更新。移开鼠标后收起。

触屏时，**长按约半秒**显示两条说明，并保留供阅读；松手不会切图。轻触说明区以外的照片区域，切换并收起说明；普通短按也会切换。滚动、拖动和双指缩放不会触发手动切图。说明文字及其来源链接不会切图。

鼠标悬停横幅任意区域、触屏按住或说明保持展开、键盘焦点位于横幅或说明内时暂停计时。页面隐藏或横幅滚出屏幕时也暂停，恢复后继续剩余时间；每次过渡完成后重新计算停留时间。用 **Tab** 聚焦横幅显示说明，**回车/空格**切换，**Esc** 收起说明。仅有一张可用照片时只显示当前说明、不轮播；坏图自动跳过。

新文件会自动加入。需要单独设置时，在 `_data/background.yml` 的 `images → 文件名` 下添加：

```yaml
  my-photo.jpg:
    position: "50% 50%"
    mobile_position: "60% 50%"
    title: "A short photo title"
    title_zh: "简短的照片标题"
    description: "One brief description of the photo."
    description_zh: "一句简短的照片说明。"
```

- `position` / `mobile_position`：先横向%、后纵向%；未设置时使用文件顶部的默认值。
- **左下角：** 第一行是 `title/title_zh` 标题，下方是较小字号的 `description/description_zh` 描述，描述最多两行。**右下角：** 第一行是“Next / 下一张”，第二行只显示下一张的标题。左右底部对齐，大部分宽度留给左侧；标题应简短，便于手机阅读。
- 未填中文时显示英文；旧的 `caption/caption_zh` 仍可作为标题使用，标题未填时显示文件名。描述可以省略。
- `source` 让当前标题链接到来源网页；`credit/credit_zh` 提供无障碍署名。需要直接显示的图片署名写进描述，可参考 SafeTrucks 示例。
- 单张照片设 `enabled: false` 可暂时排除；文件顶部的 `enabled: false` 隐藏整个横幅。`height` / `mobile_height` 控制高度。
- 文件顶部的 `fade_duration: 1000` 控制淡入淡出过渡的毫秒数；`interval: 3000` 控制**过渡完成后的停留时间**。照片、播放时间和中英文说明仍统一在这一配置文件中维护。
- 现有 F1TENTH、XLeRobot 示例通过 `crop`（源图像素中的 x、y、宽、高）与 `source_size` 截取拼图里的实拍区域。**换成独立照片后请删除这两个字段**，普通照片不需要它们。

研究公式整体共用一条动态渐变。在 `assets/css/profile.css` 的 `.vision-equation` / `@keyframes vision-colors` 处调整颜色和 `18s` 周期；系统开启“减少动态效果”时自动显示静态渐变。

每个项目先显示标题，电脑上标题下方左图右文，手机上依次为“标题 → 图片/GIF → 介绍和链接”。项目、论文及经历条目通过间距区分，不使用分隔横线。

使用公开来源图片时，在对应项目旁用注释保留出处。SafeTrucks 项目中已记录雪地行车照片的原始来源。

## 4. 修改论文

在 `_data/publications.json` 中，复制某个分组的 `items` 内已有论文，再修改：

| 字段 | 填写内容 |
| --- | --- |
| `title` / `title_zh` | 原始论文题目 / 中文阅读译文 |
| `authors` | 按论文顺序填写作者，用英文逗号分隔；不用 HTML 或手动加符号 |
| `venue`、`year`、`url` | 原始期刊/会议信息、年份、论文链接 |
| `selected` | `true` 显示；`false` 保留记录但隐藏 |
| `role` | `first` 第一作者 †；`co-first` 共同第一作者 *；`corresponding` 通讯作者 ‡；`coauthor` 合作者（无符号） |
| `project` | 可选的项目网址 |

系统自动加粗准确匹配的 `J. Zhong` 并添加角色符号。修改姓名、符号或双语图例时，只改 `_data/publication_roles.yml` 即可。论文按文件顺序展示；JSON 使用双引号，最后一项后不要加逗号。

## 5. 提交修改并上线

**Pages 从 `main` 发布期间，推送到 `main` 或直接在 GitHub 网页提交修改，都会自动更新公开主页。**

先确认中英文及手机预览，再提交实际修改的文件。根据本次改动调整示例中的文件路径：

```bash
git status --short
git diff
git add _data/research.yml images/research
git diff --cached
git commit -m "Update research projects"
git push origin main
```

在 [Actions](https://github.com/jiamingZhong93/jiamingZhong93.github.io/actions) 确认 **pages build and deployment** 成功，再打开公开主页检查。部署及缓存更新可能需要几分钟。

小修改也可以在 GitHub 用 **铅笔 → Commit changes**；上传图片用 **Add file → Upload files**。之后再次本地编辑前，确认本地没有未提交修改，再执行 `git pull --ff-only origin main` 同步。

## 6. 暂时下线和恢复

打开 [Settings → Pages](https://github.com/jiamingZhong93/jiamingZhong93.github.io/settings/pages)：

| 操作 | 步骤 |
| --- | --- |
| 下线 | 先将 **Source → GitHub Actions**，停止从分支自动发布；再在网址旁选择 **⋯ → Unpublish site**。只切换 Source 不会移除已上线网站。 |
| 恢复上线 | 设置 **Source → Deploy from a branch**，选择 **main**、**/ (root)**，可点击时点击 **Save**。如果没有开始部署，再推送一次内容更新。 |

若恢复时没有内容要改，可以用空提交触发：

```bash
git commit --allow-empty -m "Trigger GitHub Pages publication"
git push origin main
```

上述暂停方式适用于当前仓库：`.github/workflows/` 中没有自定义 Pages 部署工作流。公开主页下线期间，本地预览仍然可用。

基于 [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) / [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)。[许可证](../LICENSE)。
