# Contributing to DiffView

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/yourusername/DiffView.git
cd DiffView
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript 5**
- **Tailwind CSS v4**
- **Zustand** (state management)
- **diff** (text diffing engine)
- **Framer Motion** (animations)
- **Lucide React** (icons)

## Project Structure

```
src/
├── app/             # Next.js app router pages
├── components/      # UI components
│   ├── DiffApp      # Main app container
│   ├── TextInput    # Original/Modified text input panels
│   ├── SideBySideDiff # Side-by-side diff view with word-level highlighting
│   ├── InlineDiff   # Unified/inline diff view
│   ├── DiffStats    # Added/removed/changed line counts
│   └── Header       # Theme toggle, view mode, actions
├── lib/             # Diff utilities (line diff, word diff, stats, sharing)
└── store/           # Zustand store (diff-store)
```

## Guidelines

### Code Style
- TypeScript strict mode — no `any` types
- Functional components with hooks
- Memoize diff computations with `useMemo` — they can be expensive
- Tailwind CSS for all styling
- Support both dark and light themes in all components

### Commits
- Clear, descriptive commit messages
- One feature/fix per commit
- Run `npm run build` before pushing

### Adding Features
1. Fork and create a feature branch
2. Diff logic goes in `src/lib/diff-utils.ts`
3. UI components in `src/components/`
4. Store updates in `src/store/diff-store.ts`
5. Test with various text sizes and diff scenarios

### Key Design Decisions
- Uses the `diff` npm package for diffing
- Side-by-side view pairs removed/added lines together
- Word-level diff highlights specific changed words within modified lines
- 100% client-side — no server processing

## Areas for Contribution

- Character-level diff mode
- Diff navigation (jump to next/prev change)
- Merge tool (pick left or right for each change)
- File comparison via drag & drop
- Git diff import (parse unified diff format)
- Performance optimization for very large files

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
