# LaReserve — Frontend

A **Next.js 16** web application for managing a restaurant's floor plan. Staff can design seating layouts by placing and arranging tables and structural elements (walls, windows, doors) on an interactive canvas, then save the result for use in the reservation system.

## What it does

- **Floor plan editor** — drag-and-drop canvas powered by [Konva](https://konvajs.org/). Add round or rectangular tables and wall elements from the sidebar palette.
- **Selection & editing** — click an element to select it; press `Delete` to remove it; duplicate it from the sidebar panel.
- **Undo / Redo** — full history (up to 80 steps) managed in Redux.
- **Zoom** — zoom in/out via the bottom bar (25 % – 800 %).
- **Auto-save** — the floor plan is automatically persisted to `localStorage` after every change (debounced). A manual **Save** button is also available in the top bar.
- **Backend-ready** — `src/features/floorPlan/persistence/httpRepo.ts` contains a REST client stub that can be wired up once the API is available.

## Tech stack

| Layer | Library |
|-------|---------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| Canvas | react-konva / Konva |
| State | Redux Toolkit, React-Redux |
| Server state | TanStack React Query |
| Forms | React Hook Form + Zod |

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later (comes with Node.js)

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server (available at http://localhost:3000)
npm run dev
```

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack hot-reload |
| `npm run build` | Create an optimised production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run TypeScript type checking without emitting files |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Check formatting without writing files |

## Project structure

```
src/
├── app/                        # Next.js App Router (pages, layout, global CSS)
├── features/
│   └── floorPlan/
│       ├── lib/                # Utility hooks (view transform, element bounds)
│       ├── model/              # Redux slice, selectors, types, history logic
│       ├── persistence/        # localStorage repo & HTTP repo stub
│       └── ui/                 # Editor, canvas, sidebar, top/bottom bars
├── providers/                  # AppProviders (Redux store, localStorage hydration)
├── shared/
│   ├── lib/                    # Generic hooks (container size, CSS var colours)
│   └── ui/                     # Shared components (Button, IconButton, Panel, …)
└── store/                      # Redux store setup, root reducer, listener middleware
```
