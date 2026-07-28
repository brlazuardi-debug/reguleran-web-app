import { TouchableOpacity, View, Text } from 'react-native'
import { ChevronRight } from 'lucide-react-native'
import type { Song } from '../../types'

interface SongCardProps {
  song: Song
  onPress: () => void
}

export default function SongCard({ song, onPress }: SongCardProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4 border-b border-neutral-800 active:bg-neutral-900"
      onPress={onPress}
    >
      <View className="flex-1">
        <Text className="text-white font-medium text-base">{song.title}</Text>
        {song.artist && (
          <Text className="text-neutral-500 text-sm mt-0.5">{song.artist}</Text>
        )}
        <View className="flex-row gap-3 mt-1.5">
          {song.key && <Text className="text-neutral-600 text-xs">{song.key}</Text>}
          {song.bpm && <Text className="text-neutral-600 text-xs">{song.bpm} BPM</Text>}
        </View>
      </View>
      <ChevronRight size={18} color="#525252" />
    </TouchableOpacity>
  )
}
