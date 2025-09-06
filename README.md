# Kanban App

A tiny Kanban board built with native Web Components and TypeScript. Drag cards between columns, edit details, and your data stays in your browser (localStorage). UI available in English and Spanish.

## Quick Start

- Requirements: Node 18+ and `pnpm`.
- Install deps: `pnpm install`
- Dev server: `pnpm dev` then open the shown URL (Vite default is http://localhost:5173)
- Build: `pnpm build`
- Preview build: `pnpm preview`
- Run tests: `pnpm test`

## Usage

- Add a card in any column (To‑Do, Doing, Done).
- Drag and drop to reorder or move between columns.
- Click Edit on a card to update title/description.
- Language can be switched from the header.
- Data is saved automatically in your browser. To reset, clear the `kanban-state` key in localStorage.

## Tech

- Vite, TypeScript, Web Components, Vitest, jsdom.

## Developer Note

Template strings include `/* HTML */` and `/* CSS */` for better highlight/prettier them.

## License

ISC
