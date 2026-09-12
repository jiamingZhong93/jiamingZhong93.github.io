# Homepage maintenance

[Live homepage](https://jiamingzhong.world/) · [中文维护指南](docs/README-zh.md) · [Pages settings](https://github.com/jiamingZhong93/jiamingZhong93.github.io/settings/pages)

**Daily workflow:** preview locally → edit English and Chinese → check desktop and phone → commit and push → confirm deployment.

## 1. Start a local preview

Install **Node.js 20.19+ with npm**, then run from the repository folder:

| System | Start |
| --- | --- |
| Windows | Double-click `preview.cmd`, or run `.\preview.cmd` |
| Ubuntu | `bash preview.sh` |

Open the address printed in the terminal (normally `http://127.0.0.1:4000/`). The first launch installs dependencies online. Keep the terminal open: saved changes rebuild and refresh automatically. **Ctrl+C** stops the preview.

Saving locally does not publish. Edit source files, never generated `_site/` files. If preview stops updating, check the terminal for YAML/JSON errors. This preview supports the current homepage; new Jekyll pages/plugins may need a full Jekyll build.

## 2. Find the content to edit

| Content | File and fields |
| --- | --- |
| Opening sentence, biography, section labels | [_pages/about.md](_pages/about.md) |
| Default/alternate portrait and profile links | [_config.yml](_config.yml), under `author` |
| Bilingual profile titles and institutions | [_config.yml](_config.yml), `author.roles` |
| Home research vision and projects | [_data/research.yml](_data/research.yml), `vision` and `projects` |
| Publications and author-role symbols | [_data/publications.json](_data/publications.json), [_data/publication_roles.yml](_data/publication_roles.yml) |
| Teaching, experience and education | [_data/career.yml](_data/career.yml) |
| Navigation and project-link translations | [_data/navigation.yml](_data/navigation.yml), [_data/translations.yml](_data/translations.yml) |
| Cover photos, framing, bilingual titles and descriptions | [_data/background.yml](_data/background.yml) |
| Browser title and search description | [_includes/seo.html](_includes/seo.html); English description in [_config.yml](_config.yml) |
| Fonts, spacing, responsive layout | [assets/css/profile.css](assets/css/profile.css) |

Navigation labels, Chinese translations and section links live together in `_data/navigation.yml`. **Home** uses the same style as the other links. On phones, the sticky navigation shows the current section; tap it to choose another section from the dropdown.

Teaching entries live under `teaching` in `_data/career.yml` and use the same bilingual fields as Experience. They appear immediately before Experience.

### Maintain English and Chinese together

The selector changes language on the same page. Every reload starts in English; translations are maintained manually.

- **Data files:** update English fields and matching `_zh` fields together: `title/title_zh`, `description/description_zh`, `image_alt/image_alt_zh`. For the formula, also pair `learning/learning_zh` and `prior/prior_zh`.
- **Biography:** edit both `localized-copy` blocks (`lang="en"` and `lang="zh-CN"`) in `_pages/about.md`. The opening sentence and section labels use `data-zh="中文"`.
- **Profile roles:** edit the `author.roles` list in `_config.yml`. Each entry has `title/title_zh`, `institution/institution_zh` and `url`; list order controls display order. Both languages are maintained here.
- **Experience:** include start/end months in both `dates` and `dates_zh`, e.g. `Feb 2025 – Jun 2025` / `2025年2月 – 2025年6月`.
- **New project-link labels:** add the Chinese mapping under `links` in `_data/translations.yml`. Untranslated project fields/labels fall back to English.

Keep links and icons outside elements whose text is replaced by `data-zh`. Check both languages after each content update.

## 3. Update research, projects and pictures

The **Research vision at the end of Home** is in `_data/research.yml` under `vision`: edit the formula fields, `description/description_zh`, and the short `bullets` list. Each bullet has both languages:

```yaml
  bullets:
    - text: "One concise research direction."
      text_zh: "一句简短的研究方向。"
```

Copy an existing entry in `_data/research.yml` to add a project. Keep each `id` unique; the list order controls the display order. Delete an entry to remove it. Use a short description and maintain its Chinese fields.

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

Replace the example text and URL with your actual project. `image` is optional; `video_url` optionally adds a video link.

| Picture | How to change it |
| --- | --- |
| Default portrait | Replace `images/avatar.jpg`; if renamed, update `author.avatar` in `_config.yml`. |
| Alternate portrait | Replace `images/portraits/alternate.jpg`; if renamed, update `author.avatar_alternate`. |
| Project image | Put it in `images/research/` and set the project's `image` path. JPG, PNG, animated GIF, WebP and SVG work; images keep their proportions. |
| Top cover | Put photos in `images/background/` and add matching filenames under `images` in `_data/background.yml`. Only configured photos join the carousel. |

### Portraits

In `_config.yml`, keep these settings under `author`:

```yaml
  avatar: "/images/avatar.jpg"
  avatar_position: "50% 50%"
  avatar_alternate: "/images/portraits/alternate.jpg"
  avatar_alternate_position: "50% 50%"
  avatar_alternate_alt: "A short description of the alternate photo"
  avatar_alternate_alt_zh: "备用照片的简短中文说明"
```

Position values set the horizontal and vertical crop. Every refresh starts with the default portrait, which also remains the search/social sharing image. Entering the portrait with a mouse or clicking it toggles the photo; on touch screens, each tap toggles it. An absent or broken alternate image disables switching and keeps the default. Remove `avatar_alternate` to disable this feature.

Portrait sizes are set in `assets/css/profile.css`: 208 × 236 px on desktop (198 × 224 px at widths up to 1050 px). On phones, width is 96–112 px and height follows the adjacent role text, capped at 140 px. Adjust the CSS to resize; use the position settings above to reframe.

Portraits turn with a gentle 3D flip; another tap/click during the animation smoothly reverses it. The hit area stays fixed. Systems with reduced motion enabled switch immediately. Adjust the `720ms` duration and easing in `.portrait-flipper` in `assets/css/profile.css` if desired.

The default photo is an outdoor portrait; the alternate is a formal portrait. Both image URLs receive a build version so replacements refresh with the page. Update both descriptions when changing photos.

### Cover photos

Phones show individual photos. On desktop (over 800 px wide), related robot and vehicle photos form horizontal groups of 3–4, while landscapes remain single photos. Refresh selects a random photo or group; each stays for 3 seconds and crossfades over 1 second. Clicking also advances, and consecutive selections differ. Changing language retains the current and next selection. Crossing the 800 px breakpoint maps a grouped photo to its desktop group, or a group to its first available phone photo; ungrouped photos stay in place. Framing happens in the browser without changing the files. Full portraits can still use a softly blurred backdrop.

Hover **anywhere on the photo** to show both the current-photo details and the next-photo preview. There are no corner icons. Click the photo outside those details to advance; the captions stay open while the pointer remains over the banner. Moving away closes them.

On touch screens, **long press for about half a second** to show both captions and keep them open for reading. Releasing that long press does not change the photo. Tap outside the captions to advance and close them; a normal short tap also advances. Scrolling, dragging and pinch gestures do not advance the photo. Caption text never triggers a switch. Titles and descriptions are plain text, without links.

The timer pauses while hovering anywhere over the banner, during a touch gesture or while its details remain open, and while the banner/details have keyboard focus. It also pauses when the page or banner is out of view, then resumes the remaining time. Every completed transition starts a fresh hold interval. **Tab** focuses the banner and shows details; **Enter/Space** advances; **Esc** closes details. One available photo stays visible with only its current details and no timer; failed images are skipped.

To add a photo:

1. Save a web-ready JPG, PNG or WebP in `images/background/`, using a unique name such as `photo_2026_waterloo.jpg`. Convert HEIC to JPG first; preserve the correct orientation. For large originals, an exported copy with a long edge around 2400 px keeps downloads light. Keep full-size originals outside this public directory.
2. Add that exact filename under the existing `images` block in `_data/background.yml`, with English and Chinese text. **Files without a matching entry are not displayed.**
3. Check both desktop and phone framing. To remove a photo, delete its entry and the corresponding file; use `enabled: false` to hide it temporarily.

Filenames **can start with numbers**; the `photo_` prefix is just a consistent naming convention. Names are case-sensitive online, and each filename key must occur only once in YAML. Duplicate keys cause a configuration error.

Example entry under `images`:

```yaml
  photo_2026_waterloo.jpg:
    fit: "cover"
    mobile_fit: "contain"
    position: "50% 50%"
    mobile_position: "60% 50%"
    title: "A short photo title"
    title_zh: "简短的照片标题"
    description: "One brief description of the photo."
    description_zh: "一句简短的照片说明。"
```

- `fit` / `mobile_fit`: `cover` fills the banner and crops its edges; `contain` shows the entire photo over a blurred version of the same image. Use `contain` when a face, robot or group would otherwise be cut off. Desktop defaults to `cover`; omitted `mobile_fit` follows `fit`. The phone layout applies at widths up to 800 px.
- `position` / `mobile_position`: horizontal %, then vertical %, e.g. `"50% 35%"`. In `cover` mode, increase the second number to show more of the lower part, or decrease it to show more of the top. The effect depends on the photo's proportions. In `contain` mode, position aligns the whole photo inside the banner. A missing mobile position follows the image's desktop position; otherwise the file's global defaults apply.
- **Left:** `title/title_zh` first, then smaller `description/description_zh` text, limited to two lines. **Right:** “Next”, then only the next photo's title. Both sides align at the bottom; the left gets most of the width on every device. Keep titles brief for phones.
- Missing Chinese fields fall back to English. Legacy `caption/caption_zh` still work as title fields; an absent title uses the filename. Descriptions are optional.
- `source` and `credit/credit_zh` keep attribution records in the data file; captions do not contain links. Include any visible photo credit in the description, as in the SafeTrucks example.
- Per-image `enabled: false` keeps a file out of the selection. Top-level `enabled: false` hides the entire cover. `height` sets the desktop base height (220 px). Extra-wide screens scale it gently up to 360 px to preserve subjects; `mobile_height` stays at 150 px. The wide-screen scaling is in `.home-background` in `assets/css/profile.css`.
- Top-level `fade_duration: 1000` sets the crossfade duration in milliseconds; `interval: 3000` sets the hold time **after the transition finishes**. Photos, timing and bilingual details all use this one configuration file.
- Use `crop` (x, y, width, height in source pixels) with `source_size: [width, height]` to trim empty borders without editing the file. `fit` / `mobile_fit` then frame that crop: `contain` preserves it completely; `cover` fills the banner. Cropped frames are centered, so adjust `crop` rather than `position` to move the subject. See the F1Tenth entry. Update or remove both fields when replacing the source photo.

**Edit a desktop photo group:** find `desktop_groups` at the end of `_data/background.yml`. Each group has a unique `id`, bilingual `title` and `description`, and a `photos` list in left-to-right order. Tiles join edge to edge, with no gaps or individual rounded corners.

- Each tile's `file` must also exist and be enabled under `images`. Keep its individual captions and mobile framing there. When renaming or deleting a grouped file, update both places.
- Tile `position` controls its desktop crop independently of the single photo. `weight` controls relative width (default `1`); `fit: "contain"` preserves a full subject within its tile. Other tiles default to `cover`.
- A group's captions describe the complete strip; phones use the original individual captions. The group replaces its members in desktop rotation, so those images do not also repeat as desktop singles. Every tile loads before the strip crossfades in.
- Set a group's `enabled: false`, or remove the group entry, to restore its single photos on desktop. Missing or disabled members invalidate the group and leave the remaining singles available. Keep group IDs unique and use each photo in only one group.

No stitched image file is created: replacing the original photo updates its tile automatically.

The entire research formula shares one animated gradient. Change its colors and `18s` duration in `.vision-equation` / `@keyframes vision-colors` in `assets/css/profile.css`. Reduced-motion preferences automatically show a static gradient.

Project titles precede their images and descriptions. Desktop uses an image on the left and text/links on the right below each title; phones stack title → image/GIF → description/links. Project, publication and career entries use spacing instead of separator lines.

Keep public image-source URLs in comments beside the relevant project. The SafeTrucks entry records the source of its snow-driving photo.

## 4. Update publications

In `_data/publications.json`, copy an existing paper inside a group's `items` array and edit its fields:

| Field | What to enter |
| --- | --- |
| `title` / `title_zh` | Original paper title / Chinese reading translation |
| `authors` | Plain text in paper order, separated by English commas; no HTML or symbols |
| `venue`, `year`, `url` | Original venue, year, and paper link |
| `selected` | `true` to display; `false` to hide while retaining the record |
| `role` | `first` (†), `co-first` (*), `corresponding` (‡), or `coauthor` (no symbol) |
| `project` | Optional project URL |

The template automatically highlights the exact author name `J. Zhong` and adds the role symbol. Change the name, symbols or bilingual legend once in `_data/publication_roles.yml`. Papers display in file order. JSON requires double quotes and no trailing comma after the final entry.

## 5. Publish changes

**While Pages publishes from `main`, pushing to `main` or committing through GitHub's website updates the public homepage automatically.**

After checking both languages and a phone-size preview, commit the files you changed. Adjust the paths in this example:

```bash
git status --short
git diff
git add _data/research.yml images/research
git diff --cached
git commit -m "Update research projects"
git push origin main
```

Check [Actions](https://github.com/jiamingZhong93/jiamingZhong93.github.io/actions) for a successful **pages build and deployment**, then open the live homepage. Deployment and caching can take a few minutes. CSS and JavaScript URLs automatically receive a build version to avoid mixing old assets with new HTML. If a phone still shows an older page, reopen it in a private tab or add `?refresh=1` to the homepage URL.

For small edits, use GitHub's **pencil → Commit changes**; for pictures, **Add file → Upload files**. Before your next local edit, bring those changes down with `git pull --ff-only origin main` when the local working tree is clean.

## 6. Take offline or restore

In [Settings → Pages](https://github.com/jiamingZhong93/jiamingZhong93.github.io/settings/pages):

| Action | Steps |
| --- | --- |
| Take offline | First set **Source → GitHub Actions** to stop automatic branch publishing. Then use **⋯ → Unpublish site** beside the live-site information. Changing Source alone does not remove the live site. |
| Restore | Set **Source → Deploy from a branch**, choose **main**, **/ (root)**, and **Save** when enabled. Push a content update if no deployment starts. |

If restoring needs a build but there is no content change:

```bash
git commit --allow-empty -m "Trigger GitHub Pages publication"
git push origin main
```

The pause method assumes there is no custom Pages deployment workflow in `.github/workflows/`, as in this repository today. Local preview works while the public site is offline.

Built on [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) / [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes). [License](LICENSE).
