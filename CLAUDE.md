# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

domet is a React scroll-spy hook library. The monorepo contains:
- `packages/domet`: The npm package (React hook for scroll tracking)
- `website`: Next.js documentation site using Fumadocs

## Commands

### Root (Turborepo)
```bash
npm run dev          # Run all dev servers
npm run build        # Build all packages
npm run lint         # Lint all packages
npm run test         # Run all tests
```

### Package: domet
```bash
cd packages/domet
npm run build        # Compile TypeScript
npm run dev          # Watch mode
npm test             # Run Vitest tests
npm test -- --watch  # Watch mode
npm test -- useDomet.test.tsx  # Single test file
```

### Website
```bash
cd website
npm run dev          # Next.js dev with Turbopack
npm run build        # Production build
```

## Architecture

### Hook Algorithm (`useDomet.ts`)

The hook uses a **scoring system** to determine the active section:
1. **Visibility score**: Sections with >60% visibility get bonus points
2. **Trigger line proximity**: Sections crossing the trigger line (offset from top) get priority
3. **Hysteresis**: A 150-point margin prevents rapid switching between sections
4. **Edge cases**: Top/bottom of page forces first/last section active

Key constants:
- `VISIBILITY_THRESHOLD = 0.6` (60% visibility required for high score)
- `HYSTERESIS_SCORE_MARGIN = 150` (score difference needed to switch sections)

### Performance

- `requestAnimationFrame` for smooth 60fps updates
- Throttling with configurable `debounceMs` (default 10ms)
- Refs stored in `useRef` to avoid re-renders
- `useMemo` for stable section ID arrays

## Package Exports

```typescript
import { useDomet } from 'domet';
import type { DometOptions, UseDometReturn } from 'domet';
```

## Testing

Tests use Vitest with jsdom. Mock `IntersectionObserver` and `getBoundingClientRect` for scroll simulation.
