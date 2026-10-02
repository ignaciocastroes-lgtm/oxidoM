import { LogoMark } from '@/components/logo-mark'
import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-3">
          <LogoMark className="size-10" />
          <h1 className="font-display text-3xl">ÓXIDO</h1>
          <p className="text-sm text-muted-foreground">Panel interno — solo roster y equipo</p>
        </div>

        <form action={login} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-muted-foreground">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-muted-foreground">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </div>

          {error && <p className="text-sm text-primary">{decodeURIComponent(error)}</p>}

          <button
            type="submit"
            className="mt-2 bg-primary py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Entrar
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Las cuentas las crea el admin del sello desde Supabase o invitando por correo. No hay
          registro público.
        </p>
      </div>
    </main>
  )
}
