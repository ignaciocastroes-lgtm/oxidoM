import { createArtist, linkArtistToUsername, toggleArtistPublic } from '@/lib/admin/actions'
import { getArtists, getOwnedLabel } from '@/lib/admin/queries'

export default async function ArtistasPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const label = await getOwnedLabel()
  if (!label) return null

  const artists = await getArtists(label.id)
  const createArtistWithLabel = createArtist.bind(null, label.id)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Artistas</h1>
        <span className="text-sm text-muted-foreground">{artists.length} en el roster</span>
      </div>

      {error && <p className="border border-primary px-4 py-3 text-sm text-primary">{error}</p>}

      <form action={createArtistWithLabel} className="flex flex-col gap-4 border border-border p-5 md:flex-row md:items-end">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="name" className="text-sm text-muted-foreground">
            Nombre artístico
          </label>
          <input
            id="name"
            name="name"
            required
            className="border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor="genres" className="text-sm text-muted-foreground">
            Géneros (separados por coma)
          </label>
          <input
            id="genres"
            name="genres"
            placeholder="trap, rap"
            className="border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>
        <button type="submit" className="bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90">
          Añadir artista
        </button>
      </form>

      <div className="flex flex-col divide-y divide-border border-y border-border">
        {artists.map((artist) => {
          const linkArtist = linkArtistToUsername.bind(null, artist.id)
          return (
            <div key={artist.id} className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-display text-2xl">{artist.name}</span>
                <span className="text-sm text-muted-foreground">
                  {artist.genres.join(' / ') || 'sin género asignado'}
                  {artist.user_id ? ' · cuenta vinculada' : ' · sin cuenta vinculada'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <form action={linkArtist} className="flex items-center gap-2">
                  <input
                    name="username"
                    placeholder="username de Supabase"
                    className="border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                  <button type="submit" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                    Vincular
                  </button>
                </form>
                <form action={toggleArtistPublic.bind(null, artist.id, !artist.is_public)}>
                  <button type="submit" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
                    {artist.is_public ? 'Ocultar del sitio' : 'Mostrar en el sitio'}
                  </button>
                </form>
              </div>
            </div>
          )
        })}
        {artists.length === 0 && <p className="py-6 text-sm text-muted-foreground">Todavía no hay artistas.</p>}
      </div>

      <p className="text-xs text-muted-foreground">
        "Vincular" conecta este artista con una cuenta ya existente (el username se asigna solo al
        registrarse en Supabase Auth). Desde ahí esa persona entra a /admin y ve únicamente su
        propio perfil, sus lanzamientos y su propio split — nunca los de los demás.
      </p>
    </div>
  )
}
