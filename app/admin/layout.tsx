import Link from 'next/link'
import { LogoMark } from '@/components/logo-mark'
import { Semaphore } from '@/components/admin/semaphore'
import { logout } from '@/app/login/actions'
import { createLabel } from '@/lib/admin/actions'
import { getCurrentProfile, getOwnedLabel } from '@/lib/admin/queries'
import { getSupabaseStatus, isSupabaseConfigured } from '@/lib/supabase/status'

function SetupScreen({ message }: { message: string }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <LogoMark className="size-10" />
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: '#EF4444', boxShadow: '0 0 0 4px #EF444422' }}
              aria-hidden="true"
            />
            <h1 className="font-display text-3xl">Supabase desconectado</h1>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
        </div>
        <ol className="flex flex-col gap-3 border border-border p-5 text-sm text-muted-foreground">
          <li>1. Crea un proyecto gratis en supabase.com</li>
          <li>
            2. SQL Editor → pega <code className="text-foreground">supabase/migrations/0001_init.sql</code> → Run
          </li>
          <li>3. Project Settings → API → copia la URL y la anon key</li>
          <li>
            4. Pégalas en <code className="text-foreground">.env.local</code> (hay una plantilla en{' '}
            <code className="text-foreground">.env.local.example</code>)
          </li>
          <li>5. Reinicia el servidor — el semáforo pasa a verde solo</li>
        </ol>
      </div>
    </main>
  )
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <SetupScreen message="El panel necesita un proyecto de Supabase para guardar artistas, lanzamientos y splits. El sitio público sigue funcionando normal mientras tanto." />
    )
  }

  const status = await getSupabaseStatus()

  if (status.status === 'red') {
    return <SetupScreen message={status.message} />
  }

  let profile = null
  let label = null
  try {
    profile = await getCurrentProfile()
    label = await getOwnedLabel()
  } catch {
    return (
      <SetupScreen message="Supabase respondió, pero hubo un error leyendo tus datos. Revisa que el SQL de las migraciones haya corrido completo." />
    )
  }

  // Primer ingreso: todavía no existe un label para este usuario → onboarding.
  if (!label) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-5">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <LogoMark className="size-10" />
            <h1 className="font-display text-3xl">Crea tu sello</h1>
            <p className="text-sm text-muted-foreground">
              Hola {profile?.username ?? ''} — antes de nada, crea el registro de tu sello.
            </p>
          </div>
          <form action={createLabel} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-muted-foreground">
                Nombre del sello
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue="ÓXIDO"
                className="border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="isrc_prefix" className="text-sm text-muted-foreground">
                Prefijo ISRC (opcional, lo da IFPI)
              </label>
              <input
                id="isrc_prefix"
                name="isrc_prefix"
                placeholder="EF2"
                className="border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-primary py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Crear sello
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <LogoMark className="size-6" />
            <span className="font-display text-xl">{label.name}</span>
            <span className="hidden text-xs text-muted-foreground md:inline">panel interno</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/admin" className="text-muted-foreground transition-colors hover:text-foreground">
              Resumen
            </Link>
            <Link
              href="/admin/artistas"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Artistas
            </Link>
            <Link
              href="/admin/lanzamientos"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Lanzamientos
            </Link>
            <Semaphore status={status.status} message={status.message} />
            <span className="hidden text-muted-foreground md:inline">@{profile?.username}</span>
            <form action={logout}>
              <button type="submit" className="text-muted-foreground transition-colors hover:text-primary">
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8">{children}</main>
    </div>
  )
}
