# Portofolio-LEOOSTORE.id

Public portfolio and project showcase for **LEOOSTORE.id**.

## Current structure

- `index.html` — public portfolio homepage
- `admin.html` — admin dashboard
- `admin-settings.html` — editable hero, benefits, and Basic/Standard/Premium website package settings
- `assets/js/app.js` — public project cards, package carousel, and category filters
- `assets/css/style.css` — responsive dark visual system
- `assets/js/app.js` — initial project cards and category filters
- `supabase/schema.sql` — initial database tables, RLS policies, and image bucket

## Local preview

Open `index.html` in a browser, or run a local static server from the repository root.

## GitHub Pages

1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Save and wait for the deployment to finish.

Expected URL:

`https://leovbr.github.io/Portofolio-LEOOSTORE.id/`

## Supabase setup (next development step)

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Create the owner/admin account in Supabase Authentication.
4. Copy that user's UUID from **Authentication → Users**, then run this in SQL Editor (replace the UUID):

   `insert into public.portfolio_admins (user_id) values ('YOUR-AUTH-USER-UUID');`

5. Only UUIDs explicitly added to `portfolio_admins` can manage projects, testimonials, or upload thumbnails. Do not add public users to this table.
6. Connect the public project list and admin dashboard using the Supabase publishable/anon key.
7. Never put the Supabase service-role key in browser JavaScript.

The homepage reads published projects, testimonials, and site settings from Supabase. Website package cards are stored in `portfolio_site_settings.website_packages` and can be edited from `admin-settings.html` after admin login.

## Initial project entries

The first three portfolio entries are placeholders for:
- LEOOSTORE.id
- Kyvora.id
- Owner Dashboard

Replace descriptions, thumbnails, and live URLs with verified project details before publishing them as completed work.

## Brand

Display name: **LEOOSTORE.id**
Repository: **Portofolio-LEOOSTORE.id**
