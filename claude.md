# Claude Code Best Practices for This Project

## Project Overview
Valentine's Day website built with Astro + React + Tailwind + Framer Motion.

## Agent Execution Strategy

### Parallelism Rules
- **ALWAYS use parallel agents** when tasks are independent (no shared state/files)
- Launch multiple Task agents in a single message when possible
- Examples of parallelizable work:
  - Creating multiple independent components simultaneously
  - Setting up config files that don't depend on each other
  - Writing tests for different modules
  - Creating multiple page scaffolds

### Single Feature Steps
- Complete one verifiable feature at a time
- Each step should be testable by the user before proceeding
- Order of implementation:
  1. Project setup (Astro + deps)
  2. Password gate page (entry experience)
  3. Letter reveal page (heart animation + letter)
  4. Navigation component
  5. Photo gallery page
  6. Timeline page
  7. Love notes page
  8. Itinerary page
  9. Music player + countdown

### Verification Points
After each feature, user should be able to:
- Run `npm run dev`
- See the feature working in browser
- Approve before moving to next feature

### Context Management
- **Run bash commands via Task agents** (subagent_type: Bash) to avoid clogging main context
- Use background agents for long-running commands (npm install, builds)
- Only use direct Bash tool for quick, essential commands (git status, etc.)

## Code Quality Standards

### TypeScript
- Use TypeScript for all React components (`.tsx`)
- Define proper interfaces for props
- Avoid `any` type - use specific types or `unknown` if needed

### Component Structure
```tsx
// Good component structure
interface ComponentProps {
  title: string;
  isActive?: boolean;
  onAction: () => void;
}

export function Component({ title, isActive = false, onAction }: ComponentProps) {
  // hooks first
  const [state, setState] = useState(false);

  // handlers
  const handleClick = () => {
    onAction();
  };

  // render
  return (
    <div onClick={handleClick}>
      {title}
    </div>
  );
}
```

### File Organization
- One component per file
- Name files same as component: `PasswordGate.tsx` exports `PasswordGate`
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling with Tailwind
- Use Tailwind classes directly in JSX
- Group related classes logically
- Use CSS variables for theme colors (defined in global.css)
- For complex/repeated styles, use `@apply` in CSS or extract to component

### Animations with Framer Motion
- Define animation variants as constants outside component
- Use semantic names for variants: `hidden`, `visible`, `exit`
- Keep animations performant: prefer `transform` and `opacity`

```tsx
const variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  exit="exit"
/>
```

### Astro Pages
- Use `.astro` for pages, import React components with `client:` directives
- `client:load` for components needed immediately
- `client:visible` for below-fold content
- `client:idle` for non-critical interactivity

### State Management
- Use React's built-in useState/useContext for this project
- Store auth state in localStorage with a simple key
- No need for Redux or Zustand for this scope

## Linting & Formatting

### ESLint Config
The project uses:
- `eslint-plugin-react` - React best practices
- `eslint-plugin-react-hooks` - Hooks rules
- `@typescript-eslint` - TypeScript rules

### Prettier Config
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Pre-commit Checks
Run before committing:
```bash
npm run lint      # Check for issues
npm run format    # Auto-format code
npm run build     # Ensure it builds
```

## Accessibility
- Use semantic HTML elements
- Add `aria-label` to icon buttons
- Ensure color contrast meets WCAG AA
- Make animations respect `prefers-reduced-motion`

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

## Performance
- Use Astro's image optimization for photos
- Lazy load below-fold content
- Keep bundle size small - avoid unnecessary dependencies
- Preload critical fonts

## Security
- Password is client-side only (not secure, but fine for this use case)
- No sensitive data in the repo
- Keep photos in `src/assets/` not `public/` if you want them processed
