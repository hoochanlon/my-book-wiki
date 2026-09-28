import type { Router } from 'vitepress'

const aliasReadme = (path: string) => path.replace(/\/README(\.html)?$/, '/readme$1')

export const setupReadmeAlias = (router: Router) => {
  if (typeof window === 'undefined') return

  const redirectIfNeeded = (path = location.pathname) => {
    const next = aliasReadme(path)
    if (next === path) return false
    location.replace(next + location.search + location.hash)
    return true
  }

  if (redirectIfNeeded()) return

  const prev = router.onBeforeRouteChange
  router.onBeforeRouteChange = async (to) => {
    const next = aliasReadme(to)
    if (next !== to) {
      await router.go(next)
      return false
    }
    return prev?.(to)
  }
}
