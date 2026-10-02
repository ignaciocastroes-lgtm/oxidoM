import { createClient } from '@/lib/supabase/server'
import type {
  AdminArtist,
  AdminRelease,
  AdminSplit,
  AdminTrack,
  Label,
  Profile,
  StreamingLink,
} from './types'

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data as Profile | null
}

/** El label que administra el usuario actual (RLS ya filtra por owner_id). */
export async function getOwnedLabel(): Promise<Label | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('labels').select('*').limit(1).maybeSingle()
  return data as Label | null
}

export async function getArtists(labelId: string): Promise<AdminArtist[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('artists')
    .select('*')
    .eq('label_id', labelId)
    .order('name', { ascending: true })
  return (data ?? []) as AdminArtist[]
}

export async function getReleases(labelId: string): Promise<AdminRelease[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('releases')
    .select('*')
    .eq('label_id', labelId)
    .order('release_date', { ascending: false })
  return (data ?? []) as AdminRelease[]
}

export async function getRelease(releaseId: string): Promise<AdminRelease | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('releases').select('*').eq('id', releaseId).single()
  return data as AdminRelease | null
}

export async function getReleaseArtists(releaseId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('release_artists')
    .select('role, artists (id, name, slug)')
    .eq('release_id', releaseId)
  return data ?? []
}

export async function getTracks(releaseId: string): Promise<AdminTrack[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tracks')
    .select('*')
    .eq('release_id', releaseId)
    .order('track_number', { ascending: true })
  return (data ?? []) as AdminTrack[]
}

export async function getSplits(trackId: string): Promise<AdminSplit[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('splits').select('*').eq('track_id', trackId)
  return (data ?? []) as AdminSplit[]
}

export async function getStreamingLinks(releaseId: string): Promise<StreamingLink[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('streaming_links').select('*').eq('release_id', releaseId)
  return (data ?? []) as StreamingLink[]
}

export async function findProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
  return data as Profile | null
}
