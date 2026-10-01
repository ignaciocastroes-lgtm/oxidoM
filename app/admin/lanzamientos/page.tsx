import Link from 'next/link'
import { createRelease } from '@/lib/admin/actions'
import { getArtists, getOwnedLabel, getReleases } from '@/lib/admin/queries'

export default async function LanzamientosPage() {
  const label = await getOwnedLabel()
  if (!label) return null

  const [releases, artists] = await Promise.all([getReleases(label.id), getArtists(label.id)])
  const createReleaseWithLabel = createRelease.bind(null, label.id)

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-4xl">Lanzamientos</h1>

      <form
        action={createReleaseWithLabel}
        className="grid grid-cols-1 gap-4 border border-border p-5 md:grid-cols-4 md:items-end"
      >
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="title" className="text-sm text-muted-foreground">
            Título
          </label>
          <input
            id="title"
            name="title"
            required
            className="border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="format" className="text-sm text-muted-foreground">
            Formato
          </label>
          <select
            id="format"
            name="format"
            className="border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          >
            <option value="sencillo">Sencillo</option>
            <option value="ep">EP</option>
            <option value="album">Álbum</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="release_date" className="text-sm text-muted-foreground">
            Fecha
          </label>
          <input
            id="release_date"
            name="release_date"
            type="date"
            required
            className="border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-3">
          <label htmlFor="primary_artist_id" className="text-sm text-muted-foreground">
            Artista principal
          </label>
          <select
            id="primary_artist_id"
            name="primary_artist_id"
            required
            className="border border-border bg-background px-3 py-2 outline-none focus:border-primary"
          >
            <option value="">Selecciona un artista</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90 md:col-span-1"
        >
          Crear
        </button>
      </form>

      <div className="flex flex-col divide-y divide-border border-y border-border">
        {releases.map((release) => (
          <Link
            key={release.id}
            href={`/admin/lanzamientos/${release.id}`}
            className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-primary"
          >
            <div className="flex flex-col gap-1">
              <span className="font-display text-2xl">{release.title}</span>
              <span className="text-sm text-muted-foreground">
                {release.format} · {release.release_date}
              </span>
            </div>
            <span className="text-sm uppercase tracking-wide text-muted-foreground">{release.status}</span>
          </Link>
        ))}
        {releases.length === 0 && <p className="py-6 text-sm text-muted-foreground">Todavía no hay lanzamientos.</p>}
      </div>
    </div>
  )
}
