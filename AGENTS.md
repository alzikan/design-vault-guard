# Architecture rules
- Keep sign-in and password recovery on separate public pages, sharing an auth layout and password input so recovery sessions cannot trigger sign-in redirects.
- Let the Supabase client establish callback sessions; verify them with getUser before allowing password recovery, and preserve legacy recovery redirects.
- Keep authentication messages in LanguageContext and authentication colors in semantic CSS tokens for bilingual, high-contrast forms.
- Protect permanent administrator role assignments with a database trigger tied to the verified account ID, not a client-side email bypass, so all access checks remain server-validated.