export type Profile = {
  id: string
  username: string
  full_name: string | null
  role: 'admin' | 'artist'
}

export type Label = {
  id: string
  owner_id: string
  name: string
  isrc_prefix: string | null
}

export type AdminArtist = {
  id: string
  label_id: string
  user_id: string | null
  slug: string
  name: string
  genres: string[]
  photo_url: string | null
  bio: string | null
  is_public: boolean
}

export type ReleaseStatus = 'borrador' | 'en_revision' | 'distribuido' | 'publicado'

export type AdminRelease = {
  id: string
  label_id: string
  title: string
  format: 'sencillo' | 'ep' | 'album'
  release_date: string
  cover_url: string | null
  upc: string | null
  status: ReleaseStatus
}

export type AdminTrack = {
  id: string
  release_id: string
  title: string
  isrc: string | null
  track_number: number
  duration_seconds: number | null
  explicit: boolean
}

export type AdminSplit = {
  id: string
  track_id: string
  artist_id: string | null
  contributor_name: string
  role: string
  percentage: number
  payout_email: string | null
}

export type StreamingLink = {
  id: string
  release_id: string
  platform: string
  href: string
}
