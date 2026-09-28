import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  withSidebar(
    defineConfig({
    title: "读书笔记知识库",
    description: "把一本书蒸馏成可检索、可追溯、可累积的知识库",
    base: '/my-book-wiki/',
    ignoreDeadLinks: true,
    rewrites: {
      'README.md': 'readme.md',
    },

    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: '/icons/books.svg',
      nav: [
        { text: '首页', link: '/' },
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/hoochanlon/my-book-wiki' }
      ],

      search: {
        provider: 'local',
        options: {
          translations: {
            button: {
              buttonText: '搜索',
              buttonAriaLabel: '搜索文档',
            },
          },
        },
      },

      // 关闭文档底部的"最近更新"时间戳
      lastUpdated: false,

      // Teek：关闭文章页底部「最近更新」栏
      articleUpdate: {
        enabled: false,
      },

      // Teek：关闭右下角「滚动到评论区」按钮
      toComment: {
        enabled: false,
      },

      // Teek 主题配置
      homeCardListPosition: false, // 关闭首页右侧卡片栏
      sidebarTrigger: true, // 文章页显示侧边栏折叠按钮

      // 只留 Teek 页脚，避免和 VitePress footer 各写一遍版权
      footerInfo: {
        copyright: {
          createYear: 2026,
          suffix: 'hoochanlon',
        },
      },

      // 超高代码块默认折叠；展开/折叠状态由主题侧 sessionStorage 记住
      codeBlock: {
        collapseHeight: 700,
      },
    },

    markdown: {
      lineNumbers: true
    },

    // SSR 时让 Vite 打包 teek，避免 Node 解析 vitepress/theme 的无后缀导入失败
    vite: {
      ssr: {
        noExternal: ['vitepress-theme-teek'],
      },
    },

    // Mermaid 配置（可选）
    mermaid: {
      // 主题配置
    }
  }),
  {
    documentRootPath: '/',
    scanStartPath: null,
    resolvePath: '/',
    useTitleFromFileHeading: true,
    useTitleFromFrontmatter: true,
    frontmatterTitleFieldName: 'title',
    useFolderTitleFromIndexFile: false,
    useFolderLinkFromIndexFile: false,
    hyphenToSpace: true,
    underscoreToSpace: true,
    excludeFiles: ['index.md', 'README.md'],
    excludeFolders: ['.vitepress', '.github', 'node_modules'],
    sortMenusByName: false,
    sortMenusByFrontmatterOrder: false,
    sortMenusOrderByDescending: false,
    collapsed: false,
    capitalizeFirst: false,
    capitalizeEachWords: false,
    rootGroupCollapsed: false,
  })
)
