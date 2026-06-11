import { useState, useRef, useEffect, useCallback } from 'react'
import * as Tone from 'tone'
import { Upload, Play, Pause, Loader, Cloud } from 'lucide-react'
import { uploadAudio } from '../../services/storage'
import useSongStore from '../../stores/songStore'
import { Button } from '../ui/Button'

export default function PitchShifter({ songId, audioUrl: initialUrl, audioFileName: initialName }) {
  const { updateSong } = useSongStore()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [pitch, setPitch] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioUrl, setAudioUrl] = useState(initialUrl || '')
  const [audioFileName, setAudioFileName] = useState(initialName || '')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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
    return () => cleanup()
  }, [cleanup])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !songId) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const result = await uploadAudio(songId, file, (pct) => {
        setUploadProgress(pct)
      })

      setAudioUrl(result.url)
      setAudioFileName(result.fileName)
      await updateSong(songId, { audioUrl: result.url, audioFileName: result.fileName })

      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer)
      cleanup()
      pitchShiftRef.current = new Tone.PitchShift({ pitch: 0, windowSize: 0.1 }).toDestination()
      playerRef.current = new Tone.Player(audioBuffer).connect(pitchShiftRef.current)
      playerRef.current.onstop = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        if (animRef.current) cancelAnimationFrame(animRef.current)
      }
      setDuration(audioBuffer.duration)
      setIsLoaded(true)
    } catch (err) {
      alert('Gagal upload audio: ' + err.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function loadFromUrl() {
      if (!audioUrl) return
      try {
        const response = await fetch(audioUrl)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer)
        if (!cancelled) {
          cleanup()
          pitchShiftRef.current = new Tone.PitchShift({ pitch: 0, windowSize: 0.1 }).toDestination()
          playerRef.current = new Tone.Player(audioBuffer).connect(pitchShiftRef.current)
          playerRef.current.onstop = () => {
            setIsPlaying(false)
            setCurrentTime(0)
            if (animRef.current) cancelAnimationFrame(animRef.current)
          }
          setDuration(audioBuffer.duration)
          setIsLoaded(true)
        }
      } catch {
        // silent
      }
    }
    loadFromUrl()
    return () => { cancelled = true }
  }, [audioUrl, cleanup])

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-stone-700 dark:text-stone-300">Audio</h4>
        {audioFileName && (
          <span className="text-xs text-stone-400 dark:text-stone-500 truncate max-w-[180px]">
            <Cloud size={12} className="inline mr-1" />
            {audioFileName}
          </span>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-colors text-sm">
          {uploading ? (
            <span className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
              <Loader size={16} className="animate-spin" />
              Upload {Math.round(uploadProgress)}%
            </span>
          ) : (
            <>
              <Upload size={16} className="text-stone-400 dark:text-stone-500" />
              <span className="text-stone-500 dark:text-stone-400">
                {audioFileName ? 'Ganti audio...' : 'Upload audio (MP3, WAV, OGG)'}
              </span>
            </>
          )}
          <input
            type="file"
            accept="audio/*"
            onChange={handleFile}
            className="sr-only"
            disabled={uploading}
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
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
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
            <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 mt-0.5">
              <span>-5</span>
              <span>0</span>
              <span>+5</span>
            </div>
          </div>
        </>
      )}

      {!isLoaded && !audioUrl && !uploading && (
        <p className="text-xs text-stone-400 dark:text-stone-500">
          Audio tersimpan permanent di cloud setelah diupload
        </p>
      )}
    </div>
  )
}
