# Changelog

All notable changes to this project will be documented in this file.

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