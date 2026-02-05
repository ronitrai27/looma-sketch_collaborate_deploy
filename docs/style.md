# UI Design Style Guide

## Overview
This document contains design patterns, component guidelines, and visual references for building consistent, modern SaaS applications using html , tailwind , flowbite, chart.js, icons and tailwind-animations and custom css.

## Core Design Principles

### 1. Visual Hierarchy
- Use size, weight, and color to establish clear information hierarchy
- Primary actions should be visually prominent
- Secondary actions should be subdued but accessible
- Tertiary actions can be hidden in menus or revealed on hover

### 2. Spacing & Layout
- Use consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
- Maintain generous whitespace - don't be afraid of empty space
- Group related elements with proximity
- Use containers and cards to separate distinct sections

### 3. Color Usage
- Limit primary colors - typically 1-2 brand colors maximum
- Use neutral grays for most UI elements
- Reserve bright colors for CTAs, notifications, and important states
- Maintain sufficient contrast ratios (WCAG AA minimum: 4.5:1 for text)

### 4. Typography
- Establish clear type scale (12px, 14px, 16px, 18px, 24px, 32px, 48px)
- Use max 2-3 font weights per project
- Maintain comfortable line heights (1.5 for body, 1.2 for headings)
- Limit line length to 60-80 characters for readability

#### Images
- Avatar: Circular, 32px-40px for small, 64px+ for large
- Placeholder states: Use skeleton or service like `ui-avatars.com`
- Product images: Consistent aspect ratio, object-fit cover
- Lazy load images below fold
- Alt text for accessibility

---

### Section: Button Examples
**Description**: Add screenshots showing various button states
- [ ] Primary button (default, hover, active, disabled, loading)
- [ ] Secondary/outline button variations
- [ ] Ghost/text button examples
- [ ] Button with icons (leading, trailing, icon-only)
- [ ] Button groups and segmented controls
- [ ] Destructive action buttons

### Section: Form Components
**Description**: Form layouts and input patterns
- [ ] Complete form with all input types
- [ ] Inline validation examples
- [ ] Multi-step form with progress indicator
- [ ] Search input with autocomplete
- [ ] File upload component
- [ ] Toggle switches and checkboxes

### Section: Dashboard Examples
**Description**: Full dashboard screenshots
- [ ] Analytics dashboard layout
- [ ] Stat cards with trends
- [ ] Charts and graphs integration
- [ ] Data table with filters
- [ ] Calendar/scheduling view
- [ ] Kanban board layout

### Section: Cards & Content
**Description**: Card component variations
- [ ] Basic content cards
- [ ] Product/pricing cards
- [ ] User profile cards
- [ ] Interactive/clickable cards
- [ ] Card with image header
- [ ] Empty state cards

### Section: Modals & Overlays
**Description**: Dialog and modal examples
- [ ] Confirmation dialog
- [ ] Form modal
- [ ] Full-screen modal
- [ ] Side sheet/drawer
- [ ] Popover menu
- [ ] Dropdown select

### Section: Color Palette
**Description**: Color system reference
- [ ] Primary brand colors
- [ ] Semantic colors (success, error, warning, info)
- [ ] Neutral grays (light to dark)
- [ ] Dark mode color palette
- [ ] Accessibility contrast examples

### Section: Typography
**Description**: Type scale and usage
- [ ] Heading hierarchy (h1-h6)
- [ ] Body text variations
- [ ] Code and monospace
- [ ] Lists and formatting
- [ ] Text colors and weights

### Section: Dark Mode
**Description**: Dark mode implementations
- [ ] Dashboard in dark mode
- [ ] Form components in dark mode
- [ ] Cards and modals in dark mode
- [ ] Navigation in dark mode
- [ ] Toggle between light/dark


### Inspiration Sources
- Linear (linear.app) - Clean, minimal SaaS design
- Vercel (vercel.com) - Modern developer UI
- Stripe (stripe.com) - Professional dashboard design
- Resend (resend.com) - Simple, elegant interface
- Cal.com - Open-source scheduling UIfor AI Implementation

When referencing this guide:
1. **Context Awareness**: Consider the type of application (dashboard, marketing site, tool)
2. **Consistency**: Use established patterns rather than inventing new ones
3. **Accessibility First**: Always implement ARIA labels and keyboard navigation
4. **Mobile Responsive**: Default to mobile-first approach
5. **Performance**: Use appropriate loading states and optimize images
6. **Dark Mode**: Implement both light and dark variants by default


