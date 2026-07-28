import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native'

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!isLoaded) return
    setLoading(true)
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password,
      })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(app)')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      Alert.alert('Login Gagal', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-white text-3xl font-bold mb-2">Reguleran</Text>
        <Text className="text-neutral-400 mb-8">Masuk ke akun Anda</Text>

        <TextInput
          className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white mb-4"
          placeholder="Email"
          placeholderTextColor="#525252"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white mb-6"
          placeholder="Password"
          placeholderTextColor="#525252"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className={`rounded-xl py-4 items-center ${loading ? 'bg-neutral-700' : 'bg-white'}`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className={`font-semibold text-base ${loading ? 'text-neutral-400' : 'text-black'}`}>
            {loading ? 'Masuk...' : 'Masuk'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => router.push('/(auth)/register')}
        >
          <Text className="text-neutral-400">
            Belum punya akun? <Text className="text-white font-semibold">Daftar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
