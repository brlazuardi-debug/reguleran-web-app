import { View, Text } from 'react-native'

// ponytail: tuner placeholder — native tuner requires expo-audio or expo-av mic
// Real autocorrelation pitch detection will be in utils/pitchDetection.ts
export default function TunerScreen() {
  return (
    <View className="flex-1 bg-neutral-950 items-center justify-center px-4">
      <Text className="text-white text-lg font-bold mb-2">Tuner</Text>
      <Text className="text-neutral-500 text-sm text-center">
        Tuner akan tersedia di versi berikutnya.{'\n'}
        Gunakan web app atau tuner fisik untuk saat ini.
      </Text>
    </View>
  )
}
