'use client'

import { useEffect, useState } from 'react'

const INTRO_KEY = 'oxido-intro-seen'
const INTRO_DURATION_MS = 8000
const EXIT_DURATION_MS = 850

const LETTERS = [
  { char: 'Ó', lx: '-18px', ly: '-26px', lr: '-7deg' },
  { char: 'X', lx: '22px', ly: '18px', lr: '5deg' },
  { char: 'I', lx: '-10px', ly: '24px', lr: '4deg' },
  { char: 'D', lx: '16px', ly: '-20px', lr: '-5deg' },
  { char: 'O', lx: '-14px', ly: '14px', lr: '6deg' },
]

/**
 * Pantalla de entrada: el isotipo se traza como una grieta y el nombre se
 * ensambla en fragmentos. Se reproduce una sola vez por sesión (sessionStorage)
 * y se omite por completo si el visitante tiene activado "reducir movimiento".
 */
export function Intro() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    setMounted(true)

    const alreadySeen = sessionStorage.getItem(INTRO_KEY)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (alreadySeen || prefersReducedMotion) {
      sessionStorage.setItem(INTRO_KEY, '1')
      return
    }

    setVisible(true)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const exitTimer = setTimeout(() => setExiting(true), INTRO_DURATION_MS - EXIT_DURATION_MS)
    const endTimer = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = previousOverflow
      sessionStorage.setItem(INTRO_KEY, '1')
    }, INTRO_DURATION_MS)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(endTimer)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  function skip() {
    setExiting(true)
    setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ''
      sessionStorage.setItem(INTRO_KEY, '1')
    }, EXIT_DURATION_MS)
  }

  if (!mounted || !visible) return null

  return (
    <div className={`intro-overlay fixed inset-0 z-[100] bg-background ${exiting ? 'intro-exit' : ''}`}>
      <span className="sr-only">Cargando el sitio de ÓXIDO</span>
      <div className="flex h-full flex-col items-center justify-center gap-6" aria-hidden="true">
        <svg viewBox="0 0 32 32" fill="none" className="size-16 text-primary md:size-20">
          <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" className="intro-mark-circle" />
          <path
            d="M9 7.5 L15 14 L13 16.5 L18.5 20 L17 22 L23.5 26"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
            className="intro-mark-crack"
          />
        </svg>
        <h2 className="font-display flex text-6xl md:text-8xl">
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className="intro-letter inline-block"
              style={
                {
                  '--lx': letter.lx,
                  '--ly': letter.ly,
                  '--lr': letter.lr,
                  animationDelay: `${1.5 + i * 0.1}s`,
                } as React.CSSProperties
              }
            >
              {letter.char}
            </span>
          ))}
        </h2>
      </div>
      <button
        type="button"
        onClick={skip}
        className="absolute bottom-8 right-8 text-sm text-muted-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
      >
        Saltar
      </button>
    </div>
  )
}
