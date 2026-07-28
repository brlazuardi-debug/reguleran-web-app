import { TouchableOpacity } from 'react-native'
import { Menu } from 'lucide-react-native'
import { useNavigation } from 'expo-router'

export default function HamburgerButton() {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      className="ml-2 p-2"
      onPress={() => (navigation as any).toggleDrawer?.()}
    >
      <Menu size={22} color="#fff" />
    </TouchableOpacity>
  )
}
