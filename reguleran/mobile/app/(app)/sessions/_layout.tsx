import { Stack } from 'expo-router'
import HamburgerButton from '../../../components/navigation/HamburgerButton'

export default function SessionsLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#0a0a0a' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: '700' },
      headerLeft: () => <HamburgerButton />,
    }}>
      <Stack.Screen name="index" options={{ title: 'Jadwal' }} />
      <Stack.Screen name="new" options={{ title: 'Tambah Jadwal' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
      <Stack.Screen name="[id]/rider" options={{ title: 'Rider & RAB' }} />
    </Stack>
  )
}
