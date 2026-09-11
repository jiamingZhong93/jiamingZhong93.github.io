# Jiaming Zhong — Academic Homepage

Source code for Jiaming Zhong's academic homepage, built with Jekyll and the AcadHomepage theme.

## Local preview

Requires **Node.js 20.19+ and npm**. The first launch installs the project's dependencies and needs an internet connection.

Run from the repository folder:

| System | Command |
| --- | --- |
| Windows | `.\preview.cmd` (or double-click `preview.cmd`) |
| Ubuntu | `bash preview.sh` |

Open the local address printed in the terminal. Saving content or style changes automatically rebuilds and refreshes the page. Press **Ctrl+C** to stop.

The preview runs only on your computer and does not publish the website. It renders the current homepage; Jekyll plugins and additional pages require a full Jekyll build.

## Edit content

| File | Content |
| --- | --- |
| `_pages/about.md` | Biography, research, experience, education and service |
| `_data/publications.json` | Publications and manuscripts |
| `_data/scholar.yml` | Citation statistics and their update date |
| `_config.yml` | Profile information and site settings |
| `assets/css/profile.css` | Layout and appearance |

## Publish or unpublish

Open **Settings → Pages** in this GitHub repository.

- **Publish:** push reviewed changes to `main`, then select **Deploy from a branch → main → / (root)** and click **Save**. While Pages is enabled, later pushes to `main` update the public website.
- **Unpublish:** set **Source → GitHub Actions**, then open the menu next to the live site URL and choose **Unpublish site**. This repository has no Pages deployment workflow, so later pushes to `main` will not republish it. Keep it offline by leaving that source selected and not adding a Pages deployment workflow. Cached pages may remain visible for a few minutes.

Editing or previewing files locally does not update the public website.

## Credits

Based on [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) and [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes). See [LICENSE](LICENSE).
