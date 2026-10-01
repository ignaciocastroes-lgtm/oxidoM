import { ArtistCard } from '@/components/artist-card'
import type { Artist } from '@/lib/data'

const layout = [
  { size: 'large', span: 'md:col-span-7' },
  { size: 'small', span: 'md:col-span-5 md:self-end' },
  { size: 'small', span: 'md:col-span-5' },
  { size: 'large', span: 'md:col-span-7' },
] as const

export function RosterGrid({ artists }: { artists: Artist[] }) {
  return (
    <section id="roster" aria-labelledby="roster-title" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="mb-12 flex items-baseline justify-between gap-6 border-b border-border pb-6">
        <h2 id="roster-title" className="font-display text-5xl md:text-7xl">
          Roster
        </h2>
        <p className="text-sm text-muted-foreground">{`${artists.length} artistas`}</p>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-12">
        {artists.map((artist, index) => {
          const slot = layout[index % layout.length]
          return <ArtistCard key={artist.slug} artist={artist} size={slot.size} className={slot.span} />
        })}
      </div>
    </section>
  )
}
