
# Create Privacy Policy Page

## Overview

I will create a Privacy Policy page that is required for App Store and Google Play Store submission. The page will be accessible at `/privacy-policy` and will follow the existing design patterns of your app.

---

## What Will Be Created

### 1. New Page: `src/pages/PrivacyPolicy.tsx`

A new privacy policy page that includes:

- **Header** with your app's consistent design (using PageHeader component)
- **Privacy Policy content** covering all App Store required sections:
  - Information Collection
  - How We Use Your Information
  - Data Storage & Security
  - Third-Party Services (Supabase)
  - Children's Privacy
  - Your Rights
  - Contact Information
  - Policy Updates

- **Bottom Navigation** for consistent app experience
- **Bilingual Support** (English and Arabic) using your existing translation system

### 2. Update `src/App.tsx`

Add a new route `/privacy-policy` pointing to the PrivacyPolicy page.

### 3. Update `src/contexts/LanguageContext.tsx`

Add translations for all privacy policy text in both English and Arabic.

---

## Page Design

The page will match your existing app design:
- Same background and card styling as the About page
- Scrollable content with clear section headings
- Each section in its own Card component
- Icons for visual appeal (Shield, Lock, Eye, etc.)
- Full RTL support for Arabic

---

## Privacy Policy Content

The policy will cover:

| Section | Description |
|---------|-------------|
| Information We Collect | Email for account creation, lesson progress, comments |
| How We Use Data | Authentication, personalization, analytics |
| Data Storage | Supabase cloud storage, security measures |
| Third-Party Services | Supabase for backend services |
| Children's Privacy | Age restrictions and parental consent |
| Your Rights | Data access, deletion, and modification requests |
| Contact | How to reach you for privacy questions |
| Updates | How policy changes will be communicated |

---

## Technical Details

### Files to Create
- `src/pages/PrivacyPolicy.tsx` - Main privacy policy page component

### Files to Modify
- `src/App.tsx` - Add route for `/privacy-policy`
- `src/contexts/LanguageContext.tsx` - Add ~30 new translation keys for privacy policy content

### Dependencies
No new dependencies required - uses existing UI components (Card, PageHeader, BottomNav, etc.)

---

## How to Access

After implementation:
- **Web**: Visit `https://alzakanart.lovable.app/privacy-policy`
- **App Store**: You can link to this URL in your app listing
- **In-App**: Optionally add a link in settings or footer

---

## Important Notes

1. **Placeholder Contact Email**: I will use a placeholder email (contact@alzakanart.com). You should update this with your actual contact email.

2. **Last Updated Date**: The policy will show today's date. Update this whenever you modify the policy.

3. **Customization**: You may want to review and customize the legal language based on your specific data practices or consult with a legal professional for compliance in your region.
