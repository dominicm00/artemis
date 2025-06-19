# Artemis - Modern pnpm Monorepo

A modern TypeScript monorepo using pnpm workspaces with no build steps required for development.

## Tech Stack

- **Node.js v24** - Native TypeScript execution with `--experimental-strip-types`
- **pnpm** - Fast, disk space efficient package manager with workspace support
- **React v19** - Latest React with new features
- **TypeScript 5.7.2+** - Required by tRPC v11
- **tRPC v11** - End-to-end typesafe APIs
- **Tailwind CSS v4** - Utility-first CSS with Vite plugin
- **Vite** - Fast frontend tooling with HMR

## Project Structure

```
artemis/
├── apps/
│   ├── frontend/        # Vite + React 19 app
│   └── backend/         # Node.js + tRPC server
├── packages/
│   ├── config/          # Shared configurations
│   │   ├── typescript/  # TSConfig presets
│   │   └── eslint/      # ESLint configurations
│   └── types/           # Shared TypeScript types
```

## Features

- ✅ No build step for development (Node v24 runs TS directly)
- ✅ Type-safe API calls with tRPC
- ✅ Shared configurations across packages
- ✅ Hot Module Replacement with Vite
- ✅ WebSocket support for real-time features
- ✅ Modern React 19 with latest features
- ✅ Tailwind CSS v4 with Vite integration

## Getting Started

### Prerequisites

- Node.js v24 or higher
- pnpm v9 or higher

### Installation

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:4000

### Available Scripts

```bash
# Run all dev servers in parallel
pnpm dev

# Run specific app
pnpm dev:frontend
pnpm dev:backend

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Clean all node_modules and build artifacts
pnpm clean
```

## Development

### No Build Required

- **Frontend**: Vite handles TypeScript/JSX transformation on-the-fly
- **Backend**: Node v24's `--experimental-strip-types` runs TS directly
- **Packages**: Export source files directly via package.json exports

### Adding New Packages

1. Create a new directory under `packages/` or `apps/`
2. Add a `package.json` with proper exports
3. Reference it from other packages using `workspace:*` protocol

### Type Safety

The monorepo maintains end-to-end type safety:
- tRPC router types are exported from backend
- Frontend imports these types for full type safety
- Shared types package ensures consistency

## Production

For production builds:

```bash
# Build all apps
pnpm build
```

Only the frontend and backend apps have build steps for production deployment.