# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a modern pnpm monorepo using Node.js v24's native TypeScript support (`--experimental-strip-types`), eliminating build steps during development. The stack includes React 19, tRPC v11, Tailwind CSS v4, and Vite.

## Architecture

### Workspace Structure

```
artemis/
├── apps/
│   ├── frontend/    # Vite + React 19 app with tRPC client
│   └── backend/     # Express + tRPC v11 server
├── packages/
│   ├── eslint-config/     # Shared ESLint configurations
│   ├── typescript-config/ # Shared TypeScript configurations
│   └── types/            # Shared TypeScript types and tRPC router types
```

### Key Architectural Decisions

1. **No Build Step**: All TypeScript files use `.ts` extensions in imports since Node v24 runs them directly
2. **Type Safety**: The `AppRouter` type is exported from backend and imported in frontend via the shared types package
3. **Direct Source Exports**: Packages export source files directly via `package.json` exports field
4. **Workspace Protocol**: Internal packages use `workspace:*` protocol for versioning

## Common Commands

```bash
# Install all dependencies
pnpm install

# Start all dev servers (frontend on :3000, backend on :4000)
pnpm dev

# Start specific app
pnpm dev:frontend
pnpm dev:backend

# Type checking across all packages
pnpm typecheck

# Linting
pnpm lint

# Clean all node_modules and artifacts
pnpm clean
```

## Development Workflow

### Backend Development

- Server runs with `node --watch src/index.ts`
- tRPC routers are in `apps/backend/src/routers/`
- Context is created in `apps/backend/src/trpc.ts`
- All imports must use `.ts` extensions

### Frontend Development

- Vite handles TypeScript/JSX transformation
- tRPC client setup in `apps/frontend/src/lib/trpc.ts`
- Tailwind CSS v4 integrated via `@tailwindcss/vite` plugin
- React 19 with TanStack Query for data fetching

### Adding New Packages

1. Create directory under `packages/` or `apps/`
2. Add `package.json` with proper exports
3. Reference from other packages using `workspace:*`

## Important Configuration Details

### TypeScript Configuration

- Base config in `packages/typescript-config/base.json`
- Uses `moduleResolution: "bundler"` and `allowImportingTsExtensions: true`
- React apps extend `packages/typescript-config/react.json`
- Node apps extend `packages/typescript-config/node.json`

### ESLint Setup

- Flat config format (ESLint v9)
- Base config: `packages/eslint-config/index.js`
- React config: `packages/eslint-config/react.js`

### pnpm Configuration (.npmrc)

- `auto-install-peers=true` - Automatically installs peer dependencies
- `dedupe-peer-dependents=true` - Deduplicates peer dependencies
- `node-linker=isolated` - Ensures proper TypeScript module resolution

## Critical Implementation Notes

1. **Import Extensions**: Always use `.ts` or `.tsx` extensions in imports for backend code
2. **Type Exports**: The `AppRouter` type flows from backend → types package → frontend
3. **No Build for Dev**: Development runs source TypeScript directly, only production needs builds
4. **Vite Proxy**: Frontend proxies `/trpc` requests to backend on port 4000

## Technology Versions

- Node.js: v24+
- TypeScript: 5.7.2+ (required by tRPC v11)
- React: v19
- tRPC: v11
- Tailwind CSS: v4
- pnpm: v9+
