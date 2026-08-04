import { useAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Drawer } from 'expo-router/drawer'
import DrawerContent from '../../components/navigation/DrawerContent'

export default function AppLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/(auth)/login')
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded || !isSignedIn) return null

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#0a0a0a' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: '700' },
        drawerType: 'front',
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="songs" options={{ title: 'Lagu', headerShown: false }} />
      <Drawer.Screen name="setlists" options={{ title: 'Setlist', headerShown: false }} />
      <Drawer.Screen name="sessions" options={{ title: 'Jadwal', headerShown: false }} />
      <Drawer.Screen name="proposals" options={{ title: 'Proposal', headerShown: false }} />
      <Drawer.Screen name="band-profile" options={{ title: 'Band Profile' }} />
      <Drawer.Screen name="settings" options={{ title: 'Pengaturan' }} />
    </Drawer>
  )
}
