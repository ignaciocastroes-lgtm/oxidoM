import { notFound } from 'next/navigation'
import {
  addFeaturedArtist,
  addSplit,
  addStreamingLink,
  createTrack,
  deleteSplit,
  updateReleaseMeta,
  updateReleaseStatus,
} from '@/lib/admin/actions'
import {
  getArtists,
  getOwnedLabel,
  getRelease,
  getReleaseArtists,
  getSplits,
  getStreamingLinks,
  getTracks,
} from '@/lib/admin/queries'

const STATUSES = ['borrador', 'en_revision', 'distribuido', 'publicado'] as const

export default async function ReleaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const label = await getOwnedLabel()
  const release = await getRelease(id)
  if (!label || !release) notFound()

  const [artists, releaseArtists, tracks, streamingLinks] = await Promise.all([
    getArtists(label.id),
    getReleaseArtists(id),
    getTracks(id),
    getStreamingLinks(id),
  ])

  const tracksWithSplits = await Promise.all(
    tracks.map(async (track) => ({ track, splits: await getSplits(track.id) })),
  )

  const linkedArtistIds = new Set(
    releaseArtists.map((ra: any) => ra.artists?.id).filter(Boolean),
  )
  const availableArtists = artists.filter((a) => !linkedArtistIds.has(a.id))

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Lanzamiento</span>
        <h1 className="font-display text-4xl">{release.title}</h1>
      </div>

      {/* Estado + metadata */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form action={updateReleaseStatus.bind(null, release.id)} className="flex flex-col gap-3">
          <label htmlFor="status" className="text-sm text-muted-foreground">
            Estado de distribución
          </label>
          <div className="flex gap-3">
            <select
              id="status"
              name="status"
              defaultValue={release.status}
              className="flex-1 border border-border bg-background px-3 py-2 outline-none focus:border-primary"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button type="submit" className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Guardar
            </button>
          </div>
        </form>

        <form action={updateReleaseMeta.bind(null, release.id)} className="flex flex-col gap-3">
          <label htmlFor="cover_url" className="text-sm text-muted-foreground">
            URL de carátula / UPC
          </label>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              id="cover_url"
              name="cover_url"
              defaultValue={release.cover_url ?? ''}
              placeholder="https://…"
              className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              name="upc"
              defaultValue={release.upc ?? ''}
              placeholder="UPC"
              className="w-32 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Guardar
            </button>
          </div>
        </form>
      </section>

      {/* Artistas del release */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">Artistas</h2>
        <ul className="flex flex-wrap gap-3 text-sm">
          {releaseArtists.map((ra: any) => (
            <li key={ra.artists?.id} className="border border-border px-3 py-1.5">
              {ra.artists?.name} <span className="text-muted-foreground">({ra.role})</span>
            </li>
          ))}
        </ul>
        {availableArtists.length > 0 && (
          <form action={addFeaturedArtist.bind(null, release.id)} className="flex items-center gap-3">
            <select
              name="artist_id"
              required
              className="border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Añadir artista invitado</option>
              {availableArtists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
            <button type="submit" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
              Añadir
            </button>
          </form>
        )}
      </section>

      {/* Tracks + splits */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display text-2xl">Tracks</h2>

        <form
          action={createTrack.bind(null, release.id)}
          className="grid grid-cols-1 gap-3 border border-border p-5 md:grid-cols-5 md:items-end"
        >
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm text-muted-foreground">Título</label>
            <input name="title" required className="border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">N°</label>
            <input
              name="track_number"
              type="number"
              min={1}
              defaultValue={tracks.length + 1}
              className="border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">ISRC</label>
            <input name="isrc" placeholder="COXXX2700001" className="border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" name="explicit" className="size-4" /> Explícito
            </label>
          </div>
          <button type="submit" className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground md:col-span-5">
            Añadir track
          </button>
        </form>

        <div className="flex flex-col gap-8">
          {tracksWithSplits.map(({ track, splits }) => {
            const total = splits.reduce((sum, s) => sum + Number(s.percentage), 0)
            const addSplitForTrack = addSplit.bind(null, release.id, track.id)
            return (
              <div key={track.id} className="border border-border p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-display text-xl">
                      {track.track_number}. {track.title}
                    </span>
                    {track.isrc && <span className="ml-3 text-xs text-muted-foreground">{track.isrc}</span>}
                  </div>
                  <span className={total === 100 ? 'text-sm text-muted-foreground' : 'text-sm text-primary'}>
                    splits: {total}%{total !== 100 && ' — no suma 100'}
                  </span>
                </div>

                <ul className="mb-4 flex flex-col divide-y divide-border">
                  {splits.map((split) => (
                    <li key={split.id} className="flex items-center justify-between gap-4 py-2 text-sm">
                      <span>
                        {split.contributor_name} <span className="text-muted-foreground">· {split.role}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <span>{split.percentage}%</span>
                        <form action={deleteSplit.bind(null, release.id, split.id)}>
                          <button type="submit" className="text-muted-foreground hover:text-primary">
                            quitar
                          </button>
                        </form>
                      </div>
                    </li>
                  ))}
                  {splits.length === 0 && (
                    <li className="py-2 text-sm text-muted-foreground">Sin splits definidos todavía.</li>
                  )}
                </ul>

                <form action={addSplitForTrack} className="grid grid-cols-1 gap-3 md:grid-cols-5 md:items-end">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-muted-foreground">Nombre</label>
                    <input name="contributor_name" required className="border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-muted-foreground">Rol</label>
                    <input name="role" placeholder="artista / productor" className="border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-muted-foreground">%</label>
                    <input name="percentage" type="number" step="0.01" min={0.01} max={100} required className="border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <button type="submit" className="border border-border px-3 py-1.5 text-sm text-foreground hover:border-primary">
                    Añadir split
                  </button>
                </form>
              </div>
            )
          })}
          {tracks.length === 0 && <p className="text-sm text-muted-foreground">Todavía no hay tracks.</p>}
        </div>
      </section>

      {/* Links de streaming */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl">Links de streaming</h2>
        <ul className="flex flex-wrap gap-3 text-sm">
          {streamingLinks.map((link) => (
            <li key={link.id} className="border border-border px-3 py-1.5">
              {link.platform}
            </li>
          ))}
        </ul>
        <form action={addStreamingLink.bind(null, release.id)} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-muted-foreground">Plataforma</label>
            <input name="platform" placeholder="Spotify" required className="border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-xs text-muted-foreground">URL</label>
            <input name="href" placeholder="https://open.spotify.com/…" required className="w-full border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary" />
          </div>
          <button type="submit" className="border border-border px-3 py-1.5 text-sm hover:border-primary">
            Añadir
          </button>
        </form>
      </section>
    </div>
  )
}
