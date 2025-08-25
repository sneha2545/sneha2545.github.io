# Sneha Gupta • 3D Portfolio

A modern, responsive, recruiter-friendly portfolio with:
- Three.js starfield and wave backgrounds
- GSAP + ScrollTrigger + Anime.js animations (typing, reveals)
- Glassmorphism cards, 3D flips, subtle hovers
- Dark/Light mode toggle

## Structure
- `index.html` — sections: Hero, About, Skills, Projects, Achievements, Contact
- `styles.css` — theme variables and responsive styles
- `main.js` — theme toggle, typing effect, GSAP scroll effects, Three.js scenes
- `assets/` — icons and images (replace with your own)

## Quick start
Open `index.html` in a browser. For best results and to avoid CORS issues with some setups, serve with a static server.

Windows PowerShell example (Node.js):

```powershell
# optional: install a simple server
npm i -g serve ; serve -l 5173 .
```

Then open http://localhost:5173/portfolio/

## Customize
- Replace `assets/profile.jpg` with your photo.
- Update resume link `assets/Sneha_Gupta_Resume.pdf`.
- Set your GitHub/LinkedIn/Email links in Contact.
- Replace project card links with your repo/demo URLs.
- Add more skills by copying a `.skill` item in `index.html`.

## Notes
- Animations respect `prefers-reduced-motion`.
- Three.js renderers are capped at devicePixelRatio 2 for performance.
- No form backend is wired; integrate Formspree/EmailJS or your API.
