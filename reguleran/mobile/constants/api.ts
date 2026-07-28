export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

export const ENDPOINTS = {
  songs: `${API_BASE_URL}/songs`,
  setlists: `${API_BASE_URL}/setlists`,
  sessions: `${API_BASE_URL}/sessions`,
  users: `${API_BASE_URL}/users`,
  library: `${API_BASE_URL}/library`,
} as const
