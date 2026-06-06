import { useState, useRef, useCallback, useEffect } from 'react'
import * as Tone from 'tone'
import { Upload, Play, Pause } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

export default function PitchShifter() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pitch, setPitch] = useState(0)
  const [fileName, setFileName] = useState('')
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const playerRef = useRef(null)
  const pitchShiftRef = useRef(null)
  const animRef = useRef(null)

  const cleanup = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.stop()
      playerRef.current.dispose()
      playerRef.current = null
    }
    if (pitchShiftRef.current) {
      pitchShiftRef.current.dispose()
      pitchShiftRef.current = null
    }
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setIsLoaded(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    cleanup()
    setFileName(file.name)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer)

      pitchShiftRef.current = new Tone.PitchShift({
        pitch: 0,
        windowSize: 0.1,
      }).toDestination()

      playerRef.current = new Tone.Player(audioBuffer).connect(pitchShiftRef.current)

      playerRef.current.onstop = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        if (animRef.current) cancelAnimationFrame(animRef.current)
      }

      setDuration(audioBuffer.duration)
      setIsLoaded(true)
    } catch (err) {
      alert('Gagal membaca file audio: ' + err.message)
    }
  }

  const togglePlay = async () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.stop()
      setIsPlaying(false)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    } else {
      await Tone.start()
      playerRef.current.start()
      setIsPlaying(true)

      const updateTime = () => {
        if (playerRef.current && playerRef.current.state === 'started') {
          setCurrentTime(Date.now() - startTime)
          animRef.current = requestAnimationFrame(updateTime)
        }
      }
      const startTime = Date.now() - currentTime
      animRef.current = requestAnimationFrame(updateTime)
    }
  }

  const changePitch = (val) => {
    const v = parseInt(val)
    if (pitchShiftRef.current) {
      pitchShiftRef.current.pitch = v
    }
    setPitch(v)
  }

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <Card className="space-y-4">
      <h3 className="font-semibold text-stone-900 dark:text-stone-100">Pitch Shifter Audio</h3>

      <div>
        <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
          Upload file audio (MP3, WAV, OGG)
        </label>
        <label className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-colors">
          <Upload size={18} className="text-stone-400 dark:text-stone-500" />
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {fileName || 'Pilih file audio...'}
          </span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFile}
            className="sr-only"
          />
        </label>
      </div>

      {isLoaded && (
        <>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={isPlaying ? Pause : Play}
              onClick={togglePlay}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <span className="text-sm text-stone-500 dark:text-stone-400 font-mono">
              {formatTime(currentTime)} / {formatTime(duration * 1000)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Pitch: {pitch > 0 ? '+' : ''}{pitch} semitone
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              value={pitch}
              onChange={(e) => changePitch(e.target.value)}
              className="w-full accent-primary-600 dark:accent-primary-400"
            />
            <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 mt-1">
              <span>-5</span>
              <span>0</span>
              <span>+5</span>
            </div>
          </div>
        </>
      )}

      {!isLoaded && (
        <p className="text-xs text-stone-400 dark:text-stone-500">
          Upload file audio untuk mengubah pitch secara realtime
        </p>
      )}
    </Card>
  )
}
