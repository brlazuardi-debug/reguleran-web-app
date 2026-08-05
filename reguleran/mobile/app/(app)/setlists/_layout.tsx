import { Stack } from 'expo-router'
import HamburgerButton from '../../../components/navigation/HamburgerButton'

export default function SetlistsLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#0a0a0a' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: '700' },
      headerLeft: () => <HamburgerButton />,
    }}>
      <Stack.Screen name="index" options={{ title: 'Setlist' }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  )
}
