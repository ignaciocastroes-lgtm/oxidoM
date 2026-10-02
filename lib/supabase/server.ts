import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente de Supabase para Server Components y Server Actions. Usa SIEMPRE
 * este cliente (nunca una service_role key) para que RLS se aplique con la
 * sesión real del usuario que hace la petición — así la "puerta trasera"
 * nunca se salta sus propias reglas de seguridad.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Se puede ignorar si se llama desde un Server Component: el
            // middleware ya se encarga de refrescar la sesión en cada request.
          }
        },
      },
    },
  )
}
