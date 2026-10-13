import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import WobbleFence from './WobbleFence'
import SphereGallery3D from './SphereGallery3D'
import { PHOTOS } from '../photosData'

function ForeverPage() {
  const galleryItems = useMemo(
    () =>
      PHOTOS.map((p) => ({
        image: p.src,
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

      {/* Floating Scroll Up Button */}
      <motion.button
        onClick={handleScrollUp}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-amber-100/90 text-xs font-medium tracking-widest uppercase hover:bg-black/75 hover:text-amber-300 hover:border-amber-400/40 transition-all cursor-pointer pointer-events-auto shadow-lg"
        aria-label="Scroll back up to memory box"
      >
        <ChevronUp size={14} className="animate-bounce" />
        <span>Return to Memory Box</span>
      </motion.button>

      {/* 3D Sphere Gallery in the Middle - Prominent & Clearly Visible Size */}
      <div className="relative z-10 w-full h-[84vh] max-h-[850px] max-w-6xl flex items-center justify-center pointer-events-auto px-2">
        <SphereGallery3D
          images={galleryItems}
          branches={Math.min(28, galleryItems.length * 2)}
          background="transparent"
          scale={92}
          size={38}
          speed={14}
          direction="counterclockwise"
          hover={210}
          rounded={18}
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

