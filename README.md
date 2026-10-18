# 3D Portfolio Website

A modern, animated 3D portfolio built with plain HTML, CSS and JavaScript plus [Three.js](https://threejs.org/). No build tools, no installs. It runs on GitHub Pages as it is.

## Files

- `index.html` - page content (your name, about, skills, projects, contact)
- `style.css` - design and layout
- `script.js` - 3D scene, typing effect, scroll animations

## 1. Make it yours

Open `index.html` and replace:

- the About paragraph and facts
- the AiCodeGaurd card's GitHub link (it points to your profile for now; use the repo URL once it exists) and add a Live demo link when ready
- to add more projects, copy the `<article class="glass project tilt">` block

In `script.js`, edit the `ROLES` list at the top for the typing effect.
Colors live at the top of `style.css` under `:root`.

## 2. Test locally

Because the page uses ES modules, open it through a local server instead of double-clicking the file:

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

Or use the **Live Server** extension in VS Code.

## 3. Publish on GitHub Pages

1. Create a new repository on GitHub. For a personal site, name it `itsmekashif295-dotcom.github.io`.
2. Upload these files (or push with git):
   ```bash
   git init
   git add .
   git commit -m "Add 3D portfolio"
   git branch -M main
   git remote add origin https://github.com/itsmekashif295-dotcom/itsmekashif295-dotcom.github.io.git
   git push -u origin main
   ```
3. On GitHub open **Settings -> Pages**, set **Source** to `Deploy from a branch`, choose `main` and `/ (root)`, then Save.
4. After a minute your site is live at `https://itsmekashif295-dotcom.github.io`.

## Tips

- Add a profile photo and a CV: put `cv.pdf` in the repo and link it from the hero buttons.
- Replace the gradient project thumbnails with screenshots (`<img>` inside `.thumb`).
- Keep project descriptions short and focused on what you built and what you used.
