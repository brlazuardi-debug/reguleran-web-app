import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { Music, Activity } from 'lucide-react-native'

export default function ToolsScreen() {
  return (
    <View className="flex-1 bg-neutral-950 px-4 pt-4">
      <Text className="text-white text-lg font-bold mb-4">Tools</Text>

      <Link href="/(app)/tools/metronome" className="flex-row items-center bg-neutral-900 rounded-xl px-4 py-4 mb-2">
        <Music size={20} color="#fff" />
        <Text className="text-white ml-3 font-medium">Metronome</Text>
      </Link>

      <Link href="/(app)/tools/tuner" className="flex-row items-center bg-neutral-900 rounded-xl px-4 py-4">
        <Activity size={20} color="#fff" />
        <Text className="text-white ml-3 font-medium">Tuner</Text>
      </Link>
    </View>
  )
}
