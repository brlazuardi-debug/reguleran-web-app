import { useAuth } from '@clerk/clerk-expo'

export function useApiToken() {
  const { getToken } = useAuth()
  return async () => {
    const token = await getToken()
    if (!token) throw new Error('No active session — please login again')
    return token
  }
}
