import { useRef, useEffect, useCallback, useState, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { PHOTOS } from '../photosData'

/* ── Hook: detect mobile breakpoint ── */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

/* ── Desktop scattered card layouts ── */
const CARD_LAYOUTS = [
  { photoIdx: 6,  x: 2,  y: 22, w: 115, h: 145, rot: -4, depth: 'bg',  floatDur: 7.5, floatY: -5, floatDelay: 0,   parallax: 0.8  },
  { photoIdx: 8,  x: 4,  y: 60, w: 105, h: 132, rot:  3, depth: 'bg',  floatDur: 8.5, floatY: -4, floatDelay: 1.4, parallax: 0.9  },
  { photoIdx: 10, x: 70, y:  6, w: 110, h: 140, rot:  5, depth: 'bg',  floatDur: 7,   floatY: -6, floatDelay: 0.8, parallax: 0.7  },
  { photoIdx: 11, x: 86, y: 50, w: 112, h: 142, rot: -5, depth: 'bg',  floatDur: 9,   floatY: -4, floatDelay: 2.2, parallax: 0.85 },
  { photoIdx: 1,  x: 10, y: 40, w: 150, h: 195, rot: -5, depth: 'mid', floatDur: 6,   floatY: -7, floatDelay: 0.5, parallax: 0.45 },
  { photoIdx: 2,  x: 28, y: 44, w: 158, h: 205, rot:  6, depth: 'mid', floatDur: 6.5, floatY: -8, floatDelay: 1.5, parallax: 0.5  },
  { photoIdx: 4,  x: 52, y: 40, w: 155, h: 200, rot: -3, depth: 'mid', floatDur: 6.2, floatY: -6, floatDelay: 1,   parallax: 0.4  },
  { photoIdx: 0,  x: 14, y:  8, w: 180, h: 230, rot: -7, depth: 'fg',  floatDur: 5.5, floatY: -9, floatDelay: 0,   parallax: 0.15 },
  { photoIdx: 3,  x: 38, y: 10, w: 195, h: 255, rot:  2, depth: 'fg',  floatDur: 5,   floatY: -9, floatDelay: 0.7, parallax: 0.12 },
  { photoIdx: 5,  x: 68, y: 20, w: 182, h: 235, rot:  4, depth: 'fg',  floatDur: 5.8, floatY: -8, floatDelay: 1.3, parallax: 0.18 },
]

/* ── Desktop card ── */
const GalleryCard = memo(function GalleryCard({ layout, photo, onClick, index }) {
  const depthClass = layout.depth === 'bg' ? 'depth-bg' : layout.depth === 'mid' ? 'depth-mid' : ''
  return (
    <motion.div
      className="float-anim"
      style={{
        position: 'absolute', left: layout.x + '%', top: layout.y + '%',
        zIndex: layout.depth === 'fg' ? 20 : layout.depth === 'mid' ? 10 : 2,
        '--float-y': layout.floatY + 'px', '--float-dur': layout.floatDur + 's', '--float-delay': layout.floatDelay + 's',
      }}
      data-parallax={layout.parallax}
    >
      <motion.div
        className={`gallery-polaroid ${depthClass}`}
        style={{ width: layout.w, transform: `rotate(${layout.rot}deg)` }}
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.08, y: -8, rotate: 0 }}
        onClick={() => onClick(photo)}
      >
        {layout.depth !== 'bg' && (
          <svg className="gallery-heart" viewBox="0 0 24 24" fill="#e07a7a">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        )}
        <div className="gp-img-wrap" style={{ height: layout.h - 45 }}>
          <img src={photo.src} alt={photo.title} loading="lazy" draggable={false} />
        </div>
        <div className="gp-caption">{photo.title}</div>
      </motion.div>
    </motion.div>
  )
})

/* ══════════════════════════════════════════════════════════
   MOBILE: HOLOGRAPHIC AURORA MASONRY GALLERY
   Design: 10-year senior frontend designer edition.
   
   - Ambient aurora orb background (animated blobs)
   - Spinning conic-gradient holographic borders on every card
   - Soft neon glow behind each card (blurred clone layer)
   - Full-bleed photos with cinematic bottom vignette
   - Gold Pinyon Script captions with glow
   - Asymmetric 2-column masonry with right-column offset
   - Hero card: full-width, larger, with glass badge
   - Cards animate in with 3D depth spring physics
   ══════════════════════════════════════════════════════════ */

