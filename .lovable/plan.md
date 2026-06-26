
# Make Admin Button Visible in Header

## Problem
When an admin signs in, the "Admin Panel" link is hidden inside the Settings dropdown menu, so admins don't notice it.

## Solution
Show a dedicated, always-visible **Admin** button in the header (next to the Settings/Language buttons) whenever the logged-in user has admin access. The button will be styled to stand out (warm-gold accent, Shield icon) and use bilingual label.

## Changes

### 1. `src/components/page-header.tsx`
- Add a new button rendered only when `user && hasAdminAccess` is true, placed before the Settings dropdown in the right-side controls.
- Button content: Shield icon + label `t('nav.admin')`.
- Styling: distinct accent (e.g. `bg-warm-gold/15 text-warm-gold border border-warm-gold/40 hover:bg-warm-gold/25`) so it's clearly visible at the top of the header.
- onClick navigates to `/admin`.
- Keep the existing "Admin Panel" item inside the dropdown as well (no regression).

### 2. `src/contexts/LanguageContext.tsx`
- Add translation key `nav.admin`:
  - English: `"Admin"`
  - Arabic: `"المشرف"`

## Out of scope
No changes to admin access logic, routes, or other pages.
