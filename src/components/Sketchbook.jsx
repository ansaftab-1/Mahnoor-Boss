import { useState, useCallback, useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence, useSpring } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PHOTOS } from '../photosData'
import WaveRibbons from './WaveRibbons'

/* ═══════════════════════════════════════════════════════════
   ASSET PATHS
   ═══════════════════════════════════════════════════════════ */
const ASSETS = {
  cover: '/book-images/book-cover page (1).gif',
  backCover: '/book-images/back-oage.gif',
  pageBg: '/book-images/page (1).png',
  page2Video: '/2-page.mp4',
  page3Image: '/design-01m0jnzgyd-1787334029.png',
  page4Video: '/page-3.mp4',
  memoriesVideo: '/page-4.mp4',
  page5Video1: '/pagge-5 (1).mp4',
  page5Video2: '/pagge-5 (2).mp4',
  flowers: [
    '/book-images/page-flower (1).gif',  // Page 1 (Flower 1 GIF)
    '/book-images/page-flower (2).gif',  // Page 2 (Flower 2 GIF)
    '/book-images/page-flower ().png',   // Page 3 (Page Flower 3 PNG)
    '/book-images/page-flower (4).gif',  // Page 4 (Flower 4 GIF)
    '/book-images/page-flower (5).gif',  // Page 5 (Flower 5 GIF)
    '/book-images/page-flower 6.gif',    // Page 6 (Flower 6 GIF)
  ]
}

/* ═══════════════════════════════════════════════════════════
   DECORATIVE SCRAPBOOK ELEMENTS
   ═══════════════════════════════════════════════════════════ */

const WashiTape = memo(function WashiTape({ top, left, right, bottom, color = 'rgba(197, 155, 39, 0.35)', rotation = -4, width = 70 }) {
  return (
    <div
      style={{
        position: 'absolute',
        top, left, right, bottom,
        width,
        height: 20,
        background: color,
        transform: `rotate(${rotation}deg)`,
        opacity: 0.8,
        zIndex: 12,
        borderRadius: 2,
        boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.18) 4px, rgba(255,255,255,0.18) 8px)',
      }} />
    </div>
  )
})

/* Animated Flower component that preserves infinite loop animation */
const AnimatedPageFlower = memo(function AnimatedPageFlower({ src, style = {}, size = 95, rotation = 0, className = '', top, left, right, bottom }) {
  return (
    <div
      style={{
        position: 'absolute',
        top, left, right, bottom,
        width: size,
        transform: `rotate(${rotation}deg)`,
        zIndex: 15,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.22))',
        ...style,
      }}
      className={className}
    >
      <img
        src={src}
        alt="Animated Flower"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
        loading="eager"
        draggable={false}
      />
    </div>
  )
})

const DecorativeLine = memo(function DecorativeLine({ style = {} }) {
  return (
    <div style={{
      width: 70,
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(169, 116, 79, 0.45), transparent)',
      ...style,
    }} />
  )
})

/* Polaroid photo component with washi tape */
const ScrapPhoto = memo(function ScrapPhoto({ src, alt, width = 110, rotation = 0, tapeColor, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      width,
      background: '#ffffff',
      padding: `${width * 0.045}px ${width * 0.045}px ${width * 0.16}px`,
      boxShadow: '0 8px 22px rgba(0,0,0,0.22)',
      transform: `rotate(${rotation}deg)`,
      zIndex: 8,
      borderRadius: 2,
      ...style,
    }}>
      {tapeColor && (
        <WashiTape top={-9} left="18%" color={tapeColor} rotation={rotation >= 0 ? -2.5 : 2.5} width={width * 0.55} />
      )}
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: width * 0.88, objectFit: 'cover', display: 'block', borderRadius: 1 }}
        loading="eager"
        draggable={false}
      />
    </div>
  )
})



/* Handwritten text style */
const handStyle = {
  fontFamily: "'Alex Brush', 'Segoe Script', cursive",
  color: '#3d3427',
  lineHeight: 1.5,
  textShadow: '0 0.5px 1px rgba(255,255,255,0.6)',
}

const labelStyle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  color: '#8b5a2b',
  letterSpacing: '0.18em',
  fontWeight: 600,
  textTransform: 'uppercase',
}

/* Page background using authentic page (1).png texture */
const pageBase = (dir = 'left') => ({
  height: '100%',
  width: '100%',
  padding: '22px 18px',
  position: 'relative',
  backgroundImage: `url('${ASSETS.pageBg}')`,
  backgroundSize: '200% 100%',
  backgroundPosition: dir === 'left' ? 'left center' : 'right center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#f5efe3',
  overflow: 'hidden',
  boxSizing: 'border-box',
})

/* ═══════════════════════════════════════════════════════════
   SPREAD 1: "The Beginning" (Flowers 1 & 2)
   ═══════════════════════════════════════════════════════════ */
