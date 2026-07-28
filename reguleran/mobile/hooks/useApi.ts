import { useState, useCallback } from 'react'
import { useApiToken } from '../services/auth'
import { apiRequest } from '../services/api'

export function useApi<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const getToken = useApiToken()

  const execute = useCallback(
    async (
      endpoint: string,
      options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown } = {}
    ): Promise<T | null> => {
      setLoading(true)
      setError(null)
      try {
        const token = await getToken()
        const { data, error: apiError } = await apiRequest<T>(endpoint, {
          ...options,
          token,
        })
        if (apiError) {
          setError(apiError)
          return null
        }
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
        return null
      } finally {
        setLoading(false)
      }
    },
    [getToken]
  )

  return { execute, loading, error }
}
