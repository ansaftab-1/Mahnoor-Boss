import { useState, useCallback, useEffect, useRef, lazy, Suspense, memo } from 'react'
import { AnimatePresence } from 'framer-motion'
import RibbonCarousel from './components/RibbonCarousel'
import ScatteredGallery from './components/ScatteredGallery'
import Sketchbook from './components/Sketchbook'
import BirthdayFinale from './components/BirthdayFinale'
import ForeverPage from './components/ForeverPage'
import AudioPlayer from './components/AudioPlayer'
import BirthdayWishesModal from './components/BirthdayWishesModal'

const ImageModal = lazy(() => import('./components/ImageModal'))

/* ── Unified Living Background Video for Page 2 & Page 3 (page-4.mp4 - Pure & Unblurred) ── */
const ContinuousMemoriesBackground = memo(function ContinuousMemoriesBackground() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!video || !container) return

    // Pause video playback when Page 2 & 3 universe is not in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden pointer-events-none z-0"
      style={{ willChange: 'transform' }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src="/page-4.mp4" type="video/mp4" />
      </video>
    </div>
  )
})

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [isWishesOpen, setIsWishesOpen] = useState(false)
  const progressRef = useRef(null)

  const handlePhotoClick = useCallback((photo) => {
    setSelectedPhoto(photo)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedPhoto(null)
  }, [])

  const handleNavigate = useCallback((photo) => {
    setSelectedPhoto(photo)
  }, [])

  /* Scroll progress bar with requestAnimationFrame throttling */
  useEffect(() => {
    let ticking = false
    let rafId = null

    const updateProgress = () => {
      const el = progressRef.current
      if (!el) {
        ticking = false
        return
      }

      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0

      el.style.transform = `scaleX(${progress})`
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        rafId = requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <main className="relative w-full min-h-screen select-none" style={{ overflowX: 'clip' }}>
      {/* Global fine parchment texture (seamless across all sections) */}
      <div className="film-grain" />

      {/* Scroll Progress Bar */}
      <div ref={progressRef} className="scroll-progress" />

      {/* Ambient Audio Player */}
      <AudioPlayer />

      {/* ── Act 1: Birthday Celebration & Finale ── */}
      <BirthdayFinale />

      {/* ── Continuous Living Universe: Page 2 (Ribbon Carousel) & Page 3 (Scattered Gallery) ── */}
      <div className="relative w-full" id="memories-universe">
        {/* Unified sticky video background that persists seamlessly across Page 2 & Page 3 */}
        <ContinuousMemoriesBackground />

        {/* Page 2 & Page 3 content layered seamlessly with zero separation seam */}
        <div className="relative z-10 -mt-[100vh]">
          <RibbonCarousel onPhotoClick={handlePhotoClick} />
          <ScatteredGallery onPhotoClick={handlePhotoClick} />
        </div>
      </div>

      {/* ── Act 4: Intimacy — Interactive Sketchbook ── */}
      <Sketchbook onPhotoClick={handlePhotoClick} />

      {/* ── Act 5: Epilogue — Forever & Always (Wobble Fence Three.js background) ── */}
      <ForeverPage />

      {/* ── Full-screen Image Modal (Lazy Loaded) ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <Suspense fallback={null}>
            <ImageModal
              photo={selectedPhoto}
              onClose={handleCloseModal}
              onNavigate={handleNavigate}
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Floating Birthday Wishes & Notes Button */}
      <button
        onClick={() => setIsWishesOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-600/90 to-amber-700/90 hover:from-amber-500 hover:to-amber-600 text-amber-50 font-medium text-xs tracking-wider uppercase shadow-[0_8px_25px_rgba(180,120,40,0.4)] border border-amber-300/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Open Birthday Wishes and Notes"
      >
        <span className="text-base leading-none">💌</span>
        <span>Wishes & Letters</span>
      </button>

      {/* Birthday Wishes & Love Notes Modal */}
      <BirthdayWishesModal
        isOpen={isWishesOpen}
        onClose={() => setIsWishesOpen(false)}
      />
    </main>
  )
}
