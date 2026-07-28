import { Stack } from 'expo-router'
import HamburgerButton from '../../../components/navigation/HamburgerButton'

export default function ProposalsLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#0a0a0a' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="index" options={{
        title: 'Proposal',
        headerLeft: () => <HamburgerButton />,
      }} />
      <Stack.Screen name="new" options={{ title: 'Proposal Baru' }} />
      <Stack.Screen name="[id]/index" options={{ title: '' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Edit Proposal' }} />
    </Stack>
  )
}
