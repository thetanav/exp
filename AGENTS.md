# AGENTS.md - Coding Agent Guidelines

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

Personal finance tracker built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui components. Features an AI-powered finance assistant using Google Gemini.

## Build/Lint/Test Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Type checking (no separate command, runs during build)
npx tsc --noEmit
```

No test framework is currently configured in this project.

## Project Structure

```
app/
├── api/chat/route.ts    # Gemini AI chat endpoint
├── analysis/page.tsx    # AI assistant UI
├── filter/page.tsx      # Transaction filtering
├── page.tsx             # Home/transactions list
├── layout.tsx           # Root layout
└── globals.css          # Tailwind + theme variables
components/
├── ui/                  # shadcn/ui primitives
└── *.tsx                # Feature components
lib/
├── utils.ts             # cn() class merge utility
├── categories.ts        # Category definitions
└── useIsMobile.ts       # Mobile detection hook
utils/
└── dataManager.ts       # localStorage CRUD operations
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - Full type safety required
- **Path alias**: Use `@/*` for all internal imports (maps to project root)
- **Explicit types**: Always type function parameters and return values
- **Interfaces**: Use `interface` for object shapes, suffix with `Props` for component props

```typescript
interface AddTransactionFormProps {
  type: "expense" | "income";
  onClose: () => void;
}
```

### Import Order

1. `"use client"` directive (if needed) at the very top
2. React/Next.js core imports
3. External library imports
4. Internal components (`@/components/*`)
5. Internal utilities (`@/lib/*`, `@/utils/*`)
6. Types (if separate)

```typescript
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { getTransactions, Transaction } from "@/utils/dataManager";
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `AddTransactionForm` |
| UI components (files) | kebab-case | `back-button.tsx` |
| Feature components (files) | PascalCase | `EditTransactionForm.tsx` |
| Hooks | camelCase with `use` prefix | `useIsMobile` |
| Handler functions | camelCase with `handle` prefix | `handleSubmit` |
| Boolean variables | camelCase with `is`/`has` prefix | `isLoading`, `hasGeminiKey` |
| Interfaces/Types | PascalCase | `Transaction`, `FilterOptions` |
| Props interfaces | PascalCase with `Props` suffix | `CardProps` |

### Component Patterns

- **Functional components only** - No class components
- **Default exports** for page components and feature components
- **Named exports** for UI primitives

```typescript
// Feature component
export default function AddTransactionForm({ type, onClose }: AddTransactionFormProps) {
  // ...
}

// UI primitive
function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
export { Button };
```

### Props Typing

For simple props, use inline typing:
```typescript
export default function Expninc({
  thisMonthExpense,
  thisMonthEarning,
}: {
  thisMonthExpense: number;
  thisMonthEarning: number;
}) { ... }
```

For complex props, define an interface:
```typescript
interface AddTransactionFormProps {
  type: "expense" | "income";
  onClose: () => void;
}
```

### Styling with Tailwind CSS

- Use the `cn()` utility from `@/lib/utils` for conditional classes
- Follow Tailwind v4 syntax with CSS custom properties
- Use design tokens defined in `globals.css`

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "w-full justify-start text-left font-normal",
  !dateRange?.from && "text-muted-foreground"
)} />
```

### State Management

- Use React `useState` for local state
- Use `localStorage` via `@/utils/dataManager` for persistence
- Use custom events for cross-component communication

```typescript
// Dispatch event after data changes
window.dispatchEvent(new Event("transactions:changed"));

// Listen for changes
useEffect(() => {
  const handler = () => setTransactions(getTransactions());
  window.addEventListener("transactions:changed", handler);
  return () => window.removeEventListener("transactions:changed", handler);
}, []);
```

### Error Handling

API routes - Return Response with appropriate status:
```typescript
if (!geminiApiKey) {
  return new Response("Missing Gemini API key", { status: 401 });
}
```

Client-side - Use guard clauses with early returns:
```typescript
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return;
  if (!selectedCategory) return;
  // proceed...
};
```

### API Routes

- Located in `app/api/*/route.ts`
- Export named functions for HTTP methods (`POST`, `GET`, etc.)
- Use inline types for request body parsing

```typescript
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, geminiApiKey }: { messages: UIMessage[]; geminiApiKey?: string } = 
    await req.json();
  // ...
}
```

### AI Integration

- Uses Vercel AI SDK (`ai`, `@ai-sdk/google`, `@ai-sdk/react`)
- Gemini API key stored client-side in localStorage
- Use `streamdown` for markdown rendering in AI responses

### UI Components (shadcn/ui)

- Located in `components/ui/`
- Built on Radix UI primitives
- Use CVA (class-variance-authority) for variants
- Extend native element props with `React.ComponentProps<"element">`

```typescript
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn("border-input focus-visible:border-ring ...", className)}
      {...props}
    />
  );
}
```

## Key Dependencies

- **Next.js 16** - App Router, React 19
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - UI component library (Radix + Tailwind)
- **Framer Motion** - Animations
- **Vercel AI SDK** - AI chat integration
- **streamdown** - Streaming markdown rendering
- **date-fns** - Date formatting
- **Lucide React** - Icons

## Important Notes

- No backend database - all data stored in localStorage
- API keys are client-side only (user provides their own Gemini key)
- Mobile-first responsive design
- Dark mode supported via CSS custom properties
