import * as SecureStore from 'expo-secure-store'

// ponytail: inline TokenCache type instead of importing from internal path
interface TokenCache {
  getToken(key: string): Promise<string | null>
  saveToken(key: string, value: string): Promise<void>
  clearToken(key: string): Promise<void>
}

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key)
    } catch {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value)
    } catch {}
  },
  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key)
    } catch {}
  },
}
