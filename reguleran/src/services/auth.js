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

function waitForClerk() {
  return new Promise((resolve) => {
    if (window.Clerk?.client) return resolve()
    const check = setInterval(() => {
      if (window.Clerk?.client) { clearInterval(check); resolve() }
    }, 100)
  })
}

export function init() {
  // ponytail: Clerk is initialized by <ClerkProvider> in App.jsx
  return () => {}
}

export function onAuthChange(callback) {
  let unsub = () => {}
  waitForClerk().then(() => {
    const user = window.Clerk.user
    callback(mapUser(user || null))
    // ponytail: poll for auth state since Clerk React doesn't expose imperative listener
    const check = setInterval(() => {
      const current = window.Clerk.user
      callback(mapUser(current || null))
    }, 2000)
    unsub = () => clearInterval(check)
  })
  return () => unsub()
}

export async function login(email, password) {
  await waitForClerk()
  try {
    const signIn = await window.Clerk.client.signIn.create({ identifier: email, password })
    if (signIn.status !== 'complete') throw new Error('Verifikasi diperlukan')
    return mapUser(window.Clerk.user)
  } catch (e) {
    throw new Error(mapAuthError(e), { cause: e })
  }
}

export async function register(email, password, displayName) {
  await waitForClerk()
  try {
    const signUp = await window.Clerk.client.signUp.create({
      emailAddress: email,
      password,
      firstName: displayName || email.split('@')[0],
    })
    if (signUp.status !== 'complete') throw new Error('Verifikasi email diperlukan')
    return mapUser(window.Clerk.user)
  } catch (e) {
    throw new Error(mapAuthError(e), { cause: e })
  }
}

export async function googleLogin() {
  await waitForClerk()
  await window.Clerk.client.signIn.authenticateWithRedirect({
    strategy: 'oauth_google',
    redirectUrl: window.location.origin + '/oauth-callback',
    redirectUrlComplete: window.location.origin + '/app',
  })
}

export const signInWithGoogle = googleLogin

export async function logout() {
  await waitForClerk()
  await window.Clerk.signOut()
}

export async function getUser() {
  await waitForClerk()
  return mapUser(window.Clerk.user || null)
}
