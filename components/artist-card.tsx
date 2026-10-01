import { PhotoPlaceholder } from '@/components/photo-placeholder'
import type { Artist } from '@/lib/data'
import { cn } from '@/lib/utils'

type ArtistCardProps = {
  artist: Artist
  size: 'large' | 'small'
  className?: string
}

export function ArtistCard({ artist, size, className }: ArtistCardProps) {
  return (
    <article className={cn('flex flex-col gap-4', className)}>
      <PhotoPlaceholder
        label="foto de artista — reemplazar"
        src={artist.photoUrl}
        alt={`Foto de referencia de ${artist.name}`}
        credit="Foto de referencia — sustituir"
        className={size === 'large' ? 'aspect-[4/3]' : 'aspect-[4/3] md:aspect-[5/6]'}
      />
      <div className="flex flex-col gap-2">
        <h3 className={cn('font-display', size === 'large' ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl')}>
          {artist.name}
        </h3>
        <p className="text-base text-muted-foreground">{artist.genres.join(' / ')}</p>
      </div>
    </article>
  )
}
