# CutCraft Editing Portfolio App

Static multi-page portfolio app for video editors.

## Vercel deployment fix for 404

If your domain shows `404: NOT_FOUND`, ensure:

1. **Root Directory** is the repository root.
2. **Framework Preset** is set to **Other**.
3. **Build Command** is empty.
4. **Output Directory** is empty.

This repository includes `vercel.json` rewrites so `/`, `/login`, `/signup`, and `/dashboard` resolve correctly.