/* Hero + left column + right column photo assignments */
const HERO_PHOTO   = 0  // Cutie — most beautiful portrait
const LEFT_PHOTOS  = [3, 5, 1, 7, 9]
const RIGHT_PHOTOS = [2, 4, 10, 6, 11]

/* Masonry heights (px) — staggered so they create visual rhythm */
const LEFT_H  = [255, 192, 238, 180, 215]
const RIGHT_H = [198, 255, 182, 228, 198]

/* Aurora color palettes — warm rose-gold theme to match the birthday app */
const AURORA_PALETTES = [
  // Pink → Gold → White → Lavender → Pink
  '#ff9a9e, #ffd89b, #fff0f0, #c77dff, #ff9a9e',
  // Rose → Coral → Gold → Peach
  '#f7797d, #FBD786, #ffffff, #FBD786, #f7797d',
  // Violet → Pink → Gold
  '#c77dff, #ff6b9d, #ffd89b, #ff6b9d, #c77dff',
  // Teal → Cyan → White → Gold (accent)
  '#4ecdc4, #a8edea, #ffffff, #ffd89b, #4ecdc4',
  // Deep Pink → Magenta → Gold
  '#ff416c, #ff4b2b, #ffd89b, #ff4b2b, #ff416c',
]

/* ── Single aurora card ── */
const AuroraCard = memo(function AuroraCard({
  photo, height, onClick, index, isHero = false, paletteIdx = 0
}) {
  const palette = AURORA_PALETTES[paletteIdx % AURORA_PALETTES.length]

  return (
    <motion.div
      className={`aurora-card-wrap ${isHero ? 'aurora-hero' : ''}`}
      style={{
        '--aurora-colors': palette,
        '--aurora-delay': `${(index % 5) * 0.7}s`,
        '--aurora-speed': `${3.5 + (index % 3) * 0.8}s`,
        height: isHero ? undefined : height,
      }}
      initial={{ opacity: 0, y: 56, scale: 0.88, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{
        duration: 0.72,
        delay: index * 0.075,
        ease: [0.16, 1, 0.3, 1],
        rotateX: { duration: 0.9, delay: index * 0.075 + 0.05 },
      }}
      onClick={() => onClick(photo)}
    >
      {/* Ambient outer glow — blurred gradient clone behind card */}
      <div className="aurora-glow-bg" />

      {/* Spinning aurora border frame */}
      <div className="aurora-border-frame">
        {/* Glass inner — holds the photo */}
        <div className="aurora-photo-inner">
          <img
            src={photo.src}
            alt={photo.title}
            loading="lazy"
            draggable={false}
            className="aurora-photo-img"
          />

          {/* Layered vignette: bottom cinematic + edge darkening */}
          <div className="aurora-vignette" />

          {/* Colour cast top-left tint (aurora bleed-through) */}
          <div className="aurora-tint" />

          {/* Hero badge */}
          {isHero && (
            <div className="aurora-hero-badge">
              <span>✦</span>&nbsp;Collected Memories
            </div>
          )}

          {/* Memory number chip */}
          <div className="aurora-num-chip">#{String(index + 1).padStart(2, '0')}</div>

          {/* Caption */}
          <div className="aurora-caption-block">
            <p className="aurora-title">{photo.title}</p>
            {photo.emoji && <span className="aurora-emoji">{photo.emoji}</span>}
          </div>

          {/* Floating heart */}
          <div className="aurora-heart-float">
            <svg viewBox="0 0 24 24" fill="url(#auroraHeart)" width="20" height="20">
              <defs>
                <linearGradient id="auroraHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff9a9e" />
                  <stop offset="100%" stopColor="#ff5e7e" />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

/* ── Ambient floating orbs background ── */
const AmbientOrbs = memo(function AmbientOrbs() {
  return (
    <div className="aurora-orbs" aria-hidden>
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />
      <div className="aurora-orb aurora-orb-4" />
    </div>
  )
})

/* ── Full aurora masonry gallery ── */
function AuroraGallery({ onPhotoClick }) {
  const hero = PHOTOS[HERO_PHOTO]

  return (
    <div className="aurora-gallery-root">
      {/* Animated ambient orbs */}
      <AmbientOrbs />

      {/* ── Hero card: full width ── */}
      {hero && (
        <div className="aurora-hero-row">
          <AuroraCard
            photo={hero}
            height={320}
            onClick={onPhotoClick}
            index={0}
            isHero
            paletteIdx={0}
          />
        </div>
      )}

      {/* ── Two-column masonry: right col offset for stagger depth ── */}
      <div className="aurora-masonry">
        {/* Left column */}
        <div className="aurora-col aurora-col-left">
          {LEFT_PHOTOS.map((photoIdx, i) => {
            const photo = PHOTOS[photoIdx]
            if (!photo) return null
            return (
              <AuroraCard
                key={`left-${photoIdx}`}
                photo={photo}
                height={LEFT_H[i]}
                onClick={onPhotoClick}
                index={i + 1}
                paletteIdx={i + 1}
              />
            )
          })}
        </div>

        {/* Right column — shifted down for depth */}
        <div className="aurora-col aurora-col-right">
          {RIGHT_PHOTOS.map((photoIdx, i) => {
            const photo = PHOTOS[photoIdx]
            if (!photo) return null
            return (
              <AuroraCard
                key={`right-${photoIdx}`}
                photo={photo}
                height={RIGHT_H[i]}
                onClick={onPhotoClick}
                index={i + 6}
                paletteIdx={i + 2}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
function ScatteredGallery({ onPhotoClick }) {
  const sectionRef   = useRef(null)
  const containerRef = useRef(null)
  const mouseRef     = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const rectRef      = useRef(null)
  const rafRef       = useRef(null)
  const isInView     = useInView(sectionRef, { margin: '200px 0px' })
  const isMobile     = useIsMobile(640)

  const updateRect = useCallback(() => {
    if (sectionRef.current) rectRef.current = sectionRef.current.getBoundingClientRect()
  }, [])

  useEffect(() => {
    updateRect()
    window.addEventListener('resize', updateRect, { passive: true })
    window.addEventListener('scroll', updateRect, { passive: true })
    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [updateRect])

  const handleMouseMove = useCallback((e) => {
    if (isMobile) return
    if (!rectRef.current) {
      if (!sectionRef.current) return
      rectRef.current = sectionRef.current.getBoundingClientRect()
    }
    const rect = rectRef.current
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mouseRef.current.targetX = (e.clientX - cx) / (rect.width / 2)
    mouseRef.current.targetY = (e.clientY - cy) / (rect.height / 2)
  }, [isMobile])

  useEffect(() => {
    if (!isInView || isMobile) return
    const container = containerRef.current
    if (!container) return
    const cardElements = container.querySelectorAll('.float-anim')
    const cardsData = Array.from(cardElements).map((el) => {
      const factor = parseFloat(el.getAttribute('data-parallax') || '0.5')
      return { el, maxOffset: 25 * factor }
    })
    function tick() {
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04
      const mx = mouseRef.current.x, my = mouseRef.current.y
      for (let i = 0; i < cardsData.length; i++) {
        const item = cardsData[i]
        item.el.style.transform = `translate3d(${mx * item.maxOffset}px, ${my * item.maxOffset}px, 0)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isInView, isMobile])

  return (
    <section
      ref={sectionRef}
      className="gallery-section relative overflow-hidden"
      id="gallery"
      onMouseMove={handleMouseMove}
    >
      {/* Section Header */}
      <motion.div
        className="relative z-10 text-center pt-16 pb-2 px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2
          className="text-shimmer"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4.5vw, 56px)',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '0.01em',
            lineHeight: 1.1,
            filter: 'drop-shadow(0 2px 14px rgba(230, 200, 106, 0.35))',
          }}
        >
          Collected Memories
        </h2>
        <div style={{
          width: 70, height: 1,
          background: 'linear-gradient(90deg, transparent, #e6c86a, transparent)',
          margin: '14px auto 0',
        }} />
      </motion.div>

      {isMobile ? (
        <div className="relative z-10">
          <AuroraGallery onPhotoClick={onPhotoClick} />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative w-full z-10"
          style={{ height: 'calc(100vh - 140px)', maxHeight: '850px', minHeight: '550px' }}
        >
          {CARD_LAYOUTS.map((layout, i) => {
            const photo = PHOTOS[layout.photoIdx]
            if (!photo) return null
            return (
              <GalleryCard
                key={`gallery-${layout.photoIdx}-${i}`}
                layout={layout} photo={photo}
                onClick={onPhotoClick} index={i}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

export default memo(ScatteredGallery)
