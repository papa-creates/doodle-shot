# Project Codex Instructions

## Project Truth

This file overrides assumptions.

Before making changes, inspect the repository and infer the actual stack from the code.

Do not assume React, Next.js, Astro, Flutter, Rails, Svelte, Shopify, or any other stack unless the repo proves it.

## Current Project Stack

- Language: TypeScript, Svelte
- Framework: SvelteKit, Vite, adapter-static
- Package manager: npm (package-lock.json)
- Build command: npm run build (vite build)
- Dev command: npm run dev (vite dev)
- Test command: not configured in repo; npm run check for Svelte/type check
- Deploy target: static build and/or Vercel (vercel.json)
- Database: none
- Styling: Svelte component styles/CSS
- Important directories: src/routes, src/lib, static, build

## Project Priorities

1. Keep the app working.
2. Keep changes small.
3. Improve clarity before adding features.
4. Avoid unnecessary dependencies.
5. Prefer boring, stable solutions.
6. Protect production data and credentials.

## Required Workflow

For every task:

1. Read this file.
2. Check `git status`.
3. Inspect the relevant files before proposing changes.
4. Explain the plan briefly.
5. Make the smallest useful change.
6. Run the relevant check.
7. Summarize the diff and risks.

## Forbidden Without Approval

Do not do these without explicit approval:

- Change framework
- Add a major dependency
- Change deployment target
- Change database schema
- Change authentication
- Change payment logic
- Rewrite large files
- Delete major functionality
- Rename public routes
- Change environment variable names
- Touch production credentials

## Output Format After Work

Use this format:

### Changed
- ...

### Tested
- ...

### Risks
- ...

### Next
- ...
