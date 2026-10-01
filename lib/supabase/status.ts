/**
 * El "semáforo": si Supabase está configurado y si la conexión responde de
 * verdad. Se usa tanto en el middleware (para no romper el sitio público si
 * aún no hay nada configurado) como en el panel admin (para mostrar la luz).
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key && url.startsWith('http'))
}

export type SemaphoreStatus = 'green' | 'yellow' | 'red'

export type SupabaseStatusReport = {
  status: SemaphoreStatus
  message: string
}

/**
 * Verde: configurado, conectado y el esquema (la tabla `labels`) existe.
 * Amarillo: hay conexión, pero algo falla (p. ej. todavía no corriste el SQL).
 * Rojo: no hay variables de entorno, o la conexión no responde.
 */
export async function getSupabaseStatus(): Promise<SupabaseStatusReport> {
  if (!isSupabaseConfigured()) {
    return {
      status: 'red',
      message: 'Falta configurar Supabase: no hay NEXT_PUBLIC_SUPABASE_URL / ANON_KEY en .env.local.',
    }
  }

  try {
    const { createClient } = await import('./server')
    const supabase = await createClient()
    const { error } = await supabase.from('labels').select('id').limit(1)

    if (error) {
      return {
        status: 'yellow',
        message: `Conecta, pero hay un error de esquema: ${error.message}. ¿Ya corriste supabase/migrations/0001_init.sql?`,
      }
    }

    return { status: 'green', message: 'Conectado — Supabase responde y el esquema existe.' }
  } catch {
    return {
      status: 'red',
      message: 'No se pudo conectar a Supabase. Revisa la URL/anon key en .env.local.',
    }
  }
}
