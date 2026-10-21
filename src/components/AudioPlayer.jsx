import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react'

/* ── Web Audio API Ambient Melodic Chords Generator ──
   Synthesizes warm, soothing romantic music with zero external audio assets needed */
class AmbientSynthesizer {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.isPlaying = false
    this.timer = null
    this.notes = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.0,  // G4
      440.0,  // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
    ]
    this.chordProgression = [
      [261.63, 329.63, 392.0, 523.25], // Cmaj
      [220.0, 261.63, 329.63, 440.0],  // Am
      [174.61, 220.0, 261.63, 349.23], // F
      [196.0, 246.94, 293.66, 392.0],  // G
    ]
    this.progIndex = 0
  }

  init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    this.ctx = new AudioCtx()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime)
    this.masterGain.connect(this.ctx.destination)
  }

  setVolume(vol) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol * 0.25)), this.ctx.currentTime, 0.05)
    }
  }

  playNote(freq, delay = 0, duration = 3.5) {
    if (!this.ctx || !this.isPlaying) return
    const now = this.ctx.currentTime + delay

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)

    // Soft gentle lowpass filter to mimic warm acoustic tones
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1200, now)
    filter.frequency.exponentialRampToValueAtTime(400, now + duration)

    // Gentle envelope: slow attack, long serene release
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(0.08, now + 0.4)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc.start(now)
    osc.stop(now + duration)
  }

  start() {
    this.init()
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    this.isPlaying = true

    const stepProgression = () => {
      if (!this.isPlaying) return
      const chord = this.chordProgression[this.progIndex % this.chordProgression.length]
      this.progIndex++

      // Play soft arpeggiated notes from current harmony
      chord.forEach((note, idx) => {
        this.playNote(note, idx * 0.45, 4.2)
      })

      // Occasional sweet high chime
      const highChime = this.notes[Math.floor(Math.random() * this.notes.length)]
      this.playNote(highChime * 1.5, 1.8, 3.0)

      this.timer = setTimeout(stepProgression, 3800)
    }

    stepProgression()
  }

  stop() {
    this.isPlaying = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend()
    }
  }
}

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)

  const synthRef = useRef(null)

  useEffect(() => {
    synthRef.current = new AmbientSynthesizer()
    const timer = setTimeout(() => setShowTooltip(false), 8000)

    return () => {
      clearTimeout(timer)
      if (synthRef.current) {
        synthRef.current.stop()
      }
    }
  }, [])

  const togglePlay = useCallback(() => {
    setShowTooltip(false)
    const synth = synthRef.current
    if (!synth) return

    if (isPlaying) {
      synth.stop()
      setIsPlaying(false)
    } else {
      synth.start()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    const synth = synthRef.current
    if (!synth) return

    if (isMuted) {
      synth.setVolume(volume)
      setIsMuted(false)
    } else {
      synth.setVolume(0)
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (val === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
    if (synthRef.current) {
      synthRef.current.setVolume(val)
    }
  }, [])

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center select-none font-sans">
      {/* First-time prompt tooltip */}
      <AnimatePresence>
        {showTooltip && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4 }}
            className="hidden sm:flex items-center gap-2 mr-3 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-300/30 text-amber-200 text-xs shadow-xl pointer-events-none"
          >
            <Music size={12} className="animate-spin text-amber-300" style={{ animationDuration: '6s' }} />
            <span>Click to play birthday melody</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main glass pill audio controller */}
      <motion.div
        layout
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-amber-300/30 bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-amber-100 transition-all duration-300 hover:border-amber-400/60"
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-900 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
          title={isPlaying ? 'Pause Serenade' : 'Play Serenade'}
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} className="ml-0.5" fill="currentColor" />}
        </button>

        {/* Animated Sound Wave Equalizer Bars */}
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-0.5 h-4 px-1.5 cursor-pointer"
          title="Toggle audio volume settings"
        >
          {[0.6, 1, 0.4, 0.8, 0.5].map((scale, i) => (
            <motion.span
              key={i}
              className="w-0.5 bg-amber-300 rounded-full"
              animate={
                isPlaying
                  ? {
                      height: ['4px', `${12 * scale}px`, '4px'],
                    }
                  : { height: '3px' }
              }
              transition={
                isPlaying
                  ? {
                      duration: 0.6 + i * 0.15,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }
                  : { duration: 0.2 }
              }
            />
          ))}
        </div>

        {/* Expandable volume controls */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 overflow-hidden pl-1 pr-1"
            >
              <button
                onClick={toggleMute}
                className="text-amber-200/80 hover:text-amber-300 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-amber-950/60 rounded-lg appearance-none cursor-pointer accent-amber-400"
                aria-label="Volume slider"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default memo(AudioPlayer)
