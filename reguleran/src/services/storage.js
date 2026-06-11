import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { getFirebaseStorage, isConfigured } from './firebase'

export async function uploadAudio(songId, file, onProgress) {
  if (!isConfigured()) throw new Error('Firebase not configured')

  const storage = getFirebaseStorage()
  if (!storage) throw new Error('Storage not available')

  const fileExt = file.name.split('.').pop() || 'mp3'
  const fileName = `${songId}.${fileExt}`
  const storageRef = ref(storage, `audio/${fileName}`)

  const task = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(pct)
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve({ url, fileName })
      }
    )
  })
}

export async function getAudioUrl(songId) {
  if (!isConfigured()) return null

  const storage = getFirebaseStorage()
  if (!storage) return null

  try {
    const storageRef = ref(storage, `audio/${songId}.mp3`)
    return await getDownloadURL(storageRef)
  } catch {
    try {
      const storageRef = ref(storage, `audio/${songId}.wav`)
      return await getDownloadURL(storageRef)
    } catch {
      try {
        const storageRef = ref(storage, `audio/${songId}.ogg`)
        return await getDownloadURL(storageRef)
      } catch {
        return null
      }
    }
  }
}

export async function deleteAudio(songId) {
  if (!isConfigured()) return

  const storage = getFirebaseStorage()
  if (!storage) return

  const extensions = ['mp3', 'wav', 'ogg']
  for (const ext of extensions) {
    try {
      const storageRef = ref(storage, `audio/${songId}.${ext}`)
      await deleteObject(storageRef)
    } catch {
      // file doesn't exist, try next extension
    }
  }
}
