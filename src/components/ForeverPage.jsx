import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import WobbleFence from './WobbleFence'
import SphereGallery3D from './SphereGallery3D'

export const USER_VIDEOS = [
  { id: 1, video: '/user-videos/video-1.mp4' },
  { id: 2, video: '/user-videos/video-2.mp4' },
  { id: 3, video: '/user-videos/video-3.mp4' },
  { id: 4, video: '/user-videos/video-4.mp4' },
  { id: 5, video: '/user-videos/video-5.mp4' },
  { id: 6, video: '/user-videos/video-6.mp4' },
  { id: 7, video: '/user-videos/video-7.mp4' },
  { id: 8, video: '/user-videos/video-8.mp4' },
]

function ForeverPage() {
  const galleryItems = useMemo(
    () =>
      USER_VIDEOS.map((v) => ({
        video: v.video,
        link: '',
      })),
    []
  )

  const handleScrollUp = () => {
    const sketchbook = document.getElementById('sketchbook-section')
    if (sketchbook) {
      sketchbook.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="wobble-fence-page"
      className="relative w-full h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#000000',
      }}
    >
      {/* 3D Wobble Fence Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <WobbleFence
          finish="metal"
          tint="#D8D8D8"
          color="#FF9F1C"
          spacing={45}
          thickness={3}
          speed={15}
          pointerLift={20}
        />
      </div>

      {/* Subtle Cosmic Radial Glow behind the constellation */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245, 208, 97, 0.12) 0%, rgba(255, 107, 157, 0.08) 40%, transparent 80%)',
        }}
      />

      {/* Floating Scroll Up Button Only */}
      <motion.button
        onClick={handleScrollUp}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-amber-100/90 text-xs font-medium tracking-widest uppercase hover:bg-black/85 hover:text-amber-300 hover:border-amber-400/50 transition-all cursor-pointer pointer-events-auto shadow-lg"
        aria-label="Scroll back up to memory box"
      >
        <ChevronUp size={14} className="animate-bounce" />
        <span>Return to Memory Box</span>
      </motion.button>

      {/* 3D Sphere Video Gallery - Clean Videos Running on Loop */}
      <div className="relative z-10 w-full h-[84vh] max-h-[850px] max-w-6xl flex items-center justify-center pointer-events-auto px-2">
        <SphereGallery3D
          images={galleryItems}
          branches={24}
          background="transparent"
          scale={92}
          size={38}
          speed={14}
          direction="counterclockwise"
          hover={210}
          rounded={16}
          core={{
            coreSize: 18,
            coreColor: '#F5D06190',
            lineColor: '#F5D06150',
          }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Subtle Hint at bottom */}
      <div className="absolute bottom-5 z-10 text-center pointer-events-none">
        <p className="text-[11px] tracking-[0.25em] text-white/40 uppercase font-light">
          Drag to explore our moments • Scroll freely
        </p>
      </div>
    </section>
  )
}

export default memo(ForeverPage)
