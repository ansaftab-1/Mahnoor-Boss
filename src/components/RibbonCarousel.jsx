import { useEffect, useRef, useMemo, useState, useCallback, memo } from 'react'
import { motion, useInView } from 'framer-motion'
import { PHOTOS } from '../photosData'

/* ══════════════════════════════════════════════════════════════════════════════
   SIGNATURE 3D MEMORY RIBBON & LIVING BACKGROUND
   Continuous parametric ribbon path · 60 FPS precomputed lookup physics
   3D depth layers · Optical focal lens · Living sunlight & particle atmosphere
   Fully responsive across mobile/tablet/desktop · Battery & GPU optimized
   ══════════════════════════════════════════════════════════════════════════════ */

const CARD_COUNT = 12 // 12 photos in circular orbit

/* ══════════════════════════════════════════════════════════════
   LAYER: LIVING SUNLIGHT & BOKEH PARTICLES CANVAS
   Living golden hour light source + drifting champagne dust
   ══════════════════════════════════════════════════════════════ */
const LivingAtmosphereCanvas = memo(function LivingAtmosphereCanvas({ mouseRef, focalPosRef, isInView = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isInView) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const isMobile = window.innerWidth < 768
    const numParticles = isMobile ? 12 : 24

    // Champagne dust / golden bokeh motes
    const particles = Array.from({ length: numParticles }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 1.5 + Math.random() * (i < (isMobile ? 3 : 5) ? 18 : 3.5),
      alpha: 0.15 + Math.random() * 0.4,
      baseAlpha: 0.15 + Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -0.1 - Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
      hue: 35 + Math.random() * 15,
    }))

    let time = 0
    let smoothLightX = w * 0.5
    let smoothLightY = h * 0.35

    function render() {
      time += 0.012
      ctx.clearRect(0, 0, w, h)

      // Target position for living sunlight
      const mx = mouseRef.current.x * w
      const my = mouseRef.current.y * h

      const targetLightX = w * 0.5 + (mx - w * 0.5) * 0.12
      const targetLightY = h * 0.45 + (my - h * 0.5) * 0.1
      smoothLightX += (targetLightX - smoothLightX) * 0.03
      smoothLightY += (targetLightY - smoothLightY) * 0.03

      // Golden Champagne Atmosphere over video
      ctx.clearRect(0, 0, w, h)

      // 2. Optical Lens Glint tracking the focal ribbon node
      if (focalPosRef?.current) {
        const fx = (focalPosRef.current.x / 100) * w
        const fy = (focalPosRef.current.y / 100) * h

        const glintGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, isMobile ? 80 : 140)
        glintGrad.addColorStop(0, 'rgba(255, 245, 200, 0.35)')
        glintGrad.addColorStop(0.3, 'rgba(255, 215, 0, 0.12)')
        glintGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = glintGrad
        ctx.beginPath()
        ctx.arc(fx, fy, isMobile ? 80 : 140, 0, Math.PI * 2)
        ctx.fill()
      }

      // 3. Champagne Bokeh & Golden Dust Motes
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.alpha = p.baseAlpha + Math.sin(time * 3 + p.phase) * 0.12

        // Wrap around boundaries
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        ctx.save()
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha))
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        pGrad.addColorStop(0, `hsla(${p.hue}, 90%, 85%, 0.8)`)
        pGrad.addColorStop(0.5, `hsla(${p.hue}, 80%, 65%, 0.25)`)
        pGrad.addColorStop(1, `hsla(${p.hue}, 70%, 50%, 0)`)
        ctx.fillStyle = pGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [mouseRef, focalPosRef, isInView])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
})

/* ══════════════════════════════════════════════════════════════
   LAYER: CINEMATIC EDITORIAL TITLE
   Breathing typography · Luminous gold shimmer · Clear high-contrast reveal
   ══════════════════════════════════════════════════════════════ */
