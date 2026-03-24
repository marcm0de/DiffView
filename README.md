# DiffView

A visual text and code diff tool built with Next.js. Paste two texts side by side and instantly see differences highlighted with GitHub-style colors.

![DiffView](https://img.shields.io/badge/DiffView-v0.1.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Side-by-side diff** — See original and modified text in parallel columns
- **Inline/unified diff** — Toggle to a single-column unified view
- **Word-level highlighting** — Changed words within lines are highlighted, not just whole lines
- **Line numbers** — Both sides display line numbers for easy reference
- **Statistics** — See counts of added, removed, changed, and unchanged lines
- **Swap sides** — Quickly swap original and modified text
- **Copy as unified patch** — Export the diff in standard unified patch format
- **Share via URL** — Generate a shareable URL with your diff encoded in base64
- **File upload** — Drag & drop or click to upload `.txt`, `.md`, `.js`, `.ts`, `.py`, and many more
- **Dark/light mode** — Toggle between dark and light themes
- **Clear/reset** — One-click reset for both panels
- **100% client-side** — No data leaves your browser

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/DiffView.git
cd DiffView

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start comparing text.

## Tech Stack

- [Next.js](https://nextjs.org/) — React framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [diff](https://www.npmjs.com/package/diff) — Text diffing engine
- [Lucide React](https://lucide.dev/) — Icons
- [Framer Motion](https://www.framer.com/motion/) — Animations

## How It Works

1. Paste or upload text into both the **Original** (left) and **Modified** (right) panels
2. The diff view updates instantly below the input panels
3. Toggle between **Side by Side** and **Inline** views
4. Use the toolbar to swap sides, copy the unified patch, share via URL, or toggle theme

## License

[MIT](LICENSE)
