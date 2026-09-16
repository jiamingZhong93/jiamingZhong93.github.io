# 主页日常维护指南

[仓库概览](../README.md) · [English maintenance guide](maintenance-en.md) · [公开主页](https://jiamingzhong.world/)

**日常流程：** 本地预览 → 同步修改中英文 → 检查电脑和手机效果 → 提交并推送 → 确认上线。

[本地预览](#1-启动本地预览) · [内容与翻译](#2-找到需要修改的内容) · [研究与图片](#3-修改研究愿景项目和图片) · [论文](#4-修改论文) · [发布](#5-提交修改并上线) · [暂时下线](#6-暂时下线和恢复)

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
| 中英文姓名、默认/备用头像、个人链接 | [_config.yml](../_config.yml) 的 `author` |
| 中英文职位及单位 | [_config.yml](../_config.yml) 的 `author.roles` |
| Home 研究愿景、研究项目 | [_data/research.yml](../_data/research.yml) 的 `vision` 和 `projects` |
| Home 中英文研究历程图 | [_data/trajectory.yml](../_data/trajectory.yml) 的 `phases` 及各组 `steps` |
| 论文、作者角色符号 | [_data/publications.json](../_data/publications.json)、[_data/publication_roles.yml](../_data/publication_roles.yml) |
| 教学、工作与教育经历 | [_data/career.yml](../_data/career.yml) |
| 导航、项目链接的翻译 | [_data/navigation.yml](../_data/navigation.yml)、[_data/translations.yml](../_data/translations.yml) |
| 顶部背景照片、裁切位置、中英文标题与描述 | [_data/background.yml](../_data/background.yml) |
| 浏览器标题、中英文搜索简介 | [_config.yml](../_config.yml) 的 `title`、`author.name_zh`、`description/description_zh`；由 [_includes/seo.html](../_includes/seo.html) 生成 |
| JZ 标签页图标 | [images/favicon.svg](../images/favicon.svg) 及 `images/` 下对应的 PNG/ICO 文件 |
| 字体、间距、手机布局 | [assets/css/profile.css](../assets/css/profile.css) |

导航名称、中英文翻译和章节链接统一在 `_data/navigation.yml` 中维护。**Home / 主页** 与其他导航项使用相同样式。手机上导航固定在顶部，显示当前章节；轻触后从下拉菜单切换章节。

教学经历在 `_data/career.yml` 的 `teaching` 下维护，使用与工作经历相同的中英文字段，显示在工作经历之前。

同一时段涉及多个单位的经历，可用 `organizations` 数组为每个单位填写 `name`、`name_zh` 和 `url`，合并条目只保留一组日期和职位。单一单位的条目仍使用 `organization`、`organization_zh` 和 `url`。教学与教育经历中的学校名称显示为纯文本。

### 中英文要一起维护

右上角的语言选项用于在同一页面切换语言，每次刷新默认显示英文。中文内容需要手动维护，不会自动翻译。

- **数据文件：** 成对修改 `title/title_zh`、`description/description_zh`、`image_alt/image_alt_zh`。公式还包括 `learning/learning_zh`、`prior/prior_zh`。
- **个人简介：** 在 `_pages/about.md` 中分别修改 `lang="en"` 和 `lang="zh-CN"` 的两个 `localized-copy` 区块。开场句和各部分标题的中文在 `data-zh="中文"` 中。
- **姓名与页面简介：** 在 `_config.yml` 中成对维护 `author.name` / `author.name_zh` 和 `description` / `description_zh`。中文姓名的姓与名之间不留空格；论文作者列表保留原文姓名。
- **邮箱链接：** 修改 `_config.yml` 的 `author.email`，即可更新个人栏的邮件链接。
- **个人职位：** 在 `_config.yml` 的 `author.roles` 列表统一修改中英文。每项包含 `title/title_zh`、`institution/institution_zh` 和 `url`；列表顺序即显示顺序。
- **工作经历：** `dates` 和 `dates_zh` 都填写起止月份，例如 `Feb 2025 – Jun 2025` / `2025年2月 – 2025年6月`。
- **新项目链接名称：** 在 `_data/translations.yml` 的 `links` 下加入中文对应值。项目字段和链接名称缺少翻译时显示英文。

链接和图标应放在带有 `data-zh` 的文字元素之外，避免切换语言时被替换。每次更新内容后都切换语言检查一次。

## 3. 修改研究愿景、项目和图片

**主页中的研究愿景** 在 `_data/research.yml` 的 `vision` 下维护：修改公式字段、`description/description_zh` 简介，以及 `bullets` 简短研究问题。每个问题同时填写中英文：

```yaml
  bullets:
    - text: "What research question guides this direction?"
      text_zh: "这一方向希望回答什么研究问题？"
```

**研究历程图** 位于这些问题之后，分为六个主题，每组包含若干简短的研究标签。在 `_data/trajectory.yml` 的 `phases` 及各组内部的 `steps` 中维护；两层列表的顺序决定路线。阶段名称统一在 `stages` 中维护；每组用 `stage: foundations`、`ongoing` 或 `frontier` 选择阶段，中英文同时修改：

```yaml
phases:
  - id: dynamics
    title: "Dynamics & uncertainty"
    title_zh: "动力学与不确定性"
    steps:
      - id: residual-dynamics
        title: "Probabilistic residual learning"
        title_zh: "概率残差学习"
```

图的标题在文件顶部的 `title/title_zh`。修改主题名称时保留原有 `id`，小图标由这个字段选择；各研究步骤的 `id` 保持唯一，调整顺序时也保留。标签尽量简短，六个主题在电脑上排成三列两行、手机上排成两列三行，不显示描述或编号。文字与顺序只需修改 YAML；样式在 `assets/css/profile.css`，图标在 `_includes/research-trajectory.html`。

在 `_data/research.yml` 中复制现有项目即可新增。每个 `id` 必须唯一；调整条目顺序即可调整显示顺序，删除整项即可移除。介绍保持简短，同时维护中英文。`description/description_zh` 支持用 Markdown `**加粗**` 突出关键方法；两种语言分别渲染到独立的 `localized-copy` 区块，切换语言时会保留格式。若加粗内容以括号结尾，结束标记 `**` 与后续中文之间加一个空格，例如 `**强化学习（RL）** 增强控制`。

```yaml
  - id: my-project
    title: "My project: Short focus"
    title_zh: "我的项目：简短方向"
    description: "One sentence about the project and its **key method**."
    description_zh: "用一句话介绍项目及其**关键方法**。"
    image: "/images/research/my-project.gif"
    image_alt: "A short description of the demonstration."
    image_alt_zh: "简短描述演示内容。"
    links:
      - label: "Project"
        url: "https://example.com/"
```

把示例文字、网址换成真实项目内容。`image` 可省略；需要视频时可添加 `video_url` 链接。

每个项目的 `links` 列表统一按**学位论文 → 正式发表 → arXiv → 项目 → 平台**排序，没有的类别跳过，同一类别的多个链接放在一起。页面按列表顺序显示；新增链接名称时，在 `_data/translations.yml` 中补充中文翻译。

| 图片 | 替换方式 |
| --- | --- |
| 默认头像 | 替换 `images/avatar.jpg`；若改名，同步修改 `_config.yml` 中的 `author.avatar`。 |
| 备用头像 | 替换 `images/portraits/alternate.jpg`；若改名，同步修改 `author.avatar_alternate`。 |
| 项目图片 | 放进 `images/research/`，修改项目的 `image` 路径。支持 JPG、PNG、GIF 动图、WebP、SVG；宽度统一，高度按原图比例自适应，无需填写 `image_aspect_ratio`。 |
| 顶部背景 | 照片放进 `images/background/`，再在 `_data/background.yml` 的 `images` 下添加对应文件名；只有已配置的照片参与轮播。 |

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

头像尺寸在 `assets/css/profile.css` 中设置：电脑为 208 × 236 px，窗口宽度不超过 1050 px 时为 198 × 224 px；手机宽度为 96–112 px，高度跟随旁边的职位文字，最高 140 px。改尺寸时调整 CSS，改裁切位置时调整上面的 position 参数。

头像采用轻柔的 3D 翻面；动画中再次点击会流畅地反向切换，触发区域始终固定。系统开启“减少动态效果”时直接切换。如需调整动画，在 `assets/css/profile.css` 的 `.portrait-flipper` 中修改 `720ms` 时长和缓动参数。

当前默认图为户外肖像，备用图为正装肖像。两张头像的地址也带构建版本，替换后随新页面刷新；换图时同步维护中英文说明。

### 顶部背景照片

手机逐张显示照片，统一用 `cover` 裁切铺满横幅，不拉伸、不留模糊补边。电脑端（窗口宽度超过 800 px）的风景照片保持单张显示，相关的研究与机器人照片采用横向组合。无法适配宽横幅的照片设为 `desktop: false`，保留在手机上显示。刷新时随机选择首张照片或组合，每张用 1 秒淡入淡出，过渡完成后通常停留 3 秒；点击也会切换，相邻选择不会重复。切换语言保留当前和下一张。窗口跨过 800 px 时，组合内的单图对应到电脑组合，组合则对应到手机首张可用照片；仅手机显示的照片会替换为可用的电脑照片或组合。裁切只发生在浏览器中，不修改图片文件。

电脑上，鼠标悬停在**照片任意区域**，同时显示当前照片说明和下一张预告，不再显示角落图标。点击说明区以外的照片区域切换；只要鼠标仍在横幅内，两条说明就保持显示并更新。移开鼠标后收起。

触屏时，**长按约半秒**显示两条说明，持续按住可让说明在自动切换照片后继续显示。松手后，本张照片的说明保留供阅读，到下一张时收起；松手本身不会切换照片。轻触说明区以外的照片区域，切换并收起说明；普通短按也会切换。滚动、拖动和双指缩放不会触发手动切换照片。点击说明文字不会触发切换。标题和描述均为纯文字，不含链接。

显示说明时继续轮播，仅把**本张照片的停留时间增加 1 秒（3 → 4 秒）**，同一张照片反复悬停不会叠加。如果切到下一张时仍悬停或持续长按，说明保持显示，新照片也停留 4 秒。只有页面隐藏或横幅滚出屏幕时暂停计时，恢复后继续剩余时间；每次过渡完成后重新计算停留时间。用 **Tab** 聚焦横幅显示说明，**回车/空格**切换，**Esc** 收起说明。仅有一张可用照片时只显示当前说明、不轮播；加载失败的图片自动跳过。

**调整轮播比重：** 在 `_data/background.yml` 顶层设置：

```yaml
category_weights:
  experience: 2
  scenery: 1
```

研究、工作、创业及职业经历照片填写 `category: experience`，风景与休闲照片填写 `category: scenery`；电脑组合也单独填写 `category`。**先保证未看过的照片优先，再按类别权重决定顺序**：当两类都有未看内容时，`2:1` 表示下一张优先选经历类的概率是风景类的两倍。某类看完后，继续播放另一类未看过的照片，不提前重复。因此权重影响出场先后，不保证长期播放次数为 2:1。日后只需调整这两个数字；某类设为 `0` 可暂停该类，两类都为 `0` 则隐藏横幅。

当前窗口可显示且已启用的照片或组合全部看完后，才整体开始下一轮；屏幕宽度限制仍然生效。浏览器通过 `localStorage` 保留已看记录，刷新只重新排列未看内容，不清空进度；记录仅限同一浏览器、设备和网站地址，存储不可用时只在当前页面内有效。组合与其成员共享观看记录，切换屏幕布局时优先补齐未见内容。“下一张”显示的是已选定的真实下一张，悬停及切换语言不会重新抽取。刷新时等待随机首张就绪，不先闪现一张固定旧图；禁用 JavaScript 时才显示静态备用图。权重不影响上述播放时间。

新增一张照片：

1. 将适合网页的 JPG、PNG 或 WebP 放进 `images/background/`，使用不重复的文件名，例如 `photo_2026_waterloo.webp`。导出 WebP 副本可减少下载量，原图保持不变。HEIC 请先转成 WebP 或 JPG，并确认方向正确。大照片通常可导出长边约 2400–3200 px 的副本；全尺寸原图保存在这个公开目录之外。
2. 在 `_data/background.yml` 已有的 `images` 下添加完全对应的文件名，并填写中英文。**只有文件、没有对应配置的照片不会显示。**
3. 分别检查电脑、平板与手机效果。照片不适合宽横幅时，添加 `desktop: false`，仅在移动布局显示。从轮播移除照片只需删除配置条目，原文件可保留备用；所有设备暂时隐藏可设 `enabled: false`。

文件名**可以数字开头**；统一使用 `photo_` 只是方便维护。线上文件名区分大小写；同一个文件名在 YAML 中只能配置一次，重复的键会导致配置报错。

在 `images` 下添加条目的示例：

```yaml
  photo_2026_waterloo.webp:
    category: scenery
    fit: "cover"
    position: "50% 50%"
    mobile_position: "60% 50%"
    title: "A short photo title"
    title_zh: "简短的照片标题"
    description: "One brief description of the photo."
    description_zh: "一句简短的照片说明。"
```

- `fit`：电脑端使用默认的 `cover`，通过裁切铺满横幅，不拉伸。`contain` 完整显示照片，但会留下虚化补边；当前仅裁切后的 F1TENTH 照片保留这个例外。避免大面积虚化：优先重新取景、加入相关研究照片组合，或设为 `desktop: false`。手机端强制使用 `cover`；旧字段 `mobile_fit` 可省略，不能再开启模糊补边。手机布局适用于不超过 800 px 的窗口宽度。
- `position` / `mobile_position`：先横向%、后纵向%，例如 `"50% 35%"`。第二个数增大可显示更靠下的区域，减小可显示更靠上的区域，实际效果取决于照片比例。湖泊、水岸照片需特别检查手机裁切是否保留足够的水面。电脑使用 `contain` 时，位置决定完整照片在横幅内的对齐方式。省略手机位置时优先沿用该照片的电脑位置，否则使用文件顶部的默认设置。
- **左下角：** 第一行是 `title/title_zh` 标题，下方是较小字号的 `description/description_zh` 描述，描述最多两行。**右下角：** 第一行是“Next / 下一张”，第二行只显示下一张的标题。左右底部对齐，大部分宽度留给左侧；标题应简短，便于手机阅读。
- 未填中文时显示英文；旧的 `caption/caption_zh` 仍可作为标题使用，标题未填时显示文件名。描述可以省略。
- `source` 和 `credit/credit_zh` 在数据文件中保留来源及署名记录，背景说明不显示链接。需要直接显示的图片署名写进描述，可参考 SafeTrucks 示例。
- 单张照片设 `enabled: false` 可暂时排除；文件顶部的 `enabled: false` 隐藏整个横幅。`height` 设置电脑基础高度（220 px）；超宽屏会适度增加高度，最高 360 px，以保留人物和机器人主体。`mobile_height` 仍为 150 px。超宽屏比例在 `assets/css/profile.css` 的 `.home-background` 中调整。
- 单张照片设 `desktop: false` 后，超过 800 px 的窗口不再显示它，原有手机取景和说明保持不变。删除这个字段即可恢复电脑端显示。分辨率较低或主体需要较大纵向空间的照片适合这样处理，避免电脑上只在中央显示小图、两侧留下大面积虚化。
- 单张照片可选填 `desktop_max_width`，限制电脑端显示它的最大窗口宽度（像素）。F1TENTH 使用 `desktop_max_width: 1100`，避免超宽窗口出现大片补边；更宽时跳过，手机仍用同一张照片进行 `cover` 裁切。
- 单张照片可选填 `mobile_max_width`，仅限制不超过 800 px 的移动布局，例如设为 `520`，让高竖幅人像跳过裁切不佳的较宽平板。此字段不会影响该照片或其组合在电脑端显示。
- 文件顶部的 `fade_duration: 1000` 控制淡入淡出过渡的毫秒数；`interval: 3000` 控制**过渡完成后的停留时间**；`info_extra: 1000` 控制显示说明时额外增加的毫秒数，每张照片只加一次。照片、播放时间和中英文说明仍统一在这一配置文件中维护。
- 使用 `crop`（原图像素中的 x、y、宽、高）和 `source_size: [宽, 高]`，可以裁掉多余留白而不修改原文件。电脑 `fit` 再决定如何显示裁切区域：`contain` 完整保留，`cover` 铺满横幅；手机始终用 `cover` 铺满。裁切区域居中显示，要移动主体请调整 `crop`，此时 `position` 不控制裁切区域。可参考 F1TENTH 条目；替换原照片时同步更新或删除这两个字段。

**修改电脑端横向组合：** 在 `_data/background.yml` 末尾找到 `desktop_groups`。每组包含唯一的 `id`、中英文 `title` 与 `description`，以及按从左到右排列的 `photos` 列表。各小图紧密相连，不留空隙，也没有独立圆角。

- 每个小图的 `file` 必须同时存在于 `images` 配置中、保持启用，且不能设 `desktop: false`；原有单图说明和手机取景仍在那里维护。重命名或删除组合内的照片时，两处都要更新。
- 小图的 `position` 单独控制电脑组合中的取景，不影响手机；`weight` 只控制**排版中的相对宽度**，默认为 `1`，不控制轮播概率。轮播概率由组合的 `category` 和顶层 `category_weights` 决定。`fit` 保持 `"cover"` 或省略，通过调整宽度与位置保留主体，避免虚化补边。
- 小图也可同时设置 `crop: "x y 宽 高"` 和 `source_size: [原图宽, 原图高]`，单位为原图像素，用于精确裁切而不修改原文件。组合不会继承单图的裁切设置；裁切区域居中显示，`fit` 决定铺满或完整保留，此时调整 `crop` 而非 `position` 来移动主体。换图后同步更新或删除这两个字段。
- 可选字段 `max_aspect` 限制该小图“宽度 ÷ 横幅高度”的最大值。**每组至少一张照片不设此上限**，用于填满剩余宽度。普通电脑窗口和超宽屏都要检查取景。
- 电脑使用整组的标题与描述，手机继续使用每张照片原有的说明。组合会替代其成员在电脑端的单图轮播，避免重复；全部小图准备好后才淡入显示。
- 给组合设置 `enabled: false`，或删除该组合，即可恢复其中适合电脑的单图逐张显示。若某个成员缺失、被禁用或仅手机显示，该组合失效，其余符合条件的单图仍可显示。组合 `id` 不要重复，同一张照片只加入一组。

不会生成额外的拼接图片文件；替换原照片后，组合里的对应小图也会更新。

### 公式与研究历程的样式

研究公式与研究历程箭头使用同一套动态渐变。在 `assets/css/profile.css` 顶部的 `--research-gradient` 和 `--research-gradient-duration` 中统一调整颜色与 `18s` 周期。圆润的箭头形状在 `assets/icons/trajectory-arrowhead.svg` 中定义；大小、线身粗细与尾部淡入由 `.trajectory-track::after` 中的遮罩控制。箭头头部在手机端也保持原有比例。系统开启“减少动态效果”时自动显示静态渐变。

每个项目先显示标题，电脑上标题下方左图右文，图片上沿与介绍对齐；手机上依次为“标题 → 图片/GIF → 介绍和链接”。图片保持原有比例、高度自适应，不额外添加边框、背景或补边。项目、论文及经历条目通过间距区分，不使用分隔横线。

如需隐藏原图外围留白，可在 `_data/research.yml` 中设置 `image_size: [原图宽, 原图高]` 与 `image_crop: [x, y, 宽, 高]`，单位均为原图像素，原文件保持不变。例如 DriveLLM 分别使用 `[1283, 1049]` 和 `[19, 0, 1245, 1019]`。浏览器按裁切区域的比例显示，高度自适应、不拉伸。换图后应同步更新这两个字段，或删除 `image_crop` 以显示完整图片。只裁外围留白，不裁文字标注、图例或图表背景。

项目图片的署名与许可信息保存在 `image_credit/image_credit_zh`、`image_source_url`、`image_license` 和 `image_license_url` 中，可参考 CoInfra 条目。页面不单独显示署名段落：配置 `image_source_url` 后，点击图片可打开来源页，悬停提示显示署名与许可；未配置时打开图片文件本身。替换图片时保留来源注释及许可元数据。

### 标签页图标（favicon）

JZ 标识的可编辑源文件是 [images/favicon.svg](../images/favicon.svg)。如需重新设计，请同时更新 `images/` 下的配套文件：`favicon.ico`、`favicon-16x16.png`、`favicon-32x32.png`、`apple-touch-icon.png`（180 × 180）、`android-chrome-192x192.png` 和 `android-chrome-512x512.png`。修改 SVG 后，PNG/ICO 文件不会自动重新生成。

替换图标后，同步更新 [_includes/head/custom.html](../_includes/head/custom.html) 和 [images/site.webmanifest](../images/site.webmanifest) 中的版本后缀（当前为 `?v=jz-1`），让浏览器重新加载新图标。

## 4. 修改论文

在 `_data/publications.json` 中，复制某个分组的 `items` 内已有论文，再修改：

| 字段 | 填写内容 |
| --- | --- |
| `title` / `title_zh` | 原始论文题目 / 便于阅读的中文译题 |
| `authors` | 按论文顺序填写完整作者列表，用英文逗号分隔；不用 HTML，不手动加符号或 `et al.` |
| `venue`、`year`、`url` | 原始期刊/会议信息、年份、论文链接；未被期刊或会议接收的预印本省略 `venue` |
| `type` | 单篇论文可选，覆盖分组的 `type`：`journal`、`conference`、`preprint` 或 `publication` |
| `selected` | `true` 显示；`false` 保留记录但隐藏 |
| `role` | `first` 第一作者 †；`co-first` 共同第一作者 *；`corresponding` 通讯作者 ‡；`coauthor` 合作者（无符号） |
| `co_first_authors` | 可选数组，填写该论文的**所有共同第一作者**，姓名须与 `authors` 中完全一致 |
| `project` | 可选的项目网址 |
| `arxiv` | 可选，须核实为同一篇论文的 arXiv 版本 |

每个分组统一设置 `type`：期刊论文用 `journal`，会议论文用 `conference`，预印本用 `preprint`，其他成果用 `publication`。单篇论文的 `type` 优先于分组设置；两处均未设置或最终取值无法识别时，按 `publication` 处理。题目始终链接到 `url`。非预印本的底部链接依次为**期刊 / 会议 / 论文**（复用 `url`）、可选的 **arXiv**、可选的**项目**；预印本省略第一个链接，仅按顺序显示已配置的 **arXiv** 和**项目**，建议填写 `arxiv`。正式发表后，将类型改为 `journal` 或 `conference`（或移入对应分组并删除单篇覆盖值），更新 `url`、`venue`，保留 `arxiv`。

系统自动加粗 `J. Zhong`，并为 `co_first_authors` 中的每位作者加上相同的共同第一作者符号。例如，`"co_first_authors": ["A. Researcher", "J. Zhong"]` 会同时标记这两位作者。JSON 中始终保留完整的 `authors` 列表。`_data/publication_roles.yml` 中默认设置 `abbreviate_after_author: false`，显示全部作者；如需省略，可改成 `true`，显示至 J. Zhong，并保留其后的共同第一作者，其余作者统一缩写为 `et al.`。

同一配置文件也控制加粗姓名、角色符号和双语图例。论文按文件顺序展示；JSON 使用双引号，最后一项后不要加逗号。

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

在 [Actions](https://github.com/jiamingZhong93/jiamingZhong93.github.io/actions) 确认 **pages build and deployment** 成功，再打开公开主页检查。部署及缓存更新可能需要几分钟。CSS 和 JavaScript 地址会自动带上构建版本，避免旧资源与新页面混用。如果手机仍显示旧页面，可用无痕标签页打开，或在主页网址末尾加上 `?refresh=1`。

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
