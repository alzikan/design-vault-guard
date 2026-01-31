
# App Store Submission Fixes

## Overview

I will implement all the recommendations from your app developer to ensure a smooth App Store submission. These changes cover export compliance, version alignment, branding consistency, and typo fixes.

---

## Changes to Implement

### 1. Export Compliance (Info.plist)

**What**: Add `ITSAppUsesNonExemptEncryption` key to indicate the app only uses HTTPS (which is exempt from export regulations).

**Why**: This prevents App Store Connect from asking about export compliance during every submission.

**Action**: Create an Info.plist file that Capacitor will merge into the iOS build:

| Key | Type | Value |
|-----|------|-------|
| ITSAppUsesNonExemptEncryption | Boolean | NO |

**File to create**: `ios/App/App/Info.plist` additions (or instruct user to add manually in Xcode since iOS folder is generated locally)

---

### 2. Version Alignment

**Current state**:
- `package.json`: "0.0.0"
- `VERSION`: "1.2.0"
- Xcode: MARKETING_VERSION = 1.0, CURRENT_PROJECT_VERSION = 1

**Action**: Update `package.json` version to "1.2.0" to match the VERSION file.

**Note for Xcode**: You will need to update the following in Xcode after pulling:
- MARKETING_VERSION = 1.2.0
- CURRENT_PROJECT_VERSION = 1 (increment this for each App Store upload: 1, 2, 3...)

---

### 3. Display Name / Branding

**Current state**:
- `capacitor.config.ts`: appName = 'alzakanart'
- The app ID is `com.alzikan.art` (with "i")

**Action**: Update `capacitor.config.ts` to use `appName: 'Alzikan Art'` for consistency with the app ID and brand.

This will appear on the home screen when users install the app.

---

### 4. "Artiest" Typo Fix

**Current state** in `index.html`:
- Title: "Ibrahim AlZikan Artiest الفنان ابراهيم الزيكان"
- Multiple meta tags with "Artiest"

**Action**: Change "Artiest" to "Artist" in:
- `<title>` tag
- `<meta name="description">`
- `<meta property="og:title">`
- `<meta name="twitter:title">`
- `<meta property="og:description">`
- `<meta name="twitter:description">`

---

## Summary of File Changes

| File | Change |
|------|--------|
| `package.json` | Update version from "0.0.0" to "1.2.0" |
| `capacitor.config.ts` | Change appName from 'alzakanart' to 'Alzikan Art' |
| `index.html` | Fix "Artiest" typo to "Artist" in title and all meta tags |

---

## Manual Steps Required After Implementation

After pulling these changes to your local repository, your developer needs to:

1. **Run sync**: `npm run build && npx cap sync`

2. **Update Xcode settings** (in Xcode > App target > General):
   - Set Version (MARKETING_VERSION) to `1.2.0`
   - Set Build (CURRENT_PROJECT_VERSION) to `1`

3. **Add Export Compliance** (in Xcode > App target > Info):
   - Add key: `App Uses Non-Exempt Encryption`
   - Set value: `NO`

   Or add to Info.plist:
   ```
   <key>ITSAppUsesNonExemptEncryption</key>
   <false/>
   ```

4. **Archive and submit** to App Store Connect

---

## Technical Details

### Files to Modify
- `package.json` - Line 4: version "0.0.0" to "1.2.0"
- `capacitor.config.ts` - Line 5: appName 'alzakanart' to 'Alzikan Art'
- `index.html` - Lines 6, 7, 20, 21, 22, 23: "Artiest" to "Artist"

### No New Dependencies Required

All changes are configuration updates only.
