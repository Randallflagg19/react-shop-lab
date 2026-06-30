# AI Slop Shop

A compact storefront for impossible AI-generated goods, built with React, TypeScript, Next.js, and an InsForge backend. The project combines a searchable product catalog, product pages, a persistent cart, favorites, cross-tab synchronization, and original fantasy product imagery.

## Screenshots

![Product catalog](docs/screenshots/catalog.png)

![Catalog filters and sorting](docs/screenshots/catalog-filters.png)

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- InsForge Database, Storage, and TypeScript SDK
- Vercel

## Features

- Product catalog loaded from InsForge Database
- Product images served from a public InsForge Storage bucket
- Debounced product search
- Category filtering and price/title sorting
- Responsive product grid
- Dynamic product pages by slug
- Shared cart implemented with Context and `useReducer`
- Cart and favorites persistence in `localStorage`
- Cart and favorites synchronization between browser tabs
- Favorites implemented as an external store
- Loading, error, and empty states
- Abortable catalog requests with `AbortController`

## Routes

- `/` - product catalog
- `/products/[slug]` - product details
- `/cart` - persistent shopping cart

## Backend

InsForge replaces the original public fake-store API and owns the catalog data and product images.

```text
InsForge Database
  categories
  products

InsForge Storage
  product-photos
```

The application reads the public catalog through `@insforge/sdk`. Database rows are mapped to the frontend `Product` model inside `src/entities/product/api`, so UI components do not depend directly on the backend schema.

Product records store both an `image_key` and the public `image_url`. Image files themselves remain in Storage rather than the database.

## Hooks Practised

| Hook | Use in the project |
| --- | --- |
| `useState` | Search, category, sorting, loading, errors, and cart restoration status |
| `useEffect` | Product requests, debounce cleanup, autofocus, and `localStorage` synchronization |
| `useRef` | Search input access and stable mutable values inside custom hooks |
| `useMemo` | Derived categories and filtered/sorted products |
| `useReducer` | Cart add, remove, increase, decrease, clear, and hydrate actions |
| `useContext` | Shared cart access through `CartProvider` |
| `useId` | Accessible relationships between labels and controls |
| `useTransition` | Non-urgent category changes and pending UI |
| `useImperativeHandle` | Restricted search input API such as `focus()` and `clear()` |
| `useSyncExternalStore` | Favorites snapshots, subscriptions, SSR snapshot, and cross-tab updates |
| `useOptimistic` | Learning experiment for optimistic favorite feedback; scheduled for removal because persistence is currently synchronous |

Additional experiments:

- `useCallback` with `React.memo`; both were removed when stable references no longer improved rendering.
- `useDeferredValue` compared with debounce; debounce was retained for the intended search behavior.
- `useLayoutEffect` used for a DOM measurement exercise and removed because the final UI did not require synchronous layout measurement.

## State And Persistence

The cart and favorites intentionally use different state models:

- The cart is React-owned state managed by `useReducer` and distributed through Context. Effects restore and persist it in `localStorage`.
- Favorites use a small external store connected through `useSyncExternalStore`. The store exposes snapshots, subscriptions, actions, and a stable server snapshot.

Both features listen for the browser `storage` event so changes made in one tab appear in another tab on the same origin.

## Architecture

The source tree follows an FSD-inspired separation of responsibilities:

```text
src/
  app/                       routes, layout, and providers
  entities/product/          product model, InsForge API, mapper, and reusable UI
  features/cart/             cart model, context, and UI
  features/favorites/        external favorites store and favorite action
  features/products-catalog/ catalog state, derived data, and UI
  shared/api/                configured InsForge client
```

Product entities do not import cart or favorites features. Route and feature-level components compose entity UI with feature actions through props and slots.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_INSFORGE_URL=https://your-project.insforge.app
NEXT_PUBLIC_INSFORGE_ANON_KEY=your-public-anon-key
```

The anon key is intended for browser use. Database permissions remain the actual security boundary; never expose an InsForge admin key through a `NEXT_PUBLIC_*` variable.

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Deployment

The application is deployed with Vercel. Add `NEXT_PUBLIC_INSFORGE_URL` and `NEXT_PUBLIC_INSFORGE_ANON_KEY` to the Vercel project environment before deploying.

## What I Learned

- How React state, reducers, Context, and external stores solve different ownership problems
- How immutable snapshots allow React to detect external store changes
- How SSR and hydration affect browser-only APIs such as `localStorage`
- How to persist state without replacing the existing cart architecture
- How Server and Client Components can be composed without turning an entire route into a Client Component
- How to map database rows into an application-owned entity model
- How to connect Next.js to InsForge Database and Storage without maintaining a separate Nest.js backend

## Limitations And Next Steps

- Cart and favorites are browser-local and are not associated with an authenticated user.
- The current optimistic favorite delay is an educational experiment and should be removed from the synchronous `localStorage` flow.
- Image fallback, loading presentation, and delivery optimization still need refinement.
- Anon permissions should be verified to allow catalog reads while rejecting public writes.
- Automated component and end-to-end tests are not included yet.
