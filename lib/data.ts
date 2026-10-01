// Datos mock del sello. Para conectar una API, reemplaza el cuerpo de las
// funciones `get*` por un `fetch` que devuelva el mismo tipo; los componentes
// no necesitan cambios.

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type Artist = {
  /** Identificador estable, útil como key y para futuras rutas /artistas/[slug] */
  slug: string
  name: string
  genres: string[]
  /** URL de la foto. Si falta, se muestra el placeholder punteado. */
  photoUrl?: string
}

export type StreamingPlatform = 'Spotify' | 'Apple Music' | 'YouTube Music'

export type StreamingLink = {
  platform: StreamingPlatform
  href: string
}

export type ReleaseFormat = 'sencillo' | 'EP' | 'álbum'

export type Release = {
  title: string
  primaryArtist: Artist['name']
  featuredArtists: Artist['name'][]
  format: ReleaseFormat
  /** Fecha ISO `YYYY-MM-DD` */
  releaseDate: string
  /** URL de la carátula. Si falta, se muestra el placeholder punteado. */
  coverUrl?: string
  links: StreamingLink[]
}

export type SocialPlatform = 'Instagram' | 'YouTube' | 'TikTok'

export type SocialLink = {
  label: SocialPlatform
  href: string
}

export type NavLink = {
  label: string
  href: `#${string}`
}

/* ------------------------------------------------------------------ */
/* Datos mock                                                          */
/* ------------------------------------------------------------------ */

export const artists: Artist[] = [
  {
    slug: 'kalle-nocturno',
    name: 'Kalle Nocturno',
    genres: ['trap', 'rap'],
    photoUrl: 'https://picsum.photos/seed/oxido-kalle-nocturno/1000/750',
  },
  {
    slug: 'mara-acida',
    name: 'Mara Ácida',
    genres: ['afrobeats', 'rap'],
    photoUrl: 'https://picsum.photos/seed/oxido-mara-acida/900/1080',
  },
  {
    slug: 'jefe-element',
    name: 'Jefe Element',
    genres: ['hip-hop', 'boom bap'],
    photoUrl: 'https://picsum.photos/seed/oxido-jefe-element/900/1080',
  },
  {
    slug: 'luz-marea',
    name: 'Luz Marea',
    genres: ['afro', 'trap'],
    photoUrl: 'https://picsum.photos/seed/oxido-luz-marea/1000/750',
  },
]

export const featuredRelease: Release = {
  title: 'Humo y Asfalto',
  primaryArtist: 'Kalle Nocturno',
  featuredArtists: ['Mara Ácida'],
  format: 'sencillo',
  releaseDate: '2027-03-15',
  coverUrl: 'https://picsum.photos/seed/oxido-humo-y-asfalto/1200/1200',
  links: [
    { platform: 'Spotify', href: 'https://open.spotify.com' },
    { platform: 'Apple Music', href: 'https://music.apple.com' },
    { platform: 'YouTube Music', href: 'https://music.youtube.com' },
  ],
}

export const contactEmail = 'hola@oxido.co'

export const socialLinks: SocialLink[] = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'YouTube', href: 'https://youtube.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
]

export const navLinks: NavLink[] = [
  { label: 'Roster', href: '#roster' },
  { label: 'Lanzamientos', href: '#lanzamiento' },
  { label: 'Sobre el sello', href: '#sello' },
  { label: 'Contacto', href: '#contacto' },
]

/* ------------------------------------------------------------------ */
/* Acceso a datos — punto único a reemplazar por fetch                 */
/* ------------------------------------------------------------------ */

export async function getArtists(): Promise<Artist[]> {
  return artists
}

export async function getFeaturedRelease(): Promise<Release> {
  return featuredRelease
}

export async function getContact(): Promise<{ email: string; socials: SocialLink[] }> {
  return { email: contactEmail, socials: socialLinks }
}
