const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
}

export async function uploadAudioToCloudinary(
  localUri: string,
  fileName: string
): Promise<{ url: string; publicId: string } | null> {
  try {
    const formData = new FormData()
    formData.append('file', {
      uri: localUri,
      type: 'audio/mpeg',
      name: fileName,
    } as unknown as Blob)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('resource_type', 'video')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
      { method: 'POST', body: formData }
    )

    if (!res.ok) return null
    const data: CloudinaryUploadResult = await res.json()
    return { url: data.secure_url, publicId: data.public_id }
  } catch {
    return null
  }
}