const CinematicHeroTitle = memo(function CinematicHeroTitle({ activePhoto }) {
  return (
    <div
      className="absolute pointer-events-none z-30 max-w-[92vw] sm:max-w-[75vw]"
      style={{
        top: 'clamp(14px, 4.5vh, 44px)',
        left: 'clamp(14px, 4.5vw, 44px)',
      }}
    >
      {/* Editorial Category Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(9px, 1.8vw, 11px)',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#FFE699',
            textShadow: '0 0 12px rgba(255, 230, 153, 0.6), 0 2px 8px rgba(0, 0, 0, 0.95)',
          }}
        >
          A Collection of Moments
        </span>
        <span style={{ width: 28, height: 1.5, background: '#FFD700', boxShadow: '0 0 10px #FFD700', opacity: 0.85 }} />
      </motion.div>

      {/* "Happy Birthday" — Grand Display Serif in Luminous White & Radiant Gold */}
      <div style={{ overflow: 'hidden' }}>
        <motion.h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(34px, 6vw, 82px)',
            fontWeight: 300,
            color: '#FFFFFF',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            textShadow: '0 0 32px rgba(255, 230, 150, 0.7), 0 3px 18px rgba(0, 0, 0, 0.98)',
          }}
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Happy
        </motion.h1>
      </div>

      <div style={{ overflow: 'hidden' }}>
        <motion.h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(34px, 6vw, 82px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#FFF4BD',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            textShadow: '0 0 32px rgba(255, 215, 0, 0.7), 0 3px 18px rgba(0, 0, 0, 0.98)',
          }}
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          Birthday
        </motion.h1>
      </div>

      {/* "Sweety" in Radiant Shimmer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.3, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span
          className="text-shimmer"
          style={{
            display: 'block',
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(42px, 7.5vw, 96px)',
            marginTop: '2px',
            marginLeft: '6px',
            lineHeight: 1.05,
            filter: 'drop-shadow(0 0 24px rgba(255, 215, 0, 0.85)) drop-shadow(0 3px 14px rgba(0, 0, 0, 0.95))',
          }}
        >
          Sweety
        </span>
      </motion.div>

      {/* Active focal memory tag — Frosted pill for clear legibility */}
      {activePhoto && (
        <motion.div
          key={activePhoto.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            marginTop: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderRadius: 999,
            background: 'rgba(6, 12, 27, 0.72)',
            border: '1px solid rgba(255, 215, 0, 0.38)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.7), 0 0 16px rgba(255, 215, 0, 0.15)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#FFD700',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(10px, 2vw, 11.5px)',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#FFE699',
              textShadow: '0 0 8px rgba(255, 230, 153, 0.5)',
            }}
          >
            Focal Memory: <strong style={{ color: '#FFFFFF', fontWeight: 700, textShadow: '0 0 10px rgba(255,255,255,0.8)' }}>{activePhoto.title} {activePhoto.emoji}</strong>
          </span>
        </motion.div>
      )}
    </div>
  )
})


/* ── Memoized 24 Cards Field: Prevents re-rendering 24 cards on focal index change ── */
const RibbonCardsField = memo(function RibbonCardsField({ cards, cardRefs, onPhotoClick, velocityRef }) {
  return (
    <>
      {cards.map((card, i) => (
        <div
          key={`ribbon-card-${card.idx}`}
          ref={(el) => { cardRefs.current[i] = el }}
          className="ribbon-polaroid pointer-events-auto"
          onClick={(e) => {
            if (Math.abs(velocityRef.current) < 0.003) {
              e.stopPropagation()
              onPhotoClick(card)
            }
          }}
          data-cursor="VIEW"
          style={{
            willChange: 'transform, left, top, opacity',
            transformOrigin: 'center center',
          }}
        >
          <div className="ribbon-polaroid-img">
            <img
              src={card.src}
              alt={card.title}
              loading={i < 8 ? 'eager' : 'lazy'}
              draggable={false}
            />
          </div>

        </div>
      ))}
    </>
  )
})

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT: RIBBON CAROUSEL (LIVING 3D MEMORY FIELD)
   ══════════════════════════════════════════════════════════════ */
