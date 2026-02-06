---
title: "Phase 3: UI Polish & Localization Content"
description: "Apply MD3 Imperial Green theme and translate content."
status: pending
priority: P2
---

# Phase 3: UI Polish & Localization Content

## 1. Requirements
- **Theme:** Strict adherence to 84tea Brand Guidelines (Imperial Green).
- **Localization:** All user-facing text must be translatable via `next-intl`.

## 2. Design System (MD3)

### Colors (Tailwind Config)
Update `globals.css` / `tailwind.config.ts` to map MD3 variables:
- `primary`: `#1b5e20` (Imperial Green)
- `secondary`: `#c5a962` (Gold Leaf)
- `tertiary`: `#4e342e` (Deep Rosewood)
- `surface`: `#fbf8f3` (Ivory Silk)

### Typography
- Headings: `Playfair Display`
- Body: `Inter`

## 3. Implementation Steps

### 3.1. Theme Configuration
- Update `src/app/globals.css` with CSS variables from `CLAUDE.md`.
- Verify `tailwind.config.ts` uses these variables.
- Check `layout.tsx` for font loading (`@fontsource` or `next/font`).

### 3.2. Component Polish
- Review key components:
  - `Header` / `Navigation`: Ensure correct colors.
  - `Button`: Ensure Primary/Secondary variants match MD3.
  - `Card`: Check elevation and corner radius.
  - `Footer`: Check layout and colors.

### 3.3. Localization Extraction
- Scan `page.tsx` and components for hardcoded strings.
- Extract strings to `messages/vi.json` and `messages/en.json`.
- Replace hardcoded text with `useTranslations('Namespace')`.

### 3.4. Language Switcher
- Create `src/components/ui/LanguageSwitcher.tsx`.
- Allow toggling between VI/EN.
- Use `usePathname`, `useRouter` from `src/i18n/routing.ts` to switch locale while keeping current path.

## 4. Todo List
- [ ] Update `globals.css` with MD3 variables.
- [ ] Verify Font configuration.
- [ ] Create `LanguageSwitcher` component.
- [ ] Extract Homepage strings.
- [ ] Extract Product page strings.
- [ ] Extract Checkout strings.
- [ ] Extract Footer/Header strings.
- [ ] Verify mobile responsiveness for all pages.

## 5. Verification
- Visual check against Brand Guidelines (Imperial Green primary).
- Switch language -> Content changes immediately/after reload.
- No layout shifts when switching languages.
