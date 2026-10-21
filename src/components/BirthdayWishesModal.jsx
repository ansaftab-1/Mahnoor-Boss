import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Send, Sparkles, Feather, Cake } from 'lucide-react'
import confetti from 'canvas-confetti'

const INITIAL_WISHES = [
  {
    id: 'w1',
    author: 'With all my heart',
    tag: '💖 Love',
    date: 'Forever & Always',
    text: 'Happy Birthday to the most breathtaking soul! May every single dream you carry in your heart blossom into reality this year.',
  },
  {
    id: 'w2',
    author: 'Secret Admirer',
    tag: '✨ Magic',
    date: 'Midnight Wish',
    text: 'Your laugh lights up the entire room and brings a golden warmth wherever you go. Keep shining brightly, beautiful angel!',
  },
  {
    id: 'w3',
    author: 'Forever Bestie',
    tag: '🎂 Birthday',
    date: 'Celebration Day',
    text: 'Here is to endless joy, sweetest memories, countless adventures, and cake! You deserve all the happiness the universe has to offer.',
  },
]

function BirthdayWishesModal({ isOpen, onClose }) {
  const [wishes, setWishes] = useState(() => {
    try {
      const stored = localStorage.getItem('birthday_wishes_notes')
      return stored ? JSON.parse(stored) : INITIAL_WISHES
    } catch {
      return INITIAL_WISHES
    }
  })

  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')
  const [selectedTag, setSelectedTag] = useState('💖 Love')
  const [activeTab, setActiveTab] = useState('read') // 'read' | 'write'

  const tags = ['💖 Love', '🎂 Birthday', '✨ Magic', '🌸 Sweet', '🥂 Cheers']

  useEffect(() => {
    try {
      localStorage.setItem('birthday_wishes_notes', JSON.stringify(wishes))
    } catch {
      // ignore local storage errors
    }
  }, [wishes])

  // Fire celebratory burst
  const handleCelebrateBurst = useCallback(() => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF6B81', '#FFA07A', '#E6C86A'],
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newWish = {
      id: `w_${Date.now()}`,
      author: author.trim() || 'Anonymous Darling',
      tag: selectedTag,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      text: message.trim(),
    }

    setWishes((prev) => [newWish, ...prev])
    setMessage('')
    setAuthor('')
    setActiveTab('read')
    handleCelebrateBurst()
  }

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl max-h-[88vh] flex flex-col rounded-3xl bg-[#faf6ee] text-[#4a3520] border-2 border-[#d4af37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Elegant Header */}
            <div className="relative px-6 py-5 border-b border-[#e5d5be] bg-gradient-to-b from-[#f5ede0] to-[#faf6ee] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#e8d5b5]/60 flex items-center justify-center text-[#996515] border border-[#d4af37]/30 shadow-inner">
                  <Feather size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#422d19]">
                    Wishes & Love Notes
                  </h3>
                  <p className="text-xs text-[#8c6b45] font-light">
                    Little heartfelt reminders of how cherished you are
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#e8d5b5]/50 text-[#7a5933] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sub-navigation tabs */}
            <div className="flex items-center justify-between px-6 pt-3 pb-2 border-b border-[#ebdcc8] bg-[#faf6ee]">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('read')}
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    activeTab === 'read'
                      ? 'bg-[#805523] text-amber-50 shadow-sm'
                      : 'bg-transparent text-[#7a5933] hover:bg-[#ebdcc8]/60'
                  }`}
                >
                  Read Notes ({wishes.length})
                </button>
                <button
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    activeTab === 'write'
                      ? 'bg-[#805523] text-amber-50 shadow-sm'
                      : 'bg-transparent text-[#7a5933] hover:bg-[#ebdcc8]/60'
                  }`}
                >
                  Write a Wish ✍️
                </button>
              </div>

              <button
                onClick={handleCelebrateBurst}
                className="flex items-center gap-1.5 text-xs text-[#996515] hover:text-[#5c3c0a] font-medium transition-colors cursor-pointer"
              >
                <Sparkles size={14} className="text-[#d4af37]" />
                <span>Shower Confetti</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {activeTab === 'read' ? (
                wishes.length === 0 ? (
                  <div className="py-12 text-center text-[#8c6b45]">
                    <Cake className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notes written yet. Be the first to leave one!</p>
                  </div>
                ) : (
                  wishes.map((w) => (
                    <motion.div
                      key={w.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-white/70 border border-[#e5d5be] shadow-[0_2px_8px_rgba(139,94,40,0.06)] hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f3e7d3] text-[#7a5323] font-medium">
                          {w.tag}
                        </span>
                        <span className="text-[11px] text-[#997955] italic">{w.date}</span>
                      </div>
                      <p className="text-sm font-serif leading-relaxed text-[#3d2c1c] italic">
                        &ldquo;{w.text}&rdquo;
                      </p>
                      <div className="mt-2 text-right">
                        <span className="text-xs font-semibold text-[#805523] tracking-wide">
                          — {w.author}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-[#6e4e2a] mb-1.5 uppercase tracking-wider">
                      Pick a theme
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            selectedTag === tag
                              ? 'bg-[#d4af37] text-stone-900 font-semibold shadow-sm scale-105'
                              : 'bg-white/80 text-[#7a5933] border border-[#e2d0b8] hover:bg-[#f5ede0]'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="wish-author"
                      className="block text-xs font-medium text-[#6e4e2a] mb-1 uppercase tracking-wider"
                    >
                      Your Name / Nickname
                    </label>
                    <input
                      id="wish-author"
                      type="text"
                      maxLength={40}
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Always Yours, Sweetheart, Best Friend"
                      className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-[#d6c2a8] text-sm text-[#3d2c1c] placeholder:text-[#b09678] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="wish-message"
                      className="block text-xs font-medium text-[#6e4e2a] mb-1 uppercase tracking-wider"
                    >
                      Your Note / Birthday Wish
                    </label>
                    <textarea
                      id="wish-message"
                      rows={4}
                      maxLength={300}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Pour your heart out with words of love and blessings..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-[#d6c2a8] text-sm text-[#3d2c1c] placeholder:text-[#b09678] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 resize-none font-serif"
                    />
                    <div className="text-right text-[11px] text-[#997955] mt-1">
                      {message.length} / 300
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#996515] to-[#c59b27] hover:from-[#805523] hover:to-[#b3891d] text-white font-medium text-sm tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <Send size={15} />
                    <span>Send Birthday Wish</span>
                  </button>
                </form>
              )}
            </div>

            {/* Footer with Sweet Note */}
            <div className="px-6 py-3 border-t border-[#ebdcc8] bg-[#f5ede0]/60 flex items-center justify-between text-xs text-[#8c6b45]">
              <span className="flex items-center gap-1">
                <Heart size={13} className="text-red-500 fill-red-500" />
                <span>Crafted with endless admiration</span>
              </span>
              <button
                onClick={onClose}
                className="text-[#7a5933] hover:underline cursor-pointer font-medium"
              >
                Back to celebration
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(BirthdayWishesModal)
