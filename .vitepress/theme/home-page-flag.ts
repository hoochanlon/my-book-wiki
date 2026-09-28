import { watch } from 'vue'
import { useData } from 'vitepress'

const HOME_ATTR = 'data-home-page'

export const setupHomePageFlag = () => {
  if (typeof window === 'undefined') return

  const { frontmatter } = useData()

  watch(
    () => frontmatter.value.layout,
    (layout) => {
      document.documentElement.toggleAttribute(HOME_ATTR, layout === 'home')
    },
    { immediate: true }
  )
}
