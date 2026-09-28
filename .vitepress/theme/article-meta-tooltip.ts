import type { Router } from 'vitepress'

const TITLE_SELECTOR = '[title]'
const TIP_SELECTOR = '[data-tip]'
const OUTLINE_SELECTOR = '.tk-aside-outline-item, .VPDocOutlineItem, .VPDocAsideOutline'
const SKIP_SELECTOR = [
  '.VPSwitchAppearance',
  '.color-list',
  '.tk-theme-enhance h3',
].join(', ')

const isTruncated = (el: HTMLElement) => el.scrollWidth - el.clientWidth > 1

const visibleText = (el: HTMLElement) => el.innerText.replace(/\s+/g, ' ').trim()

const shouldSkip = (el: HTMLElement) => {
  if (el.closest(SKIP_SELECTOR)) return true

  const segmented = el.closest('.tk-segmented-item')
  if (segmented instanceof HTMLElement && visibleText(segmented)) return true

  const outline = el.closest(OUTLINE_SELECTOR)
  if (outline && !isTruncated(el)) return true

  const text = visibleText(el)
  const tip = el.getAttribute('data-tip') || el.getAttribute('title') || ''
  if (text && (text === tip || tip.includes(text))) return true

  return false
}

const upgradeNativeTitles = (root: ParentNode = document) => {
  root.querySelectorAll<HTMLElement>(TITLE_SELECTOR).forEach((el) => {
    if (el.closest('.wiki-tip')) return
    const title = el.getAttribute('title')?.trim()
    if (!title) return
    if (shouldSkip(el)) {
      el.removeAttribute('title')
      el.removeAttribute('data-tip')
      return
    }
    el.setAttribute('data-tip', title)
    el.removeAttribute('title')
  })
}

const createTipEl = () => {
  const el = document.createElement('div')
  el.className = 'wiki-tip'
  el.setAttribute('role', 'tooltip')
  document.body.appendChild(el)
  return el
}

const placeTip = (tip: HTMLElement, anchor: HTMLElement) => {
  const text = anchor.getAttribute('data-tip')
  if (!text) return

  tip.textContent = text
  tip.classList.add('is-show')

  const gap = 8
  const rect = anchor.getBoundingClientRect()
  const tipRect = tip.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  let top = rect.top - tipRect.height - gap
  let left = rect.left + rect.width / 2 - tipRect.width / 2

  if (top < gap) top = Math.min(rect.bottom + gap, vh - tipRect.height - gap)
  if (left < gap) left = gap
  if (left + tipRect.width > vw - gap) left = vw - tipRect.width - gap

  tip.style.top = `${Math.round(top)}px`
  tip.style.left = `${Math.round(left)}px`
}

export const setupArticleMetaTooltip = (router: Router) => {
  if (typeof window === 'undefined') return

  const tip = createTipEl()
  let active: HTMLElement | null = null

  const hide = () => {
    active = null
    tip.classList.remove('is-show')
  }

  const show = (anchor: HTMLElement) => {
    if (shouldSkip(anchor) || !anchor.getAttribute('data-tip')) {
      hide()
      return
    }
    active = anchor
    placeTip(tip, anchor)
  }

  const run = () => requestAnimationFrame(() => upgradeNativeTitles())

  document.addEventListener(
    'mouseover',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('.wiki-tip')) return

      const titled = target.closest(`${TITLE_SELECTOR}, ${TIP_SELECTOR}`)
      if (!(titled instanceof HTMLElement)) return

      upgradeNativeTitles(titled)
      show(titled)
    },
    true
  )

  document.addEventListener(
    'mouseout',
    (event) => {
      const next = event.relatedTarget
      if (next instanceof Node && tip.contains(next)) return
      if (active && next instanceof Node && active.contains(next)) return
      hide()
    },
    true
  )

  document.addEventListener('scroll', hide, true)
  window.addEventListener('resize', hide)

  const observer = new MutationObserver(() => run())
  observer.observe(document.body, { childList: true, subtree: true })

  run()
  const prev = router.onAfterRouteChange
  router.onAfterRouteChange = async (...args) => {
    await prev?.(...args)
    hide()
    run()
  }
}
