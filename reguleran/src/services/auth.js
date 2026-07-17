import { supabase } from './supabase'

function mapUser(supabaseUser) {
  if (!supabaseUser) return null
  return {
    uid: supabaseUser.id,
    email: supabaseUser.email,
    displayName: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0] || '',
    avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
  }
}

function mapAuthError(error) {
  if (!error) return null
  const msg = error.message?.toLowerCase() || ''
  if (msg.includes('invalid login credentials')) return 'Email atau password salah'
  if (msg.includes('email not confirmed')) return 'Email belum dikonfirmasi. Silakan cek inbox Anda.'
  if (msg.includes('already regist')) return 'Email sudah terdaftar'
  if (msg.includes('user already')) return 'Email sudah terdaftar'
  if (msg.includes('network') || msg.includes('fetch')) return 'Koneksi internet bermasalah. Coba lagi.'
  if (msg.includes('rate limit')) return 'Terlalu banyak percobaan. Coba beberapa saat lagi.'
  if (msg.includes('weak_password')) return 'Password terlalu lemah. Minimal 6 karakter.'
  return error.message
}

export function init() {
  return () => { /* noop */ }
}

export function onAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(mapUser(session?.user || null))
  })
  supabase.auth.getUser().then(({ data }) => {
    callback(mapUser(data?.user || null))
  })
  return () => subscription?.unsubscribe()
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(mapAuthError(error))
  return mapUser(data.user)
}

export async function register(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || email.split('@')[0] },
    },
  })
  if (error) throw new Error(mapAuthError(error))
  if (!data.user) throw new Error('Email konfirmasi telah dikirim. Silakan cek inbox Anda.')
  return mapUser(data.user)
}

export async function googleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
  if (error) throw new Error(mapAuthError(error))
  return null
}

export const signInWithGoogle = googleLogin

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return mapUser(data?.user || null)
}