const Spread1Left = memo(function Spread1Left() {
  return (
    <div style={pageBase('left')} className="page-paper">
      <div style={{ ...labelStyle, fontSize: 9, marginBottom: 6 }}>PAGE 01 / THE BEGINNING</div>

      {/* Main polaroid with washi tape */}
      <div style={{ position: 'absolute', top: 30, right: 18 }}>
        <ScrapPhoto src={PHOTOS[0].src} alt="Memory" width={118} rotation={-4} tapeColor="rgba(197, 155, 39, 0.4)" />
      </div>

      {/* Animated Flower 1 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[0]}
        top={12}
        left={12}
        size={94}
        rotation={-8}
      />

      {/* Handwritten quote */}
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '8%',
        right: '8%',
        ...handStyle,
        fontSize: 'clamp(15px, 3.2vw, 21px)',
        textAlign: 'center',
        zIndex: 10,
      }}>
        You are the stars in my dark and cold nights, shining and unwavering.
      </div>

      {/* Bottom decorative line */}
      <DecorativeLine style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)' }} />
    </div>
  )
})

const Spread1Right = memo(function Spread1Right() {
  return (
    <div style={pageBase('right')} className="page-paper">
      <div style={{ ...labelStyle, fontSize: 9, textAlign: 'right', marginBottom: 6 }}>PAGE 02</div>

      {/* Handwritten text top */}
      <div style={{
        ...handStyle,
        fontSize: 'clamp(14px, 2.8vw, 18px)',
        maxWidth: '52%',
        marginTop: 4,
        zIndex: 10,
        position: 'relative',
      }}>
        and the flowers screamed as why the rain was so necessary
      </div>

      {/* Vertical photo strip with washi tapes */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        alignItems: 'center',
        transform: 'rotate(2deg)',
      }}>
        {[PHOTOS[1], PHOTOS[2], PHOTOS[3]].map((p, i) => (
          <ScrapPhoto
            key={i}
            src={p.src}
            alt="Photo"
            width={70}
            rotation={i === 1 ? -2 : i === 2 ? 2 : 0}
            tapeColor={i === 0 ? 'rgba(227, 163, 110, 0.4)' : undefined}
          />
        ))}
      </div>

      {/* Animated Flower 2 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[1]}
        bottom={14}
        left={16}
        size={96}
        rotation={12}
      />
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   SPREAD 2: "Precious Moments" (Page 3: Image Asset, Page 4: Video)
   ═══════════════════════════════════════════════════════════ */
const Spread2Left = memo(function Spread2Left() {
  return (
    <div style={pageBase('left')} className="page-paper">
      {/* Header Label */}
      <div style={{
        ...labelStyle,
        fontSize: 9,
        position: 'relative',
        zIndex: 10,
        marginBottom: 6,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>PAGE 03 / PRECIOUS MOMENTS</span>
        <span style={{ fontSize: 8, opacity: 0.7, letterSpacing: '0.1em' }}>EDITION I</span>
      </div>

      {/* Featured Image Asset on Page 3 (design-01m0jnzgyd-1787334029.png) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 68px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 8,
      }}>
        <div style={{
          position: 'relative',
          maxHeight: '100%',
          maxWidth: '86%',
          borderRadius: 4,
          boxShadow: '0 12px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)',
          transform: 'rotate(-1.2deg)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
          overflow: 'hidden',
          background: '#e8ded0',
        }}>
          <WashiTape top={-7} right="16%" color="rgba(197, 155, 39, 0.4)" rotation={3} width={46} />
          <img
            src={ASSETS.page3Image}
            alt="Page 3 Artwork — What you think is important"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '265px',
              objectFit: 'contain',
              display: 'block',
              borderRadius: 3,
            }}
            loading="eager"
            draggable={false}
          />
        </div>
      </div>

      {/* Page Flower 3 PNG Accent */}
      <AnimatedPageFlower
        src={ASSETS.flowers[2]}
        top={8}
        left={8}
        size={76}
        rotation={-6}
      />

      {/* Handwritten note */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 14,
        right: 14,
        ...handStyle,
        fontSize: 'clamp(14px, 2.8vw, 18px)',
        textAlign: 'center',
        zIndex: 10,
        textShadow: '0 1px 3px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.9)',
      }}>
        every little thing reminds me of you
      </div>

      <DecorativeLine style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
    </div>
  )
})

const Spread2Right = memo(function Spread2Right() {
  return (
    <div style={pageBase('right')} className="page-paper">
      {/* Background Video for Page 4 */}
      <video
        src={ASSETS.page4Video}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.80,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Parchment glass blend overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(245, 239, 227, 0.35) 0%, rgba(250, 246, 238, 0.2) 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      <div style={{ ...labelStyle, fontSize: 9, textAlign: 'right', position: 'relative', zIndex: 10 }}>PAGE 04</div>

      {/* Quote */}
      <div style={{
        ...handStyle,
        fontSize: 'clamp(15px, 3.2vw, 20px)',
        textAlign: 'center',
        marginTop: 10,
        maxWidth: '58%',
        zIndex: 10,
        position: 'relative',
        textShadow: '0 1px 3px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.85)',
      }}>
        and if 999 wishes came true it would've been you
      </div>

      {/* Center photo */}
      <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 8 }}>
        <ScrapPhoto src={PHOTOS[6].src} alt="Photo" width={105} rotation={-3} tapeColor="rgba(197, 155, 39, 0.35)" />
      </div>

      {/* Animated Flower 4 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[3]}
        bottom={14}
        right={14}
        size={95}
        rotation={-10}
      />

      <DecorativeLine style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   SPREAD 3: "Golden Moments" (Page 5: Merged Dual-Video, Page 6: Chapters)
   ═══════════════════════════════════════════════════════════ */
const Spread3Left = memo(function Spread3Left() {
  return (
    <div style={pageBase('left')} className="page-paper">
      {/* Header Bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <div style={{
          ...labelStyle,
          fontSize: 9,
        }}>
          PAGE 05 / GOLDEN MOMENTS
        </div>
        <div style={{
          ...labelStyle,
          fontSize: 8,
          opacity: 0.7,
          letterSpacing: '0.1em',
        }}>
          EDITION II
        </div>
      </div>

      {/* Centerpiece Scrapbook Photo with Washi Tape */}
      <div style={{
        position: 'absolute',
        top: '44%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 8,
      }}>
        <ScrapPhoto
          src={PHOTOS[4].src}
          alt="Golden Moment"
          width={120}
          rotation={-2}
          tapeColor="rgba(197, 155, 39, 0.4)"
        />
      </div>

      {/* Animated Flower 5 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[4]}
        top={12}
        left={14}
        size={86}
        rotation={-8}
      />

      {/* Handwritten quote */}
      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 14,
        right: 14,
        ...handStyle,
        fontSize: 'clamp(14px, 2.8vw, 18px)',
        textAlign: 'center',
        zIndex: 10,
      }}>
        "every moment spent with you is a memory I treasure forever."
      </div>

      <DecorativeLine style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }} />
    </div>
  )
})

const Spread3Right = memo(function Spread3Right() {
  return (
    <div style={pageBase('right')} className="page-paper">
      <div style={{ ...labelStyle, fontSize: 9, textAlign: 'right' }}>PAGE 06 / CHAPTERS</div>

      <div style={{ position: 'absolute', top: 30, right: 16 }}>
        <ScrapPhoto src={PHOTOS[8].src} alt="Photo" width={105} rotation={4} tapeColor="rgba(197, 155, 39, 0.3)" />
      </div>

      <div style={{ position: 'absolute', top: '48%', left: 16 }}>
        <ScrapPhoto src={PHOTOS[9].src} alt="Photo" width={96} rotation={-6} tapeColor="rgba(216, 222, 183, 0.4)" />
      </div>

      {/* Animated Flower 6 GIF */}
      <AnimatedPageFlower
        src={ASSETS.flowers[5]}
        bottom={14}
        left={14}
        size={78}
        rotation={8}
      />

      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 16,
        left: '42%',
        ...handStyle,
        fontSize: 'clamp(13px, 2.6vw, 17px)',
        zIndex: 10,
      }}>
        some pages are quiet, but our story keeps writing itself...
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   SPREAD 4: "Celebration & The End"
   ═══════════════════════════════════════════════════════════ */
const Spread4Left = memo(function Spread4Left() {
  return (
    <div style={{
      ...pageBase('left'),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    }} className="page-paper">
      <div style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(18px, 3.5vw, 24px)',
        color: '#573d21',
        letterSpacing: '0.04em',
        marginTop: 6,
        textAlign: 'center',
        fontWeight: 400,
        fontStyle: 'italic',
      }}>
        Happy Birthday
      </div>

      <ScrapPhoto src={PHOTOS[10].src} alt="Photo" width={128} rotation={-2} tapeColor="rgba(197, 155, 39, 0.35)" />

      {/* Decorative animated flower accent */}
      <AnimatedPageFlower
        src={ASSETS.flowers[0]}
        top={8}
        right={12}
        size={70}
        rotation={-12}
      />

      <div style={{
        ...handStyle,
        fontSize: 'clamp(14px, 3vw, 18px)',
        textAlign: 'center',
        marginBottom: 10,
        zIndex: 10,
      }}>
        May your year be filled with endless joy, magic, and boundless love
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   SPREAD 4 RIGHT (PAGE 08 · THE FINALE · ASPECT TEST GALLERY)
   Design inspired by Pinterest UI Animation reference (https://pin.it/38FCPdTf9):
   - Camera HUD Viewfinder (Corner brackets ┌ ┐ └ ┘, side crosshairs ├ ┤)
   - Top Header: "ALL PURPOSE" with interactive Play/Pause toggle ▷
   - Multi-Card Dynamic Cluster / Shuffle Collage (8 photo & video memory cards)
   - Reactive Segmented Equalizer Progress Bar [❚❚❚❚❚❚❚❚❚❚] & "ASPECT TEST"
   - Interactive 3D Perspective Tilt & Click-to-Focus
   ═══════════════════════════════════════════════════════════ */

const CLUSTER_ITEMS = [
  { id: 1, type: 'video', src: ASSETS.page5Video2, title: 'Forever & Always', tag: '01 / MEMORY' },
  { id: 2, type: 'photo', src: PHOTOS[0].src, title: 'Sweet Smile', tag: '02 / BEAUTY' },
  { id: 3, type: 'photo', src: PHOTOS[1].src, title: 'My Love', tag: '03 / ROMANCE' },
  { id: 4, type: 'photo', src: PHOTOS[2].src, title: 'Pure Joy', tag: '04 / RADIANCE' },
  { id: 5, type: 'photo', src: PHOTOS[4].src, title: 'Golden Hour', tag: '05 / PRECIOUS' },
  { id: 6, type: 'photo', src: PHOTOS[6].src, title: 'Angel Eyes', tag: '06 / WONDER' },
  { id: 7, type: 'photo', src: PHOTOS[8].src, title: 'Dream Girl', tag: '07 / ETERNAL' },
  { id: 8, type: 'photo', src: PHOTOS[10].src, title: 'Happy Birthday', tag: '08 / FINALE' },
]

const CLUSTER_SLOTS = [
  // Slot 0: Center Focal Card (Front & Center)
  { x: 0, y: 0, scale: 1.05, zIndex: 30, opacity: 1, rotate: 0 },
  // Slot 1: Top Center / Back
  { x: -14, y: -58, scale: 0.80, zIndex: 12, opacity: 0.82, rotate: -2 },
  // Slot 2: Top Right
  { x: 58, y: -38, scale: 0.82, zIndex: 16, opacity: 0.88, rotate: 3 },
  // Slot 3: Right
  { x: 74, y: 12, scale: 0.80, zIndex: 14, opacity: 0.85, rotate: -1 },
  // Slot 4: Bottom Right
  { x: 48, y: 58, scale: 0.82, zIndex: 18, opacity: 0.88, rotate: 2 },
  // Slot 5: Bottom Center
  { x: -14, y: 68, scale: 0.76, zIndex: 11, opacity: 0.80, rotate: -3 },
  // Slot 6: Bottom Left
  { x: -58, y: 42, scale: 0.82, zIndex: 17, opacity: 0.88, rotate: 1 },
  // Slot 7: Left
  { x: -72, y: -8, scale: 0.80, zIndex: 13, opacity: 0.85, rotate: -2 },
]

const Spread4Right = memo(function Spread4Right({ onPhotoClick }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const tiltX = useSpring(0, { stiffness: 180, damping: 20 })
  const tiltY = useSpring(0, { stiffness: 180, damping: 20 })
  const activeVideoRef = useRef(null)

  // Auto-cycle through the cluster items every 3.2s
  useEffect(() => {
    if (!isPlaying || isHovered) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CLUSTER_ITEMS.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [isPlaying, isHovered])

  // Play video if active card is video
  useEffect(() => {
    const cur = CLUSTER_ITEMS[activeIndex]
    if (cur.type === 'video' && activeVideoRef.current) {
      activeVideoRef.current.play().catch(() => { })
    }
  }, [activeIndex])

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    tiltX.set(-y * 12)
    tiltY.set(x * 14)
  }, [tiltX, tiltY])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    tiltX.set(0)
    tiltY.set(0)
  }, [tiltX, tiltY])

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        background: '#07080b',
        backgroundImage: `
          radial-gradient(ellipse at 50% 48%, #141724 0%, #06070a 100%),
          linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 24px 24px, 24px 24px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 14px 10px',
        userSelect: 'none',
      }}
      className="page-paper"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── CAMERA HUD VIEWPORT CORNER BRACKETS ── */}
      {/* Top Left Bracket ┌ */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          width: 13,
          height: 13,
          borderTop: '1.5px solid rgba(255, 255, 255, 0.75)',
          borderLeft: '1.5px solid rgba(255, 255, 255, 0.75)',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />
      {/* Top Right Bracket ┐ */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 13,
          height: 13,
          borderTop: '1.5px solid rgba(255, 255, 255, 0.75)',
          borderRight: '1.5px solid rgba(255, 255, 255, 0.75)',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />
      {/* Bottom Left Bracket └ */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          width: 13,
          height: 13,
          borderBottom: '1.5px solid rgba(255, 255, 255, 0.75)',
          borderLeft: '1.5px solid rgba(255, 255, 255, 0.75)',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />
      {/* Bottom Right Bracket ┘ */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          width: 13,
          height: 13,
          borderBottom: '1.5px solid rgba(255, 255, 255, 0.75)',
          borderRight: '1.5px solid rgba(255, 255, 255, 0.75)',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />

      {/* ── SIDE ALIGNMENT CROSSHAIRS ── */}
      {/* Left Tick ├ */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 1.5,
          background: 'rgba(255, 255, 255, 0.45)',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />
      {/* Right Tick ┤ */}
      <div
        style={{
          position: 'absolute',
          right: 6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 8,
          height: 1.5,
          background: 'rgba(255, 255, 255, 0.45)',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />

      {/* ── TOP HUD HEADER BAR ── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 8px 0',
          zIndex: 40,
          position: 'relative',
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.22em',
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            textShadow: '0 0 10px rgba(255,255,255,0.4)',
          }}
        >
          <span style={{ color: '#ffd700', fontSize: 10 }}>·</span>
          <span>ALL PURPOSE</span>
        </div>

        {/* Play/Pause Button (Matching the open triangle ▷ from reference) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsPlaying((prev) => !prev)
          }}
          title={isPlaying ? 'Pause Auto-Shuffle' : 'Play Auto-Shuffle'}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            opacity: isPlaying ? 0.95 : 0.45,
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPlaying ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#ffffff">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          )}
        </button>
      </div>

      {/* ── CENTER PICTURE SECTION: DYNAMIC MULTI-CARD CLUSTER ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1000,
          transformStyle: 'preserve-3d',
          zIndex: 20,
          margin: 'auto 0',
        }}
      >
        <motion.div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            rotateX: tiltX,
            rotateY: tiltY,
          }}
        >
          {CLUSTER_ITEMS.map((item, index) => {
            // Compute slot based on active index
            const slotIndex = (index - activeIndex + CLUSTER_ITEMS.length) % CLUSTER_ITEMS.length
            const slot = CLUSTER_SLOTS[slotIndex] || CLUSTER_SLOTS[0]
            const isFocal = slotIndex === 0

            return (
              <motion.div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isFocal) {
                    setActiveIndex(index)
                  } else {
                    onPhotoClick?.(item)
                  }
                }}
                animate={{
                  x: slot.x,
                  y: slot.y,
                  scale: slot.scale,
                  zIndex: slot.zIndex,
                  opacity: slot.opacity,
                  rotate: slot.rotate,
                }}
                whileHover={
                  !isFocal
                    ? { scale: slot.scale * 1.08, filter: 'brightness(1.1)' }
                    : { scale: slot.scale * 1.03 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 26,
                  mass: 0.85,
                }}
                style={{
                  position: 'absolute',
                  width: isFocal ? '112px' : '88px',
                  height: isFocal ? '146px' : '116px',
                  borderRadius: 14,
                  overflow: 'hidden',
                  cursor: isFocal ? 'zoom-in' : 'pointer',
                  border: isFocal
                    ? '1.5px solid rgba(255, 215, 0, 0.9)'
                    : '1px solid rgba(255, 255, 255, 0.22)',
                  boxShadow: isFocal
                    ? '0 16px 38px rgba(0, 0, 0, 0.85), 0 0 22px rgba(255, 215, 0, 0.35)'
                    : '0 8px 24px rgba(0, 0, 0, 0.65)',
                  background: '#0e111a',
                  willChange: 'transform, opacity',
                  transition: 'border 0.3s ease, box-shadow 0.3s ease',
                }}
                title={isFocal ? 'Click to open full photo' : `Focus on ${item.title}`}
              >
                {/* Media Image or Video */}
                {item.type === 'video' ? (
                  <video
                    ref={isFocal ? activeVideoRef : null}
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: isFocal ? 'contrast(1.05)' : 'brightness(0.9) contrast(1)',
                    }}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: isFocal ? 'contrast(1.05)' : 'brightness(0.9) contrast(1)',
                    }}
                    loading="eager"
                    draggable={false}
                  />
                )}

                {/* Subtle Glass Reflection Sheen */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: isFocal
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 55%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Focal Card Pill Badge */}
                {isFocal && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '3px 8px',
                      borderRadius: 999,
                      background: 'rgba(7, 8, 12, 0.85)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 215, 0, 0.45)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{ color: '#ffd700', fontSize: 8 }}>·</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 8.5,
                        fontWeight: 600,
                        color: '#f8f4eb',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* ── SENTIMENTAL BIRTHDAY DEDICATION ── */}
      <div
        style={{
          fontFamily: "'Alex Brush', cursive",
          fontSize: 'clamp(13px, 2.4vw, 15px)',
          color: 'rgba(255, 235, 195, 0.88)',
          textAlign: 'center',
          maxWidth: 240,
          zIndex: 35,
          lineHeight: 1.25,
          textShadow: '0 2px 6px rgba(0,0,0,0.9)',
          pointerEvents: 'none',
          margin: '2px 0 4px',
        }}
      >
        "Thank you for making every day brighter. To many more chapters together."
      </div>

      {/* ── BOTTOM HUD FOOTER BAR ── */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 8px 2px',
          zIndex: 40,
          position: 'relative',
        }}
      >
        {/* Equalizer Step Bar (Matching the segmented block meter from reference) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            padding: '2px 4px',
            border: '1px solid rgba(255, 255, 255, 0.45)',
            borderRadius: 2,
            background: 'rgba(0, 0, 0, 0.65)',
          }}
          title={`Moment ${activeIndex + 1} of ${CLUSTER_ITEMS.length}`}
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const activeSegments = Math.round(((activeIndex + 1) / CLUSTER_ITEMS.length) * 12)
            const isActive = i < activeSegments
            return (
              <div
                key={i}
                style={{
                  width: 3,
                  height: 8,
                  borderRadius: 0.5,
                  background: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
                  boxShadow: isActive ? '0 0 4px rgba(255,255,255,0.7)' : 'none',
                  transition: 'background 0.25s ease, box-shadow 0.25s ease',
                }}
              />
            )
          })}
        </div>

        {/* Monospace Aspect Test Title */}
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.22em',
            color: '#ffffff',
            fontWeight: 700,
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(255,255,255,0.4)',
          }}
        >
          ASPECT TEST
        </div>
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   SPREADS LIST
   ═══════════════════════════════════════════════════════════ */
const SPREADS = [
  { Left: Spread1Left, Right: Spread1Right },
  { Left: Spread2Left, Right: Spread2Right },
  { Left: Spread3Left, Right: Spread3Right },
  { Left: Spread4Left, Right: Spread4Right },
]

/* ═══════════════════════════════════════════════════════════
   SPIRAL BINDING
   ═══════════════════════════════════════════════════════════ */
const CenterBinding = memo(function CenterBinding() {
  const count = 14
  return (
    <div style={{
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      top: 0, bottom: 0,
      width: 16,
      zIndex: 45,
      pointerEvents: 'none',
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${(i + 0.5) * (100 / count)}%`,
            left: 0,
            width: 16,
            height: 8,
            borderRadius: 4,
            background: 'linear-gradient(180deg, #d8d2c2 0%, #8f8a78 60%, #5a574e 100%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      ))}
    </div>
  )
})

/* ═══════════════════════════════════════════════════════════
   FRONT COVER — Continuous Animated Cover GIF
   ═══════════════════════════════════════════════════════════ */
const FrontCover = memo(function FrontCover({ onOpen }) {
  return (
    <motion.div
      key="cover"
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 215, 0, 0.3)',
      }}
      style={{
        position: 'absolute',
        inset: 0,
        cursor: 'pointer',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        padding: 0,
        borderRadius: 8,
        boxShadow: '0 25px 70px rgba(0,0,0,0.8), 0 0 25px rgba(255, 215, 0, 0.2)',
        overflow: 'hidden',
        background: '#0a0a0e',
        willChange: 'transform, opacity',
      }}
    >
      <img
        src={ASSETS.cover}
        alt="Sketchbook Cover"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        loading="eager"
        draggable={false}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.25) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 24,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        padding: '7px 16px',
        borderRadius: 999,
        background: 'rgba(18, 14, 10, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 215, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
        transition: 'transform 0.2s ease',
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#FFE699',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          Click to Open
        </span>
      </div>
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════════════
   BACK COVER — Continuous Animated Back Page GIF
   ═══════════════════════════════════════════════════════════ */
