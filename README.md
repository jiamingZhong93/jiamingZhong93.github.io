# Jiaming Zhong — Academic Homepage

Research on learning, control, and mobile autonomy. Built with Jekyll and AcadHomepage.

[中文维护指南](docs/README-zh.md) · [Repository](https://github.com/jiamingZhong93/jiamingZhong93.github.io)

## Local preview

Install **Node.js 20.19+ with npm**, then run from the repository folder:

| System | Command |
| --- | --- |
| Windows | `.\preview.cmd` (or double-click `preview.cmd`) |
| Ubuntu | `bash preview.sh` |

Open the local address printed in the terminal. The first launch installs dependencies and needs internet access. Keep the terminal open; **save a file to rebuild and refresh the preview automatically**. Press **Ctrl+C** to stop.

Local changes need no commit, push, or GitHub deployment to appear in the preview. If a tab stops refreshing, check the terminal for a YAML/JSON error, fix it, and save again. After changing dependencies, restart the launcher; it runs `npm ci` when the lockfile changes.

The lightweight preview renders this homepage. Additional Jekyll pages or plugins may require a full Jekyll build. Generated `_site/` files are disposable: edit the source files below.

## Where to edit

| File or folder | What it controls |
| --- | --- |
| [`_pages/about.md`](_pages/about.md) | Introduction, section headings, and page structure |
| [`_config.yml`](_config.yml) | Name, portrait, role, affiliations, location, and profile links under `author` |
| [`_data/research.yml`](_data/research.yml) | Research vision and project titles, descriptions, images, and links |
| [`_data/ongoing.yml`](_data/ongoing.yml) | Ongoing research, including F1TENTH and XLeRobot |
| [`_data/publications.json`](_data/publications.json) | Publication records and which appear in Selected publications |
| [`_data/career.yml`](_data/career.yml) | Compact experience and education entries |
| [`_data/navigation.yml`](_data/navigation.yml) | Top navigation labels and section anchors |
| [`images/research/`](images/research/) | Project photos and figures |
| [`assets/css/profile.css`](assets/css/profile.css) | Layout, colors, typography, and responsive styles |
| [`images/site.webmanifest`](images/site.webmanifest) and favicon files | Browser/site icons; these do not change the portrait |

### Replace the portrait

1. Replace `images/avatar.jpg` with your square photo (roughly 600 × 600 pixels is sufficient). The current portrait is stored here.
2. In `_config.yml`, change the existing `author.avatar` value:

```yaml
author:
  avatar: "/images/avatar.jpg"
```

Keep the other `author` fields; do not replace the whole section. An external HTTPS image URL also works. Save and check the preview. For a new filename or format, update `avatar` to match it exactly.

Change the role with `author.bio`, workplace with `employer` / `employer_url`, and university with `education` / `education_url`. Google Scholar remains a simple profile link.

### Update projects and media

In `_data/research.yml`, `vision` controls the displayed research formula and explanation; `projects` holds the project list in display order. In `_data/ongoing.yml`, edit the list of current projects.

Each project has a title, short description, and links. Research entries use `context` for the affiliation or period; ongoing entries use `focus` for the research topic. Keep each `id` unique.

To replace a figure, overwrite the corresponding file in `images/research/` using the **same filename**. To use a different file, update that entry:

```yaml
image: "/images/research/my-project.jpg"
image_alt: "Test vehicle following a planned path on a wet track"
video_url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
links:
  - label: "Paper"
    url: "https://doi.org/YOUR_DOI"
```

This is a field example to add within an existing entry. Replace the example URLs with real links or omit unused fields. `video_url` adds a demo link and is optional. JPG, PNG, and SVG are supported; use an image around 1200 pixels wide and describe its content in `image_alt`.

The current project images come from the supplied research statement. Replace them with updated experiment photos or figures as the work develops.

| Image in `images/research/` | Displayed project |
| --- | --- |
| `drivellm.jpg` | DriveLLM |
| `multi-agent.jpg` | Multi-agent collaboration |
| `learning-mpc.jpg` | Learning-based MPC |
| `f1tenth.jpg` | F1TENTH |
| `xlerobot.jpg` | XLeRobot |

### Update selected publications

`_data/publications.json` is an array of groups, each with a `title` and an `items` array. Add a paper inside the appropriate group's `items`. A complete minimal example:

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

Use `selected: true` only for published papers where the author role is `first`, `co-first`, or `corresponding`, confirmed by the paper. Set other records to `selected: false` to retain them without displaying them. Use JSON booleans `true` / `false`, double quotes, and no trailing commas.

## Save code to GitHub

**Updating repository files and publishing the website are separate actions.**

For local edits, review and commit only the files you changed. For example:

```bash
git status --short
git diff
git add _pages/about.md _data/research.yml images/research
git diff --cached
git commit -m "Update research projects"
git push origin main
```

Adjust the paths after `git add` for your change, including a new portrait if applicable.

For a small edit directly on GitHub, open a file and click the **pencil → Commit changes**. For images, open the destination folder and use **Add file → Upload files → Commit changes**. These edits update GitHub only. After committing any local work, bring them into your local copy with:

```bash
git pull --ff-only origin main
```

The running local preview then picks up the updated source files.

## Manually publish or take offline

Open this repository's [Settings → Pages](https://github.com/jiamingZhong93/jiamingZhong93.github.io/settings/pages). **Source** is the dropdown under **Build and deployment**.

| Action | Steps |
| --- | --- |
| Publish | Set **Source → Deploy from a branch**, choose **main** and **/ (root)**, then **Save**. If republishing does not start a build, commit and push a content update to `main`. Check the **Actions** tab for completion. |
| Take offline | Set **Source → GitHub Actions** first. Then, next to **Your site is live at**, click **⋯ → Unpublish site**. |

**This repository has no Pages deployment workflow. With Source set to GitHub Actions, ordinary pushes do not deploy the homepage.** Keep that setting and do not add a Pages deployment workflow if you want to stay offline. Other Actions activity does not necessarily mean the website was deployed.

Changing Source alone leaves an existing site online; **Unpublish site** removes the live deployment. Conversely, while publishing from `main`, later pushes update the public website automatically. Allow a few minutes for deployment and caching. Local preview works in either state.

See GitHub's [publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [unpublishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site).

## Credits

Based on [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) and [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes). See [LICENSE](LICENSE).
