import { Stack } from 'expo-router'
import HamburgerButton from '../../../components/navigation/HamburgerButton'

export default function SongsLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#0a0a0a' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: '700' },
      headerLeft: () => <HamburgerButton />,
    }}>
      <Stack.Screen name="index" options={{ title: 'Lagu' }} />
      <Stack.Screen name="new" options={{ title: 'Tambah Lagu' }} />
      <Stack.Screen name="[id]/index" options={{ title: '' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Lagu' }} />
    </Stack>
  )
}
