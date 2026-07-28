import { useState, useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity
} from 'react-native'
import { Audio } from 'expo-av'
import { Play, Pause, Upload } from 'lucide-react-native'

interface PitchShifterPanelProps {
  audioUrl: string | null
  onUpload?: () => void
}

// ponytail: MVP audio player with play/pause/seek.
// Pitch shifting deferred - use web app for actual pitch shift.
export default function PitchShifterPanel({ audioUrl, onUpload }: PitchShifterPanelProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [sound])

  async function loadAudio(url: string) {
    if (sound) await sound.unloadAsync()
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: false }
    )
    setSound(newSound)
    const status = await newSound.getStatusAsync()
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0)
    }
  }

  useEffect(() => {
    if (audioUrl) loadAudio(audioUrl)
  }, [audioUrl])

  async function togglePlayPause() {
    if (!sound) return
    if (isPlaying) {
      await sound.pauseAsync()
      if (intervalRef.current) clearInterval(intervalRef.current)
    } else {
      await sound.playAsync()
      intervalRef.current = setInterval(async () => {
        const status = await sound.getStatusAsync()
        if (status.isLoaded) setPosition(status.positionMillis || 0)
      }, 500)
    }
    setIsPlaying(!isPlaying)
  }

  // ponytail: simple progress bar by fractional width, no drag slider dep
  const progress = duration > 0 ? position / duration : 0

  function formatTime(ms: number) {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  if (!audioUrl) {
    return (
      <View className="mb-4">
        <Text className="text-neutral-400 text-sm mb-3">Audio</Text>
        {onUpload ? (
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 border border-dashed border-neutral-700 rounded-xl py-6"
            onPress={onUpload}
          >
            <Upload size={20} color="#525252" />
            <Text className="text-neutral-500">Upload audio</Text>
          </TouchableOpacity>
        ) : (
          <Text className="text-neutral-600 text-sm">Tidak ada audio</Text>
        )}
      </View>
    )
  }

  return (
    <View className="mb-4">
      <Text className="text-neutral-400 text-sm mb-3">Audio Player</Text>

      <View className="flex-row items-center justify-center gap-6 mb-3">
        <TouchableOpacity
          className="w-12 h-12 bg-neutral-800 rounded-full items-center justify-center"
          onPress={togglePlayPause}
        >
          {isPlaying ? (
            <Pause size={20} color="#fff" />
          ) : (
            <Play size={20} color="#fff" style={{ marginLeft: 2 }} />
          )}
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View className="flex-row items-center gap-3">
        <Text className="text-neutral-500 text-xs w-10">{formatTime(position)}</Text>
        <View className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <View
            className="h-full bg-white rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
        <Text className="text-neutral-500 text-xs w-10 text-right">{formatTime(duration)}</Text>
      </View>

      <View className="mt-3 pt-3 border-t border-neutral-800">
        <Text className="text-neutral-500 text-xs text-center">
          Pitch shifting tersedia di web app
        </Text>
      </View>
    </View>
  )
}
