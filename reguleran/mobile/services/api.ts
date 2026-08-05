import { API_BASE_URL } from '../constants/api'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface ApiOptions {
  method?: Method
  body?: unknown
  token: string
}

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export async function apiRequest<T>(
  endpoint: string,
  { method = 'GET', body, token }: ApiOptions
): Promise<ApiResponse<T>> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Server error' }))
      return { data: null, error: err.message ?? `HTTP ${res.status}` }
    }

    const data: T = await res.json()
    return { data, error: null }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    return { data: null, error: message }
  }
}
