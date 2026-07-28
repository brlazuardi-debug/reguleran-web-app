import { View, Text } from 'react-native'
import { Inbox } from 'lucide-react-native'

interface EmptyStateProps {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Inbox size={48} color="#404040" />
      <Text className="text-white text-lg font-semibold mt-4">{title}</Text>
      {description && (
        <Text className="text-neutral-500 text-sm mt-1 text-center">{description}</Text>
      )}
    </View>
  )
}
