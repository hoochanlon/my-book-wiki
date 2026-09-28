import type { Router } from 'vitepress'

const META_SOURCE_SELECTOR = [
  '.tk-article-analyze a[title]',
  '.tk-article-info a[title]',
].join(', ')

const OUTLINE_SOURCE_SELECTOR = [
  '.tk-aside-outline-item a[title]',
  '.VPDocOutlineItem a[title]',
].join(', ')

const SOURCE_SELECTOR = `${META_SOURCE_SELECTOR}, ${OUTLINE_SOURCE_SELECTOR}`

const META_TIP_SELECTOR = [
  '.tk-article-analyze a[data-tip]',
  '.tk-article-info a[data-tip]',
].join(', ')

const OUTLINE_TIP_SELECTOR = [
  '.tk-aside-outline-item a[data-tip]',
  '.VPDocOutlineItem a[data-tip]',
].join(', ')

const isTruncated = (el: HTMLElement) => el.scrollWidth - el.clientWidth > 1

const upgradeNativeTitles = (root: ParentNode = document) => {
  root.querySelectorAll<HTMLElement>(SOURCE_SELECTOR).forEach((el) => {
    const title = el.getAttribute('title')
    if (!title) return
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
    active = anchor
    placeTip(tip, anchor)
  }

  const run = () => requestAnimationFrame(() => upgradeNativeTitles())

  document.addEventListener(
    'mouseover',
    (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const withTitle = target.closest(SOURCE_SELECTOR)
      if (withTitle instanceof HTMLElement) upgradeNativeTitles(withTitle.parentElement ?? document)

      const meta = target.closest(META_TIP_SELECTOR)
      if (meta instanceof HTMLElement) {
        show(meta)
        return
      }

      const outline = target.closest(OUTLINE_TIP_SELECTOR)
      if (outline instanceof HTMLElement && isTruncated(outline)) show(outline)
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
