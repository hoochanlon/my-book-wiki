import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { defineTeekConfig } from 'vitepress-theme-teek/config'

const teekConfig = defineTeekConfig({
  teekHome: false,
  vpHome: true,
  homeCardListPosition: false,
  sidebarTrigger: true,
  articleUpdate: {
    enabled: false,
  },
  toComment: {
    enabled: false,
  },
  themeEnhance: {
    layoutSwitch: {
      disableHelp: true,
      disableDocMaxWidthHelp: true,
      disablePageMaxWidthHelp: true,
    },
    themeColor: {
      disableHelp: true,
    },
    spotlight: {
      disableHelp: true,
    },
  },
  footerInfo: {
    copyright: {
      createYear: 2026,
      suffix: 'hoochanlon',
    },
  },
  codeBlock: {
    collapseHeight: 700,
  },
  articleAnalyze: {
    showAuthor: false,
    showCreateDate: true,
    showUpdateDate: false,
    dateFormat: 'yyyy-MM-dd',
  },
  docAnalysis: {
    wordCount: true,
    readingTime: true,
  },
  vitePlugins: {
    sidebar: false,
    permalink: false,
    mdH1: false,
  },
})

export default withMermaid(
  withSidebar(
    defineConfig({
    extends: teekConfig,
    title: "读书笔记知识库",
    description: "把一本书蒸馏成可检索、可追溯、可累积的知识库",
    lang: 'zh-CN',
    lastUpdated: true,
    base: '/my-book-wiki/',
    ignoreDeadLinks: true,
    rewrites: {
      'README.md': 'readme.md',
    },

    themeConfig: {
      logo: '/icons/books.svg',
      nav: [
        {
          text: '<span class="nav-home-icon" aria-hidden="true"></span><span class="visually-hidden">首页</span>',
          link: '/',
        },
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

      lastUpdated: {
        text: '上次更新时间',
        formatOptions: {
          dateStyle: 'short',
          timeStyle: 'short',
        },
      },
      editLink: {
        pattern: 'https://github.com/hoochanlon/my-book-wiki/edit/master/:path',
        text: '在 GitHub 上编辑此页',
      },
      docFooter: {
        prev: '上一页',
        next: '下一页',
      },
    },

    markdown: {
      lineNumbers: true
    },

    mermaid: {
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
    excludeByGlobPattern: [
      'index.md',
      'README.md',
      'about.md',
      '.vitepress/**',
      '.github/**',
      'node_modules/**',
    ],
    sortMenusByName: false,
    sortMenusByFrontmatterOrder: false,
    sortMenusOrderByDescending: false,
    collapsed: false,
    capitalizeFirst: false,
    capitalizeEachWords: false,
  })
)