function RibbonCarousel({ onPhotoClick, isViewerOpen = false }) {
  const sectionRef = useRef(null)
  const isSectionInView = useInView(sectionRef, { margin: '200px 0px' })

  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const rafRef = useRef(null)

  // Motion physics states (stored in mutable refs for 60fps zero-react-render pipeline)
  const progressRef = useRef(0.35)
  const velocityRef = useRef(0)
  const targetVelocityRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5, rawX: 0, rawY: 0 })
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 })
  const focalPosRef = useRef({ x: 50, y: 40 })
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, progress: 0, time: 0, isTouch: false, lockedAxis: null })
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 })

  // State only for high-level metadata (debounced / thresholded)
  const [focalCardIndex, setFocalCardIndex] = useState(0)

  // Card dataset: 24 cards evenly repeated from PHOTOS
  const cards = useMemo(() => {
    return Array.from({ length: CARD_COUNT }, (_, i) => ({
      ...PHOTOS[i % PHOTOS.length],
      idx: i,
      uniquePhotoId: PHOTOS[i % PHOTOS.length].id,
    }))
  }, [])



  // Desktop Mouse Parallax Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
        rawX: e.clientX,
        rawY: e.clientY,
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Wheel & Page Scroll Physics Impulse — Calibrated for smooth, gentle, natural motion
  useEffect(() => {
    let lastScrollY = window.scrollY

    const SCROLL_SENSITIVITY = 0.000002
    const SCROLL_MAX_IMPULSE = 0.00015
    const MAX_VELOCITY = 0.0010

    const handleScroll = () => {
      const currY = window.scrollY
      const deltaY = currY - lastScrollY
      lastScrollY = currY

      if (Math.abs(deltaY) < 0.5) return

      const impulse = Math.sign(deltaY) * Math.min(Math.abs(deltaY) * SCROLL_SENSITIVITY, SCROLL_MAX_IMPULSE)

      if (velocityRef.current !== 0 && Math.sign(velocityRef.current) !== Math.sign(impulse)) {
        velocityRef.current *= 0.4
      }

      velocityRef.current += impulse
      velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current))
    }

    const handleWheel = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      if (rect.top <= 80 && rect.bottom >= window.innerHeight - 80) {
        const delta = e.deltaY
        const WHEEL_SENSITIVITY = 0.000004
        const WHEEL_MAX_IMPULSE = 0.00035

        const impulse = Math.sign(delta) * Math.min(Math.abs(delta) * WHEEL_SENSITIVITY, WHEEL_MAX_IMPULSE)

        if (velocityRef.current !== 0 && Math.sign(velocityRef.current) !== Math.sign(impulse)) {
          velocityRef.current *= 0.4
        }

        velocityRef.current += impulse
        velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // Touch and Drag Gestures (Allows native vertical scroll on mobile)
  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = true
    const isTouch = !!e.touches
    const clientX = isTouch ? e.touches[0].clientX : e.clientX
    const clientY = isTouch ? e.touches[0].clientY : e.clientY

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      progress: progressRef.current,
      time: performance.now(),
      isTouch,
      lockedAxis: null,
    }
    lastPointerRef.current = { x: clientX, y: clientY, time: performance.now() }
    velocityRef.current = 0
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return
    const isTouch = dragStartRef.current.isTouch
    const clientX = isTouch ? e.touches?.[0]?.clientX ?? 0 : e.clientX
    const clientY = isTouch ? e.touches?.[0]?.clientY ?? 0 : e.clientY
    const now = performance.now()

    const dx = clientX - dragStartRef.current.x
    const dy = clientY - dragStartRef.current.y

    // On mobile touch, disambiguate vertical scroll vs horizontal carousel orbit
    if (isTouch && !dragStartRef.current.lockedAxis) {
      if (Math.hypot(dx, dy) > 8) {
        if (Math.abs(dy) > Math.abs(dx) * 1.15) {
          dragStartRef.current.lockedAxis = 'y'
          isDraggingRef.current = false
          return
        } else {
          dragStartRef.current.lockedAxis = 'x'
        }
      } else {
        return
      }
    }

    if (dragStartRef.current.lockedAxis === 'y') return

    const dt = now - lastPointerRef.current.time
    const isMobile = window.innerWidth < 768
    // Drag response calibrated for mobile so swiping feels natural like on web
    const widthFactor = isMobile ? 320 : window.innerWidth
    const progressDelta = (dx / widthFactor) * (isMobile ? 0.65 : 0.42)
    progressRef.current = (dragStartRef.current.progress - progressDelta + 1000) % 1.0

    if (dt > 10) {
      const stepDx = clientX - lastPointerRef.current.x
      const speedScale = isMobile ? 0.35 : 0.18
      const rawVel = -(stepDx / widthFactor) * (16 / Math.max(dt, 16)) * speedScale
      const maxV = isMobile ? 0.0035 : 0.0018
      targetVelocityRef.current = Math.max(-maxV, Math.min(maxV, rawVel))
      lastPointerRef.current = { x: clientX, y: clientY, time: now }
    }
  }, [])

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    velocityRef.current = targetVelocityRef.current
    targetVelocityRef.current = 0
  }, [])

  // 60 FPS Optimized Animation Loop (Zero DOM queries, Precomputed Spline Interpolation)
  useEffect(() => {
    if (!isSectionInView) return


    let time = 0
    let lastFocalCheck = 0
    let isMobile = window.innerWidth < 768

    const handleResize = () => {
      isMobile = window.innerWidth < 768
    }
    window.addEventListener('resize', handleResize, { passive: true })

    function tick() {
      time += 0.016

      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.03
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.03
      const mx = smoothMouseRef.current.x
      const my = smoothMouseRef.current.y

      const speedMultiplier = isViewerOpen ? 0.18 : 1.0

      if (!isDraggingRef.current) {
        // Dynamic, graceful ambient drift (responsive on mobile and desktop)
        const ambientDrift = (isMobile ? 0.00032 : 0.00022) * speedMultiplier
        progressRef.current = (progressRef.current + ambientDrift + velocityRef.current * speedMultiplier + 1000) % 1.0

        // Smooth momentum damping for natural glide
        velocityRef.current *= (isMobile ? 0.93 : 0.89)
        if (Math.abs(velocityRef.current) < 0.000005) velocityRef.current = 0
      }

      if (containerRef.current) {
        const tiltX = (my - 0.5) * -3.2
        const tiltY = (mx - 0.5) * 4.0
        containerRef.current.style.transform = `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }

      // ── Circular Orbit Parameters ──
      const centerX = 58
      const centerY = isMobile ? 50 : 48
      const radiusX = isMobile ? 28 : 32
      const radiusY = radiusX * 0.82 // subtle vertical compression for perspective

      let bestFocalStrength = -1
      let bestFocalCard = 0
      let focalPoint = { x: 58, y: 48 }

      for (let i = 0; i < CARD_COUNT; i++) {
        const el = cardRefs.current[i]
        if (!el) continue

        // Evenly distribute cards around the full circle
        const baseAngle = (i / CARD_COUNT) * Math.PI * 2
        const angle = baseAngle + progressRef.current * Math.PI * 2

        // Screen-space angle: offset so angle=0 → 12 o'clock (top)
        const sa = angle - Math.PI / 2

        // Position on elliptical orbit
        let xPct = centerX + radiusX * Math.cos(sa)
        let yPct = centerY + radiusY * Math.sin(sa)

        // Tangent rotation (card follows the arc)
        const tangentDeg = (sa * 180 / Math.PI) + 90

        // Gentle floating breath
        const breatheY = Math.sin(time * 1.4 + i * 0.52) * 0.8

        // Focal strength: strongest at top (sin(sa)=-1), weakest at bottom (sin(sa)=+1)
        const verticalPos = Math.sin(sa)
        const rawFocal = (-verticalPos + 1) / 2
        const focalStrength = Math.pow(Math.max(0, rawFocal), 1.5)

        // Mouse parallax depth
        const parallaxK = 0.3 + focalStrength * 0.6
        const px = (mx - 0.5) * (isMobile ? 3 : 7) * parallaxK
        const py = (my - 0.5) * (isMobile ? 1.5 : 3.5) * parallaxK

        xPct += px * 0.12
        yPct += py * 0.12 + breatheY * 0.1

        // Scale: larger at top, smaller at bottom
        const scale = isMobile
          ? 0.52 + focalStrength * 0.55
          : 0.62 + focalStrength * 0.52

        // Opacity: full in upper arc, faded in lower arc
        let opacity
        if (verticalPos > 0.55) {
          opacity = Math.max(0.04, ((1.0 - verticalPos) / 0.45) * 0.45)
        } else {
          opacity = 0.42 + focalStrength * 0.58
        }

        const zIndex = Math.round(10 + focalStrength * 120)

        // Cull invisible cards
        if (opacity < 0.03) {
          el.style.visibility = 'hidden'
          continue
        }
        el.style.visibility = 'visible'

        el.style.left = `${xPct}%`
        el.style.top = `${yPct}%`
        el.style.zIndex = zIndex
        el.style.opacity = opacity
        el.style.filter = 'none'
        el.style.transform = `translate(-50%, -50%) rotate(${tangentDeg}deg) scale(${scale})`

        if (focalStrength > 0.65) {
          el.style.boxShadow = `0 14px 38px rgba(0, 0, 0, ${0.28 * focalStrength}), 0 0 18px rgba(197, 155, 39, ${0.12 * focalStrength})`
        } else {
          el.style.boxShadow = `0 6px 16px rgba(0, 0, 0, 0.12)`
        }

        // Track the most focal card
        if (focalStrength > bestFocalStrength) {
          bestFocalStrength = focalStrength
          bestFocalCard = i
          focalPoint = { x: xPct, y: yPct }
        }
      }

      focalPosRef.current = focalPoint

      if (Math.abs(time - lastFocalCheck) > 0.15) {
        lastFocalCheck = time
        setFocalCardIndex((prev) => (prev !== bestFocalCard ? bestFocalCard : prev))
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isSectionInView, isViewerOpen])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="ribbon-section relative w-full h-screen h-[100dvh] overflow-hidden select-none"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{
        cursor: isDraggingRef.current ? 'grabbing' : 'grab',
        touchAction: 'pan-y',
      }}
    >

      {/* ── Living Sunlight, Ambient Aura & Golden Dust Particles ── */}
      <LivingAtmosphereCanvas mouseRef={mouseRef} focalPosRef={focalPosRef} isInView={isSectionInView} />

      {/* ── Cinematic Editorial Title Sequence ── */}
      <CinematicHeroTitle activePhoto={cards[focalCardIndex]} />



      {/* ── 3D Master Ribbon Carousel Field (Perspective Matrix) ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out',
        }}
      >
        <RibbonCardsField
          cards={cards}
          cardRefs={cardRefs}
          onPhotoClick={onPhotoClick}
          velocityRef={velocityRef}
        />
      </div>
    </section>
  )
}

export default memo(RibbonCarousel)
