# oxido

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_31AtQSmECB88REpXcrshMWZy2JvB)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

## Panel interno (Supabase)

Pasos para dejarlo corriendo:

1. Crea un proyecto en [supabase.com](https://supabase.com) (gratis).
2. Dashboard → SQL Editor → pega el contenido de `supabase/migrations/0001_init.sql` → Run.
   Esto crea las tablas, activa Row Level Security y el trigger que asigna un
   username automático a cada cuenta nueva.
3. Dashboard → Project Settings → API → copia `Project URL` y `anon public key`.
4. Copia `.env.local.example` a `.env.local` y pega esos dos valores.
5. `pnpm install` (agrega `@supabase/ssr` y `@supabase/supabase-js`, ya están en `package.json`).
6. Crea tu primera cuenta de admin: Dashboard → Authentication → Add user (o
   invita por correo). Con esa cuenta entras en `/login`.
7. Al entrar por primera vez, el panel pide crear tu sello — después ya puedes
   dar de alta artistas y lanzamientos desde `/admin`.

Para que un artista entre a ver solo lo suyo: crea su cuenta en Supabase Auth
(se le asigna un username automático), y desde `/admin/artistas` vincula su
artista a ese username. RLS hace el resto: ese usuario solo ve su propio
perfil, sus lanzamientos y su propio split — nunca el de nadie más.
