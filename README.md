# Jiaming Zhong

Personal academic homepage for research in trustworthy Physical AI, with English and Chinese content. Built with Jekyll and published through GitHub Pages.

[Live homepage](https://jiamingzhong.world/) · [English maintenance guide](docs/maintenance-en.md) · [中文维护指南](docs/README-zh.md)

## Everyday workflow

1. **Preview locally:** install Node.js 20.19+ with npm, then run `preview.cmd` on Windows or `bash preview.sh` on Ubuntu. Open the address printed in the terminal, normally [localhost:4000](http://127.0.0.1:4000/). Saving files refreshes the preview.
2. **Edit both languages:** most content lives in [_data/](_data/); the biography is in [_pages/about.md](_pages/about.md), and profile settings are in [_config.yml](_config.yml). Images live in [images/](images/). Edit source files rather than generated `_site/` files.
3. **Check:** review English and Chinese on desktop and a phone-size screen.
4. **Publish:** commit the changed files and push to `main`. Confirm a successful deployment in [GitHub Actions](https://github.com/jiamingZhong93/jiamingZhong93.github.io/actions), then check the live homepage. Local saves alone do not publish.

If you edited on another computer or through GitHub, sync a clean working tree with `git pull --ff-only origin main` before starting.

## Detailed maintenance

The [English guide](docs/maintenance-en.md) and [中文指南](docs/README-zh.md) cover:

- Bilingual text, research questions, trajectory, projects and publications.
- Portraits, background photos, cropping, captions and the JZ browser icon.
- Local preview, publishing, and temporarily taking the site offline.

Built on [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io) / [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes). [License](LICENSE).
