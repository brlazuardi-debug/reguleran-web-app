import { supabase } from './supabase'

const BUCKET = 'audio'

export async function uploadAudio(songId, file, onProgress) {
  const ext = file.name.split('.').pop() || 'mp3'
  const path = `audio/${songId}.${ext}`
  onProgress?.(0)
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'audio/mpeg',
  })
  if (error) throw error
  onProgress?.(100)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, fileName: path }
}

export async function getAudioUrl(songId) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(`audio/${songId}.mp3`)
  return data?.publicUrl || null
}

export async function deleteAudio(songId) {
  const extensions = ['mp3', 'wav', 'ogg']
  await Promise.all(extensions.map(async (ext) => {
    const { error } = await supabase.storage.from(BUCKET).remove([`audio/${songId}.${ext}`])
    // ignore errors (file might not exist)
    if (error) { /* ignore */ }
  }))
}
