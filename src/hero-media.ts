export type HeroMediaSignals = {
  reducedMotion: boolean
  saveData: boolean
}

export type SaveDataConnection = {
  saveData?: boolean
  addEventListener?: (type: 'change', listener: EventListener) => void
  removeEventListener?: (type: 'change', listener: EventListener) => void
}

type NavigatorWithConnection = Navigator & {
  connection?: SaveDataConnection
}

export function shouldRenderStaticHero(signals: HeroMediaSignals) {
  return signals.reducedMotion || signals.saveData
}

export function getSaveDataConnection(): SaveDataConnection | undefined {
  try {
    return (navigator as NavigatorWithConnection).connection
  } catch {
    return undefined
  }
}

export function readBrowserHeroMediaSignals(): HeroMediaSignals {
  try {
    return {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      saveData: getSaveDataConnection()?.saveData === true,
    }
  } catch {
    return { reducedMotion: false, saveData: false }
  }
}

export function shouldRenderStaticHeroFromBrowser() {
  return shouldRenderStaticHero(readBrowserHeroMediaSignals())
}
