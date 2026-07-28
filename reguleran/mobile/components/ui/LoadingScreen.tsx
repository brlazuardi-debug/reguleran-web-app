import { View, ActivityIndicator } from 'react-native'

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-neutral-950 items-center justify-center">
      <ActivityIndicator color="#ffffff" size="large" />
    </View>
  )
}
