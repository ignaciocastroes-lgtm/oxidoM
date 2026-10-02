'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { findProfileByUsername } from './queries'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* -------------------------------------------------------------------- */
/* Label                                                                  */
/* -------------------------------------------------------------------- */

export async function createLabel(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const isrcPrefix = String(formData.get('isrc_prefix') ?? '').trim() || null
  if (!name) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('labels').insert({ owner_id: user!.id, name, isrc_prefix: isrcPrefix })
  revalidatePath('/admin')
}

/* -------------------------------------------------------------------- */
/* Artistas                                                              */
/* -------------------------------------------------------------------- */

export async function createArtist(labelId: string, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const genres = String(formData.get('genres') ?? '')
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean)
  if (!name) return

  const supabase = await createClient()
  await supabase.from('artists').insert({
    label_id: labelId,
    name,
    slug: slugify(name),
    genres,
  })

  revalidatePath('/admin/artistas')
}

/**
 * "Asigna un nombre de usuario": vincula un artista ya creado con una cuenta
 * de Supabase existente, buscando por el username de su perfil. Desde ese
 * momento esa persona entra a /admin y ve (solo) su propio artista, sus
 * releases y su propio split — nunca el de los demás (lo impone RLS).
 */
export async function linkArtistToUsername(artistId: string, formData: FormData) {
  const username = String(formData.get('username') ?? '').trim()
  if (!username) return

  const profile = await findProfileByUsername(username)
  if (!profile) {
    redirect(`/admin/artistas?error=${encodeURIComponent(`No existe el usuario "${username}".`)}`)
  }

  const supabase = await createClient()
  await supabase.from('artists').update({ user_id: profile!.id }).eq('id', artistId)
  revalidatePath('/admin/artistas')
}

export async function toggleArtistPublic(artistId: string, isPublic: boolean) {
  const supabase = await createClient()
  await supabase.from('artists').update({ is_public: isPublic }).eq('id', artistId)
  revalidatePath('/admin/artistas')
}

/* -------------------------------------------------------------------- */
/* Lanzamientos                                                          */
/* -------------------------------------------------------------------- */

export async function createRelease(labelId: string, formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const format = String(formData.get('format') ?? 'sencillo')
  const releaseDate = String(formData.get('release_date') ?? '')
  const primaryArtistId = String(formData.get('primary_artist_id') ?? '')
  if (!title || !releaseDate || !primaryArtistId) return

  const supabase = await createClient()
  const { data: release, error } = await supabase
    .from('releases')
    .insert({ label_id: labelId, title, format, release_date: releaseDate })
    .select('id')
    .single()

  if (error || !release) return

  await supabase
    .from('release_artists')
    .insert({ release_id: release.id, artist_id: primaryArtistId, role: 'primario' })

  revalidatePath('/admin/lanzamientos')
  redirect(`/admin/lanzamientos/${release.id}`)
}

export async function updateReleaseStatus(releaseId: string, formData: FormData) {
  const status = String(formData.get('status') ?? '')
  const supabase = await createClient()
  await supabase.from('releases').update({ status }).eq('id', releaseId)
  revalidatePath(`/admin/lanzamientos/${releaseId}`)
}

export async function updateReleaseMeta(releaseId: string, formData: FormData) {
  const coverUrl = String(formData.get('cover_url') ?? '').trim() || null
  const upc = String(formData.get('upc') ?? '').trim() || null
  const supabase = await createClient()
  await supabase.from('releases').update({ cover_url: coverUrl, upc }).eq('id', releaseId)
  revalidatePath(`/admin/lanzamientos/${releaseId}`)
}

export async function addFeaturedArtist(releaseId: string, formData: FormData) {
  const artistId = String(formData.get('artist_id') ?? '')
  if (!artistId) return
  const supabase = await createClient()
  await supabase
    .from('release_artists')
    .insert({ release_id: releaseId, artist_id: artistId, role: 'invitado' })
  revalidatePath(`/admin/lanzamientos/${releaseId}`)
}

export async function addStreamingLink(releaseId: string, formData: FormData) {
  const platform = String(formData.get('platform') ?? '').trim()
  const href = String(formData.get('href') ?? '').trim()
  if (!platform || !href) return
  const supabase = await createClient()
  await supabase.from('streaming_links').insert({ release_id: releaseId, platform, href })
  revalidatePath(`/admin/lanzamientos/${releaseId}`)
}

/* -------------------------------------------------------------------- */
/* Tracks                                                                 */
/* -------------------------------------------------------------------- */

export async function createTrack(releaseId: string, formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const isrc = String(formData.get('isrc') ?? '').trim() || null
  const trackNumber = Number(formData.get('track_number') ?? 1)
  const explicit = formData.get('explicit') === 'on'
  if (!title) return

  const supabase = await createClient()
  await supabase.from('tracks').insert({
    release_id: releaseId,
    title,
    isrc,
    track_number: trackNumber,
    explicit,
  })

  revalidatePath(`/admin/lanzamientos/${releaseId}`)
}

/* -------------------------------------------------------------------- */
/* Splits                                                                 */
/* -------------------------------------------------------------------- */

export async function addSplit(releaseId: string, trackId: string, formData: FormData) {
  const contributorName = String(formData.get('contributor_name') ?? '').trim()
  const role = String(formData.get('role') ?? 'artista').trim()
  const percentage = Number(formData.get('percentage') ?? 0)
  const artistId = String(formData.get('artist_id') ?? '') || null
  const payoutEmail = String(formData.get('payout_email') ?? '').trim() || null
  if (!contributorName || percentage <= 0) return

  const supabase = await createClient()
  await supabase.from('splits').insert({
    track_id: trackId,
    artist_id: artistId,
    contributor_name: contributorName,
    role,
    percentage,
    payout_email: payoutEmail,
  })

  revalidatePath(`/admin/lanzamientos/${releaseId}`)
}

export async function deleteSplit(releaseId: string, splitId: string) {
  const supabase = await createClient()
  await supabase.from('splits').delete().eq('id', splitId)
  revalidatePath(`/admin/lanzamientos/${releaseId}`)
}
