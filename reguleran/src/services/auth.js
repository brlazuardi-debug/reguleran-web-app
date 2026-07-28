function mapUser(clerkUser) {
  if (!clerkUser) return null
  return {
    uid: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    displayName: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
    avatarUrl: clerkUser.imageUrl || null,
  }
}

function mapAuthError(error) {
  if (!error) return null
  const msg = error.message?.toLowerCase() || ''
  if (msg.includes('invalid') && msg.includes('password')) return 'Email atau password salah'
  if (msg.includes('not found')) return 'Akun tidak ditemukan'
  if (msg.includes('already exists') || msg.includes('already in use')) return 'Email sudah terdaftar'
  if (msg.includes('network') || msg.includes('fetch')) return 'Koneksi internet bermasalah. Coba lagi.'
  if (msg.includes('rate limit')) return 'Terlalu banyak percobaan. Coba beberapa saat lagi.'
  if (msg.includes('weak')) return 'Password terlalu lemah. Minimal 6 karakter.'
  if (msg.includes('requires')) return 'Verifikasi email diperlukan. Cek inbox Anda.'
  return error.message || 'Terjadi kesalahan'
}

export { mapUser, mapAuthError }
