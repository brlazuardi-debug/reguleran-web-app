const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadAudio(songId, file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('public_id', `audio/${songId}`)

  // ponytail: XHR for progress, fetch doesn't support upload progress
  const xhr = new XMLHttpRequest()
  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve({ url: data.secure_url, fileName: data.public_id })
      } else reject(new Error('Upload failed'))
    }
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`)
    xhr.send(formData)
  })
}

export async function getAudioUrl(songId) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/audio/${songId}`
}

export async function deleteAudio(songId) {
  // ponytail: delete via server since Cloudinary Admin API needs API Secret
  const token = await window.Clerk?.session?.getToken()
  if (!token) return
  try {
    await fetch(`${import.meta.env.VITE_API_URL || '/api'}/audio/audio/${songId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch { /* ignore */ }
}
