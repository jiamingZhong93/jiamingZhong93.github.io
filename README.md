# Homepage maintenance

[Live homepage](https://jiamingzhong93.github.io/) · [中文维护指南](docs/README-zh.md) · [Pages settings](https://github.com/jiamingZhong93/jiamingZhong93.github.io/settings/pages)

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
| Portrait, English role/affiliations, profile links | [_config.yml](_config.yml), under `author` |
| Chinese sidebar role/affiliations | [_includes/author-profile.html](_includes/author-profile.html), `data-zh` |
| Research formula and projects | [_data/research.yml](_data/research.yml), `vision` and `projects` |
| Publications and author-role symbols | [_data/publications.json](_data/publications.json), [_data/publication_roles.yml](_data/publication_roles.yml) |
| Experience and education | [_data/career.yml](_data/career.yml) |
| Navigation and project-link translations | [_data/navigation.yml](_data/navigation.yml), [_data/translations.yml](_data/translations.yml) |
| Cover photos, framing and bilingual captions | [_data/background.yml](_data/background.yml) |
| Browser title and search description | [_includes/seo.html](_includes/seo.html); English description in [_config.yml](_config.yml) |
| Fonts, spacing, responsive layout | [assets/css/profile.css](assets/css/profile.css) |

### Maintain English and Chinese together

The selector changes language on the same page. Every reload starts in English; translations are maintained manually.

- **Data files:** update English fields and matching `_zh` fields together: `title/title_zh`, `description/description_zh`, `image_alt/image_alt_zh`. For the formula, also pair `learning/learning_zh` and `prior/prior_zh`.
- **Biography:** edit both `localized-copy` blocks (`lang="en"` and `lang="zh-CN"`) in `_pages/about.md`. The opening sentence and section labels use `data-zh="中文"`.
- **Sidebar:** English role/affiliations are in `_config.yml`; their Chinese text is in `_includes/author-profile.html`.
- **Experience:** include start/end months in both `dates` and `dates_zh`, e.g. `Feb 2025 – Jun 2025` / `2025年2月 – 2025年6月`.
- **New project-link labels:** add the Chinese mapping under `links` in `_data/translations.yml`. Untranslated project fields/labels fall back to English.

Keep links and icons outside elements whose text is replaced by `data-zh`. Check both languages after each content update.

## 3. Update projects and pictures

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
| Portrait | Replace `images/avatar.jpg`; if renamed, update `author.avatar` in `_config.yml`. |
| Project image | Put it in `images/research/` and set the project's `image` path. JPG, PNG, animated GIF, WebP and SVG work; images keep their proportions. |
| Top cover | Add/remove photos directly in `images/background/`. All supported images automatically join the random pool; no file list to maintain. |

The cover shows one wide scene plus two detail photos on desktop (50% / 25% / 25%), and two equal photos on phones. Every refresh shuffles eligible photos; resizing and changing language retain that order. Choose clear, standalone photographs rather than diagrams or collages. Original files are preserved: all framing happens in the browser.

New files join automatically. Optional settings live under `images → filename` in `_data/background.yml`:

```yaml
  my-photo.jpg:
    role: both
    position: "50% 50%"
    mobile_position: "60% 50%"
    caption: "A short, factual photo description"
    caption_zh: "简短、客观的照片说明"
```

- `role`: `main` for wide scenes, `detail` for close-ups, or `both` (default). With fewer photos, the available images fill the space without duplicates.
- `position` / `mobile_position`: horizontal %, then vertical %. Values fall back to the settings at the top of the file.
- `caption` / `caption_zh`: optional photo details, shown on hover, keyboard focus or by tapping **i**. Add `credit` / `credit_zh` and `source` for an external photo credit and source-page link. Missing Chinese text falls back to English.
- Per-image `enabled: false` keeps a file out of the selection. Top-level `enabled: false` hides the entire cover. `height` / `mobile_height` control its height.
- The existing F1TENTH and XLeRobot examples use `crop` (x, y, width, height in source pixels) and `source_size` to show only the photographic part of a composite. **Remove both fields when replacing either file with a standalone photo**; ordinary photos do not need them.

The formula's animated gradient applies only to the research goal. Change its colors and `18s` duration in `.vision-title` / `@keyframes vision-colors` in `assets/css/profile.css`. Reduced-motion preferences automatically show a static gradient.

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

Check [Actions](https://github.com/jiamingZhong93/jiamingZhong93.github.io/actions) for a successful **pages build and deployment**, then open the live homepage. Deployment and caching can take a few minutes.

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
