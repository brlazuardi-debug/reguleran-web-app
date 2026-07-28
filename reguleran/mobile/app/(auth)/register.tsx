import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native'

export default function RegisterScreen() {
  const { signUp, setActive, isLoaded } = useSignUp()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [loading, setLoading] = useState(false)

  async function handleSignUp() {
    if (!isLoaded) return
    setLoading(true)
    try {
      await signUp.create({ emailAddress: email.trim(), password })
      await signUp.prepareEmailAddressVerification()
      setStep('otp')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      Alert.alert('Gagal Daftar', msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify() {
    if (!isLoaded) return
    setLoading(true)
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/(app)')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      Alert.alert('Verifikasi Gagal', msg)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-neutral-950"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 justify-center px-6">
          <Text className="text-white text-3xl font-bold mb-2">Verifikasi Email</Text>
          <Text className="text-neutral-400 mb-8">Masukkan kode OTP yang dikirim ke email Anda</Text>

          <TextInput
            className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white mb-6 text-center text-2xl tracking-widest"
            placeholder="000000"
            placeholderTextColor="#525252"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
          />

          <TouchableOpacity
            className={`rounded-xl py-4 items-center ${loading ? 'bg-neutral-700' : 'bg-white'}`}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text className={`font-semibold text-base ${loading ? 'text-neutral-400' : 'text-black'}`}>
              {loading ? 'Memverifikasi...' : 'Verifikasi'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-950"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-white text-3xl font-bold mb-2">Daftar</Text>
        <Text className="text-neutral-400 mb-8">Buat akun Reguleran</Text>

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
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className={`font-semibold text-base ${loading ? 'text-neutral-400' : 'text-black'}`}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => router.push('/(auth)/login')}
        >
          <Text className="text-neutral-400">
            Sudah punya akun? <Text className="text-white font-semibold">Masuk</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}