const BackCoverView = memo(function BackCoverView({ onClose }) {
  return (
    <motion.div
      key="back-cover"
      onClick={onClose}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 215, 0, 0.3)',
      }}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 8,
        boxShadow: '0 25px 70px rgba(0,0,0,0.8), 0 0 25px rgba(255, 215, 0, 0.2)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#0a0a0e',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        willChange: 'transform, opacity',
      }}
    >
      <img
        src={ASSETS.backCover}
        alt="Sketchbook Back Cover"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        loading="eager"
        draggable={false}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        padding: '7px 16px',
        borderRadius: 999,
        background: 'rgba(18, 14, 10, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 215, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#FFE699',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        }}>
          Click to Re-open
        </span>
      </div>
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════════════
   CORNER CURL HOVER HINT
   ═══════════════════════════════════════════════════════════ */
const PageCornerHint = memo(function PageCornerHint({ dir = 'right', onClick, disabled = false }) {
  const isRight = dir === 'right'
  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) onClick()
      }}
      whileHover={disabled ? {} : { scale: 1.15 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      title={isRight ? 'Turn page forward' : 'Turn page backward'}
      style={{
        position: 'absolute',
        bottom: 0,
        [isRight ? 'right' : 'left']: 0,
        width: 44,
        height: 44,
        cursor: disabled ? 'default' : 'pointer',
        zIndex: 50,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          [isRight ? 'right' : 'left']: 0,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderWidth: isRight ? '0 0 32px 32px' : '0 32px 32px 0',
          borderColor: isRight
            ? 'transparent transparent rgba(197, 155, 39, 0.75) transparent'
            : 'transparent rgba(197, 155, 39, 0.75) transparent transparent',
          filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          [isRight ? 'right' : 'left']: 4,
          fontSize: 8,
          fontFamily: 'var(--font-sans)',
          color: '#ffffff',
          fontWeight: 700,
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          pointerEvents: 'none',
        }}
      >
        {isRight ? '›' : '‹'}
      </div>
    </motion.div>
  )
})

