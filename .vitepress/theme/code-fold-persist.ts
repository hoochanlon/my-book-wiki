import type { Router } from 'vitepress'

const FOLD_CLASS = 'fold'
const ARROW_SELECTOR = '.code-arrow'
const CODE_SELECTOR = ".vp-doc div[class*='language-']"
const STORAGE_PREFIX = 'book-wiki:code-fold:'

const getStorageKey = () => `${STORAGE_PREFIX}${location.pathname}`

const codeFingerprint = (codeDom: Element, index: number) => {
  const lang = [...codeDom.classList].find((name) => name.startsWith('language-')) ?? ''
  const text = codeDom.querySelector('pre')?.textContent?.slice(0, 80) ?? ''
  return `${index}:${lang}:${text}`
}

const readFoldState = (): Record<string, boolean> => {
  try {
    return JSON.parse(sessionStorage.getItem(getStorageKey()) || '{}') as Record<string, boolean>
  } catch {
    return {}
  }
}

const writeFoldState = (state: Record<string, boolean>) => {
  sessionStorage.setItem(getStorageKey(), JSON.stringify(state))
}

const restoreCodeFolds = () => {
  const saved = readFoldState()
  const next: Record<string, boolean> = {}

  document.querySelectorAll(CODE_SELECTOR).forEach((codeDom, index) => {
    const arrow = codeDom.querySelector(ARROW_SELECTOR)
    if (!arrow) return

    const key = codeFingerprint(codeDom, index)
    const shouldFold = saved[key] ?? arrow.classList.contains(FOLD_CLASS)
    const isFold = arrow.classList.contains(FOLD_CLASS)

    if (shouldFold !== isFold) {
      ;(arrow as HTMLElement).click()
    }

    next[key] = shouldFold
  })

  writeFoldState(next)
}

const persistCodeFolds = () => {
  const saved: Record<string, boolean> = {}

  document.querySelectorAll(CODE_SELECTOR).forEach((codeDom, index) => {
    const arrow = codeDom.querySelector(ARROW_SELECTOR)
    if (!arrow) return
    saved[codeFingerprint(codeDom, index)] = arrow.classList.contains(FOLD_CLASS)
  })

  writeFoldState(saved)
}

export const setupCodeFoldPersist = (router: Router) => {
  if (typeof window === 'undefined') return

  const restore = () => {
    let tries = 0
    const run = () => {
      const ready = document.querySelector(`${CODE_SELECTOR} ${ARROW_SELECTOR}`)
      if (ready || tries > 20) {
        restoreCodeFolds()
        return
      }
      tries += 1
      requestAnimationFrame(run)
    }
    requestAnimationFrame(run)
  }

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null
    if (!target?.closest(`${ARROW_SELECTOR}, .code-block-overlay`)) return
    requestAnimationFrame(persistCodeFolds)
  })

  restore()
  const prev = router.onAfterRouteChange
  router.onAfterRouteChange = async (...args) => {
    await prev?.(...args)
    restore()
  }
}
