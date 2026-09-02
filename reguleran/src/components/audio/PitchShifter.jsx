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
  const [uploadError, setUploadError] = useState('')
  const playerRef = useRef(null)
  const pitchShiftRef = useRef(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(0)
  const pauseOffsetRef = useRef(0)

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (playerRef.current) {
      try {
        playerRef.current.stop()
        playerRef.current.dispose()
      } catch { /* ignore */ }
      playerRef.current = null
    }
    if (pitchShiftRef.current) {
      try {
        pitchShiftRef.current.dispose()
      } catch { /* ignore */ }
      pitchShiftRef.current = null
    }
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const setupAudio = useCallback((audioBuffer) => {
    cleanup()
    const shift = new Tone.PitchShift({ pitch: 0, windowSize: 0.1 }).toDestination()
    const player = new Tone.Player(audioBuffer).connect(shift)
    player.onstop = () => {
      if (timerRef.current) clearInterval(timerRef.current)
      setIsPlaying(false)
      setCurrentTime(0)
      pauseOffsetRef.current = 0
    }
    playerRef.current = player
    pitchShiftRef.current = shift
    setDuration(audioBuffer.duration)
    setIsLoaded(true)
  }, [cleanup])

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (e.target) e.target.value = ''
    if (!file) return

    if (!songId) {
      alert('Simpan lagu terlebih dahulu sebelum upload audio')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setUploadError('')

    try {
      const arrayBuffer = await file.arrayBuffer()
      await Tone.start()
      const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer)
      setupAudio(audioBuffer)

      const result = await uploadAudio(songId, file, (pct) => {
        setUploadProgress(pct)
      })

      setAudioUrl(result.url)
      setAudioFileName(result.fileName)
      await updateSong(songId, { audioUrl: result.url, audioFileName: result.fileName })
    } catch (err) {
      console.error('Audio setup failed:', err)
      setUploadError('Gagal memproses audio: ' + err.message)
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
        if (!response.ok) return
        const arrayBuffer = await response.arrayBuffer()
        await Tone.start()
        const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer)
        if (!cancelled) {
          setupAudio(audioBuffer)
        }
      } catch (err) {
        console.warn('Could not load audio from URL:', err)
      }
    }
    loadFromUrl()
    return () => { cancelled = true }
  }, [audioUrl, setupAudio])

  const togglePlay = async () => {
    if (!playerRef.current) return

    try {
      await Tone.start()
      if (isPlaying) {
        playerRef.current.stop()
        pauseOffsetRef.current = currentTime
        if (timerRef.current) clearInterval(timerRef.current)
        setIsPlaying(false)
      } else {
        const offset = pauseOffsetRef.current
        playerRef.current.start(0, offset)
        startTimeRef.current = Date.now() - (offset * 1000)
        setIsPlaying(true)

        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
          const elapsed = (Date.now() - startTimeRef.current) / 1000
          if (elapsed >= duration) {
            setCurrentTime(duration)
            clearInterval(timerRef.current)
            setIsPlaying(false)
            pauseOffsetRef.current = 0
          } else {
            setCurrentTime(elapsed)
          }
        }, 100)
      }
    } catch (err) {
      console.error('Playback error:', err)
    }
  }

  const changePitch = (val) => {
    const v = parseInt(val, 10)
    if (pitchShiftRef.current) {
      pitchShiftRef.current.pitch = v
    }
    setPitch(v)
  }

  const formatTime = (sec) => {
    const totalSec = Math.floor(sec || 0)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Audio Backing Track</h4>
        {audioFileName && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[180px]">
            <Cloud size={12} className="inline mr-1" />
            {audioFileName}
          </span>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-400 cursor-pointer transition-colors text-sm bg-white dark:bg-[#13161B]">
          {uploading ? (
            <span className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <Loader size={16} className="animate-spin" />
              Upload {Math.round(uploadProgress)}%
            </span>
          ) : (
            <>
              <Upload size={16} className="text-neutral-400 dark:text-neutral-500" />
              <span className="text-neutral-600 dark:text-neutral-400">
                {audioFileName ? 'Ganti audio' : 'Upload audio (MP3, WAV, OGG)'}
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
        <div className="p-3.5 bg-neutral-100/70 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/[0.08] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="primary"
              size="sm"
              icon={isPlaying ? Pause : Play}
              onClick={togglePlay}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Pitch Shift: {pitch > 0 ? `+${pitch}` : pitch} semitones
              </span>
              <button
                type="button"
                onClick={() => changePitch(0)}
                className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:underline"
              >
                Reset (0)
              </button>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              value={pitch}
              onChange={(e) => changePitch(e.target.value)}
              className="w-full accent-neutral-900 dark:accent-white cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-0.5">
              <span>-6</span>
              <span>-3</span>
              <span>0</span>
              <span>+3</span>
              <span>+6</span>
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md border border-red-200 dark:border-red-800">
          {uploadError}
        </div>
      )}
    </div>
  )
}
