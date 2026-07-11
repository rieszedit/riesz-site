export type Language = 'ja' | 'en'

export const LANGUAGE_STORAGE_KEY = 'riesz-language'

type ReadStorage = Pick<Storage, 'getItem'>
type WriteStorage = Pick<Storage, 'setItem'>

export function readLanguagePreference(storage: ReadStorage): Language {
  try {
    return storage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'ja'
  } catch {
    return 'ja'
  }
}

export function writeLanguagePreference(
  storage: WriteStorage,
  language: Language,
) {
  try {
    storage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // The visible language still changes when storage is unavailable.
  }
}

export function readBrowserLanguagePreference(): Language {
  try {
    return readLanguagePreference(window.localStorage)
  } catch {
    return 'ja'
  }
}

export function writeBrowserLanguagePreference(language: Language) {
  try {
    writeLanguagePreference(window.localStorage, language)
  } catch {
    // The visible language still changes when storage is unavailable.
  }
}
