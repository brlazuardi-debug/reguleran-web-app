import { View, Text } from 'react-native'
import { transposeLyrics } from '../../utils/transpose'

interface ChordDisplayProps {
  lines: string[]
  transpose: number
}

export default function ChordDisplay({ lines, transpose }: ChordDisplayProps) {
  const transposed = transpose !== 0
    ? transposeLyrics(lines.join('\n'), transpose)
    : lines.join('\n')

  return (
    <View className="py-2">
      {transposed.split('\n').map((line, i) => (
        <Text key={i} className="text-neutral-300 text-base leading-7 font-mono">
          {line}
        </Text>
      ))}
    </View>
  )
}
