import { useEffect, useRef, memo } from 'react'

/**
 * Fairy Dust & Golden Sparkle Cursor Trail
 * Creates whimsical twinkling micro-particles on pointer movement.
 */
function SparkleTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Honor prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const particles = []
    const colors = ['#FFD700', '#FFF2B2', '#FFA07A', '#FFB6C1', '#F5D061']

    const addParticle = (x, y) => {
      // Add 2-3 shimmering particles
      const count = Math.random() > 0.4 ? 2 : 1
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 1.5 + 0.5
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4, // Slight upward float
          size: Math.random() * 3.5 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.03 + 0.018,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.1,
        })
      }
    }

    let lastX = 0
    let lastY = 0
    let lastTime = 0

    const handlePointerMove = (e) => {
      const now = performance.now()
      if (now - lastTime < 16) return // 60fps throttle
      lastTime = now

      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX)
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY)
      if (clientX == null || clientY == null) return

      const dist = Math.hypot(clientX - lastX, clientY - lastY)
      if (dist > 3) {
        addParticle(clientX, clientY)
        lastX = clientX
        lastY = clientY
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })

    let animId = null
    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay
        p.rotation += p.spin

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        // Draw 4-point sparkle diamond
        ctx.fillStyle = p.color
        ctx.beginPath()
        const s = p.size
        ctx.moveTo(0, -s)
        ctx.quadraticCurveTo(0, 0, s, 0)
        ctx.quadraticCurveTo(0, 0, 0, s)
        ctx.quadraticCurveTo(0, 0, -s, 0)
        ctx.quadraticCurveTo(0, 0, 0, -s)
        ctx.fill()
        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ willChange: 'contents' }}
    />
  )
}

export default memo(SparkleTrail)
