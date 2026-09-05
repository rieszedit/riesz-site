import { useEffect, useRef, useState } from 'react'
import type { Lang } from './commission-content'

import { turnstileSiteKey } from './turnstile-config'

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string
  remove: (id: string) => void
  reset: (id: string) => void
}
declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

let scriptPromise: Promise<Turnstile> | undefined
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!scriptPromise) {
    scriptPromise = new Promise<Turnstile>((resolve, reject) => {
      const script = document.createElement('script')
      const timer = window.setTimeout(fail, 15_000)
      function fail() {
        clearTimeout(timer)
        script.remove()
        scriptPromise = undefined
        reject(new Error('Verification could not load'))
      }
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onerror = fail
      script.onload = () => {
        clearTimeout(timer)
        if (window.turnstile) resolve(window.turnstile)
        else fail()
      }
      document.head.append(script)
    })
  }
  return scriptPromise
}

export function ContactChallenge({
  lang,
  reset,
  onReady,
}: {
  lang: Lang
  reset: number
  onReady: (ready: boolean) => void
}) {
  const container = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!turnstileSiteKey || !container.current) return
    let cancelled = false
    const target = container.current
    const size = target.clientWidth < 300 ? 'compact' : 'flexible'
    const resizeObserver = new ResizeObserver(() => {
      if ((target.clientWidth < 300 ? 'compact' : 'flexible') !== size) {
        resizeObserver.disconnect()
        setAttempt(value => value + 1)
      }
    })
    resizeObserver.observe(target)
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        loadTurnstile()
          .then((api) => {
            if (cancelled) return
            widget.current = api.render(target, {
              sitekey: turnstileSiteKey,
              theme: 'dark',
              size,
              language: lang,
              callback: () => {
                onReady(true)
                setFailed(false)
              },
              'expired-callback': () => onReady(false),
              'error-callback': () => {
                onReady(false)
                setFailed(true)
              },
              'timeout-callback': () => {
                onReady(false)
                setFailed(true)
              },
            })
          })
          .catch(() => {
            if (!cancelled) {
              onReady(false)
              setFailed(true)
            }
          })
      },
      { rootMargin: '500px' },
    )
    observer.observe(target)
    return () => {
      cancelled = true
      observer.disconnect()
      resizeObserver.disconnect()
      if (widget.current !== null) window.turnstile?.remove(widget.current)
      widget.current = null
      onReady(false)
    }
  }, [lang, attempt, onReady])

  useEffect(() => {
    if (reset && widget.current !== null) {
      onReady(false)
      window.turnstile?.reset(widget.current)
    }
  }, [reset, onReady])

  if (!turnstileSiteKey) return null
  return (
    <div className="contact-challenge">
      <div ref={container} />
      {failed && (
        <div role="alert">
          <p>
            {lang === 'ja'
              ? 'ボット確認を完了できません。再試行するか、下のメールからご連絡ください。'
              : 'Verification could not complete. Retry or use the email option below.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setFailed(false)
              setAttempt((value) => value + 1)
            }}
          >
            {lang === 'ja' ? '確認を再試行' : 'Retry verification'}
          </button>
        </div>
      )}
    </div>
  )
}
