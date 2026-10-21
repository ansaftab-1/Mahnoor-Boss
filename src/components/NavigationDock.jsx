import { useState, useEffect, memo } from 'react'
import { Sparkles, Film, BookOpen, Orbit, ChevronRight } from 'lucide-react'

const SECTIONS = [
  { id: 'birthday-finale', label: 'Celebration', icon: Sparkles },
  { id: 'memories-universe', label: 'Moments', icon: Film },
  { id: 'sketchbook-section', label: 'Sketchbook', icon: BookOpen },
  { id: 'wobble-fence-page', label: '3D Cosmos', icon: Orbit },
]

function NavigationDock() {
  const [activeSection, setActiveSection] = useState('birthday-finale')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <aside
      aria-label="Section navigation"
      className="fixed left-4 bottom-6 z-40 flex items-end select-none font-sans"
    >
      <div className="relative">
        {/* Collapsed / Expanded Dock */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-amber-300/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Toggle pill on mobile */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-full text-amber-200 hover:text-amber-100 transition-colors"
            aria-label="Toggle section menu"
          >
            <ChevronRight
              size={16}
              className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Section Items */}
          <div className={`${isOpen ? 'flex' : 'hidden'} sm:flex items-center gap-1`}>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id

              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-stone-950 shadow-md font-semibold'
                      : 'text-amber-100/80 hover:text-amber-200 hover:bg-white/10'
                  }`}
                  aria-label={`Jump to ${sec.label}`}
                >
                  <Icon size={13} className={isActive ? 'text-stone-950' : 'text-amber-300'} />
                  <span className="hidden md:inline">{sec.label}</span>

                  {/* Tooltip on smaller screens */}
                  <span className="md:hidden absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-stone-900/90 text-[10px] text-amber-100 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-amber-400/20">
                    {sec.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default memo(NavigationDock)
