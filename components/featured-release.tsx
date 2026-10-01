import { PhotoPlaceholder } from '@/components/photo-placeholder'
import type { Release } from '@/lib/data'

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}

export function FeaturedRelease({ release }: { release: Release }) {
  const credits = [release.primaryArtist, ...release.featuredArtists]

  return (
    <section
      id="lanzamiento"
      aria-labelledby="release-title"
      className="border-t border-border"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-20 md:grid-cols-2 md:gap-12 md:px-8 md:py-28">
        <PhotoPlaceholder
          label="carátula — reemplazar"
          src={release.coverUrl}
          alt={`Carátula de referencia de ${release.title}`}
          credit="Carátula de referencia — sustituir"
          className="aspect-square w-full"
        />
        <div className="flex flex-col justify-center gap-8">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Lanzamiento destacado
          </p>
          <div className="flex flex-col gap-4">
            <h2 id="release-title" className="text-balance font-display text-6xl md:text-8xl">
              {release.title}
            </h2>
            <p className="text-lg leading-relaxed">
              {release.primaryArtist}
              {release.featuredArtists.length > 0 && (
                <span className="text-muted-foreground">{` con ${release.featuredArtists.join(', ')}`}</span>
              )}
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-6 border-y border-border py-6 text-sm">
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Formato</dt>
              <dd className="font-medium capitalize">{release.format}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-muted-foreground">Fecha</dt>
              <dd className="font-medium">
                <time dateTime={release.releaseDate}>{formatDate(release.releaseDate)}</time>
              </dd>
            </div>
          </dl>
          <ul className="flex flex-wrap gap-x-8 gap-y-3" aria-label={`Escuchar ${release.title} de ${credits.join(' y ')}`}>
            {release.links.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-primary decoration-1 underline-offset-[6px] transition-colors hover:text-primary"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
