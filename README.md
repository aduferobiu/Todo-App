# Todo App with AI

A small, client-side Todo app built for a classwork project. It uses plain HTML, CSS and JavaScript and includes a stylized "sticky note" UI for tasks.

## What this is
- Simple todo list with add, edit, complete, and delete actions (client-side only).
- Modern minimal UI with a sticky-note style for tasks (CSS-only visuals).
- No build tools required — open `index.html` in your browser to run.

## Files
- `index.html` — main page
- `CSS/Style.css` — styling (includes the sticky-note styles). Note: recent change removed random rotation so tasks display upright.
- `Js/main.js` — JavaScript logic for adding/editing/completing tasks

## How to run
1. Open `index.html` in your web browser (double-click or use your browser's "Open File" option).
2. Or serve the folder with a simple HTTP server (recommended for consistent behavior):

```bash
# with Python 3
python3 -m http.server 8000
# then visit http://localhost:8000 in your browser
```

## Notes
- Styling: The sticky note style is implemented in `CSS/Style.css`. If you prefer the previous playful tilt, look for the `.task:nth-child(...)` rules (they were removed to keep tasks aligned).
- Accessibility: Consider adding keyboard shortcuts and proper ARIA attributes for better accessibility.

## Contributing
This is a small class project. Feel free to open an issue or submit changes by editing files and sending patches.

## License
MIT License — use and modify freely.