/* ═══════════════════════════════════════════════════════════
   PAGE SPREAD VARIANTS (Fluid, GPU-accelerated transform: translateX & opacity)
   ═══════════════════════════════════════════════════════════ */
const spreadVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '18%' : '-18%',
    opacity: 0,
    scale: 0.985,
    filter: 'brightness(0.96)',
  }),
  center: {
    x: '0%',
    opacity: 1,
    scale: 1,
    filter: 'brightness(1)',
    transition: {
      x: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.28, ease: 'easeOut' },
      scale: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      filter: { duration: 0.32, ease: 'easeOut' },
    },
  },
  exit: (dir) => ({
    x: dir > 0 ? '-18%' : '18%',
    opacity: 0,
    scale: 0.985,
    filter: 'brightness(0.94)',
    transition: {
      x: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.24, ease: 'easeIn' },
      scale: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      filter: { duration: 0.28, ease: 'easeIn' },
    },
  }),
}

/* ═══════════════════════════════════════════════════════════
   MAIN SKETCHBOOK COMPONENT
   Fluid, GPU-Accelerated Natural Page-Turn Engine
   ═══════════════════════════════════════════════════════════ */
function Sketchbook({ onPhotoClick }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showBackCover, setShowBackCover] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const isAnimatingRef = useRef(false)
  const lastActionTimeRef = useRef(0)
  const touchStartX = useRef(0)

  const total = SPREADS.length

  const setTransitioning = useCallback((value) => {
    isAnimatingRef.current = value
    setIsAnimating(value)
  }, [])

  /* Throttled forward navigation */
  const goNext = useCallback(() => {
    const now = performance.now()
    if (isAnimatingRef.current || now - lastActionTimeRef.current < 340) return

    if (index >= total - 1) {
      lastActionTimeRef.current = now
      setTransitioning(true)
      setOpen(false)
      setShowBackCover(true)
      setTimeout(() => {
        setTransitioning(false)
      }, 350)
      return
    }

    lastActionTimeRef.current = now
    setTransitioning(true)
    setDirection(1)
    setIndex((prev) => prev + 1)
  }, [index, total, setTransitioning])

  /* Throttled backward navigation */
  const goPrev = useCallback(() => {
    const now = performance.now()
    if (isAnimatingRef.current || now - lastActionTimeRef.current < 340) return

    if (index <= 0) {
      lastActionTimeRef.current = now
      setTransitioning(true)
      setOpen(false)
      setShowBackCover(false)
      setTimeout(() => {
        setTransitioning(false)
      }, 350)
      return
    }

    lastActionTimeRef.current = now
    setTransitioning(true)
    setDirection(-1)
    setIndex((prev) => prev - 1)
  }, [index, setTransitioning])

  const closeBook = useCallback(() => {
    if (isAnimatingRef.current) return
    setTransitioning(true)
    setOpen(false)
    setShowBackCover(false)
    setIndex(0)
    setTimeout(() => {
      setTransitioning(false)
    }, 350)
  }, [setTransitioning])

  /* Keyboard controls with preventDefault to avoid page scroll jump */
  useEffect(() => {
    const onKey = (e) => {
      if (!open) return
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        closeBook()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, goNext, goPrev, closeBook])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff < -45) goNext()
    else if (diff > 45) goPrev()
  }

  const handleAnimationComplete = useCallback(() => {
    setTransitioning(false)
  }, [setTransitioning])

  const CurrentLeft = SPREADS[index]?.Left
  const CurrentRight = SPREADS[index]?.Right

  return (
    <section className="sketchbook-section relative" id="sketchbook-section">
      {/* Wave Ribbons Background (Originkit) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <WaveRibbons
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
      </div>

      {/* Section Title */}
      <motion.div
        className="relative z-20"
        style={{ textAlign: 'center', marginBottom: 36 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(28px, 4vw, 48px)',
          color: '#f3ecdb',
          textAlign: 'center',
          fontWeight: 300,
          fontStyle: 'italic',
        }}>
          Memory Box
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          color: 'rgba(243, 236, 219, 0.5)',
          textAlign: 'center',
          marginTop: 8,
          letterSpacing: '0.04em',
        }}>
          Click pages or arrows to turn · Feel every memory unfold
        </p>
      </motion.div>

      {/* Book Container with stable dimensions & GPU compositing */}
      <div style={{
        width: 'min(92vw, 760px)',
        aspectRatio: '16 / 10',
        position: 'relative',
        transform: 'translateZ(0)',
      }}>
        <AnimatePresence mode="sync" initial={false}>
          {!open ? (
            showBackCover ? (
              <BackCoverView
                key="back-cover-view"
                onClose={() => {
                  setShowBackCover(false)
                  setOpen(true)
                  setIndex(0)
                  setDirection(1)
                }}
              />
            ) : (
              <FrontCover
                key="front-cover-view"
                onOpen={() => {
                  setOpen(true)
                  setShowBackCover(false)
                  setIndex(0)
                  setDirection(1)
                }}
              />
            )
          ) : (
            /* ── OPEN BOOK WITH SMOOTH FLUID SPREAD TRANSITIONS ── */
            <motion.div
              key="open-book"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 32px 85px rgba(0,0,0,0.75), 0 0 35px rgba(255, 215, 0, 0.15)',
                background: '#f5efe3',
                willChange: 'transform, opacity',
              }}
            >
              {/* Animated Spreads using transform: translateX and opacity */}
              <AnimatePresence custom={direction} mode="popLayout" initial={false}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={spreadVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onAnimationComplete={handleAnimationComplete}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    willChange: 'transform, opacity',
                  }}
                >
                  {/* Left Half (50%) */}
                  <div
                    onClick={index > 0 && !isAnimating ? goPrev : undefined}
                    style={{
                      position: 'relative',
                      width: '50%',
                      height: '100%',
                      cursor: index > 0 && !isAnimating ? 'pointer' : 'default',
                      overflow: 'hidden',
                    }}
                  >
                    {CurrentLeft && <CurrentLeft />}

                    {/* Page spine shadow */}
                    <div
                      className="page-curl-shadow"
                      style={{
                        left: 0,
                        right: 'auto',
                        background: 'linear-gradient(270deg, transparent 60%, rgba(0,0,0,0.08) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>

                  {/* Right Half (50%) */}
                  <div
                    onClick={!isAnimating ? goNext : undefined}
                    style={{
                      position: 'relative',
                      width: '50%',
                      height: '100%',
                      cursor: !isAnimating ? 'pointer' : 'default',
                      overflow: 'hidden',
                    }}
                  >
                    {CurrentRight && <CurrentRight onPhotoClick={onPhotoClick} />}

                    {/* Page spine shadow */}
                    <div
                      className="page-curl-shadow"
                      style={{
                        background: 'linear-gradient(90deg, transparent 60%, rgba(0,0,0,0.08) 100%)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Center Spiral Binding (Always stays anchored in center) */}
              <CenterBinding />

              {/* Corner Hints */}
              {index > 0 && (
                <PageCornerHint dir="left" onClick={goPrev} disabled={isAnimating} />
              )}
              <PageCornerHint dir="right" onClick={goNext} disabled={isAnimating} />

              {/* Luxury Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeBook()
                }}
                aria-label="Close Sketchbook"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  zIndex: 60,
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  color: '#7c664d',
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(197, 155, 39, 0.3)',
                  borderRadius: 999,
                  padding: '5px 14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(6px)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
                  transition: 'all 0.2s ease',
                }}
              >
                close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Controls with reserved height to prevent vertical layout jump */}
      <div
        style={{
          marginTop: 24,
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}
            >
              <button
                onClick={goPrev}
                disabled={isAnimating || index === 0}
                style={navBtnStyle(isAnimating || index === 0)}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div style={{ display: 'flex', gap: 6 }}>
                {SPREADS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (isAnimating || i === index) return
                      setDirection(i > index ? 1 : -1)
                      setIndex(i)
                      setTransitioning(true)
                    }}
                    aria-label={`Go to page spread ${i + 1}`}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      padding: 0,
                      border: 'none',
                      background: i === index ? '#ffd700' : 'rgba(255,255,255,0.25)',
                      boxShadow: i === index ? '0 0 8px rgba(255, 215, 0, 0.8)' : 'none',
                      transform: i === index ? 'scale(1.25)' : 'scale(1)',
                      transition: 'all 0.25s ease',
                      cursor: isAnimating ? 'default' : 'pointer',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={isAnimating}
                style={navBtnStyle(isAnimating)}
              >
                Next <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

function navBtnStyle(disabled) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    color: disabled ? 'rgba(255,255,255,0.25)' : '#f3ecdb',
    background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 999,
    padding: '8px 18px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.04em',
    backdropFilter: 'blur(8px)',
  }
}

export default memo(Sketchbook)
