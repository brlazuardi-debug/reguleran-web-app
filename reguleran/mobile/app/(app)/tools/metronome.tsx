import { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

// ponytail: simple metronome using setInterval + visual flash
export default function MetronomeScreen() {
  const [bpm, setBpm] = useState(120)
  const [isPlaying, setIsPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function togglePlay() {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsPlaying(false)
      setBeat(0)
    } else {
      setIsPlaying(true)
      setBeat(1)
      const interval = 60000 / bpm
      intervalRef.current = setInterval(() => {
        setBeat((p) => (p % 4) + 1)
      }, interval)
    }
  }

  return (
    <View className="flex-1 bg-neutral-950 items-center justify-center px-4">
      <Text className="text-white text-6xl font-bold mb-8">{bpm}</Text>

      <View className="flex-row gap-3 mb-8">
        <TouchableOpacity
          className="bg-neutral-900 rounded-xl px-6 py-3"
          onPress={() => setBpm(Math.max(40, bpm - 5))}
        >
          <Text className="text-white text-2xl font-bold">-</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold self-center">BPM</Text>
        <TouchableOpacity
          className="bg-neutral-900 rounded-xl px-6 py-3"
          onPress={() => setBpm(Math.min(240, bpm + 5))}
        >
          <Text className="text-white text-2xl font-bold">+</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-2 mb-8">
        {[1, 2, 3, 4].map((b) => (
          <View
            key={b}
            className={`w-4 h-4 rounded-full ${beat === b ? 'bg-white' : 'bg-neutral-800'}`}
          />
        ))}
      </View>

      <TouchableOpacity
        className={`w-20 h-20 rounded-full items-center justify-center ${isPlaying ? 'bg-red-600' : 'bg-white'}`}
        onPress={togglePlay}
      >
        <Text className={`text-2xl ${isPlaying ? 'text-white' : 'text-black'}`}>
          {isPlaying ? '■' : '▶'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}
