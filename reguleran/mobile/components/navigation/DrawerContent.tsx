import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { useRouter, usePathname } from 'expo-router'
import {
  LayoutDashboard, Music, List, Calendar, File, User, SlidersHorizontal, Settings, LogOut
} from 'lucide-react-native'

const NAV_ITEMS = [
  { route: 'index', label: 'Dashboard', icon: LayoutDashboard },
  { route: 'songs', label: 'Lagu', icon: Music },
  { route: 'setlists', label: 'Setlist', icon: List },
  { route: 'sessions', label: 'Jadwal', icon: Calendar },
  { route: 'proposals', label: 'Proposal', icon: File },
  { route: 'band-profile', label: 'Band Profile', icon: User },
  { route: 'settings', label: 'Pengaturan', icon: Settings },
]

export default function DrawerContent({ navigation }: { navigation: any }) {
  const { user } = useUser()
  const { signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()

  const activeRoute = NAV_ITEMS.find((item) => pathname === `/${item.route}` || pathname.startsWith(`/${item.route}/`))

  return (
    <View className="flex-1 bg-[#0a0a0a]" style={{ paddingTop: insets.top }}>
      {/* Profile */}
      <View className="px-5 py-6 border-b border-neutral-800">
        <View className="w-12 h-12 bg-neutral-800 rounded-full items-center justify-center mb-3">
          <Text className="text-white text-lg font-bold">
            {user?.fullName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text className="text-white font-semibold text-base" numberOfLines={1}>
          {user?.fullName || 'Pengguna'}
        </Text>
        <Text className="text-neutral-500 text-sm mt-0.5" numberOfLines={1}>
          {user?.emailAddresses?.[0]?.emailAddress || ''}
        </Text>
      </View>

      {/* Nav Items */}
      <ScrollView className="flex-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeRoute?.route === item.route
          return (
            <TouchableOpacity
              key={item.route}
              className={`flex-row items-center gap-3 px-3 py-3.5 rounded-xl mb-0.5 ${isActive ? 'bg-neutral-800' : ''}`}
              onPress={() => {
                router.push(`/(app)/${item.route}`)
                navigation.closeDrawer()
              }}
            >
              <Icon size={20} color={isActive ? '#fff' : '#525252'} />
              <Text className={`text-sm font-medium ${isActive ? 'text-white' : 'text-neutral-500'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Logout */}
      <View className="px-3 pb-4 border-t border-neutral-800 pt-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <TouchableOpacity
          className="flex-row items-center gap-3 px-3 py-3.5 rounded-xl"
          onPress={async () => {
            await signOut()
            router.replace('/(auth)/login')
          }}
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-red-500 text-sm font-medium">Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
