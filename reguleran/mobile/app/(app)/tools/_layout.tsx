import { Stack } from 'expo-router'
import HamburgerButton from '../../../components/navigation/HamburgerButton'

export default function ToolsLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#0a0a0a' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="index" options={{
        title: 'Alat Musik',
        headerLeft: () => <HamburgerButton />,
      }} />
      <Stack.Screen name="tuner" options={{ title: 'Tuner' }} />
      <Stack.Screen name="metronome" options={{ title: 'Metronome' }} />
    </Stack>
  )
}
