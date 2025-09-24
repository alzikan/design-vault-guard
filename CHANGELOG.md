# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2024-09-24

### Added
- Gallery page pagination with 12 artworks per page
- Arabic language toggle button on Gallery page desktop layout
- Comprehensive security improvements for user profile data protection

### Security
- Created separate `user_roles` table to isolate admin permissions from user data
- Implemented secure role-based access control with `has_role` and `is_admin` functions
- Fixed critical RLS policies to prevent unauthorized access to personal information
- Removed admin status from profiles table to eliminate security vulnerabilities

### Fixed
- Gallery page now displays all artworks with proper pagination controls
- Language toggle button now visible on both mobile and desktop Gallery layouts

## [1.1.1] - 2024-09-24

### Added
- Mobile phone number field to user profiles
- Database migration to add phone column to profiles table
- Phone number capture and storage functionality in Profile page

### Fixed
- TypeScript errors in Supabase edge functions (gallery-import and video-import)
- Proper error handling and timeout management in edge functions

### Technical Improvements
- Updated profile data handling to include phone field
- Enhanced error type checking in edge functions
- Replaced deprecated fetch timeout with AbortController