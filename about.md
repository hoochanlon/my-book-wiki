---
layout: home
sidebar: false
prev: false
next: false

hero:
  name: "关于项目"
  text: "这个知识库怎么跑"
  tagline: 自动目录从哪来、同类工具怎么做、本地怎么启停
  image:
    src: /icons/books.svg
    alt: 关于项目
  actions:
    - theme: brand
      text: 开始阅读
      link: /readme
    - theme: alt
      text: 返回首页
      link: /

features:
  - icon: 📂
    title: 自动目录
    details: 左侧栏由 vitepress-sidebar 扫描文件夹生成。笔记丢进分类目录就会出现，不必改配置。菜单名来自一级标题或 frontmatter title
  - icon: 🗺️
    title: 文件夹即目录
    details: Starlight、Docusaurus、MkDocs 是官方能力；VitePress 交给插件。本仓库换来「丢进文件夹就能进侧栏」
  - icon: 💻
    title: 本地预览
    details: Node 20+，仓库根目录 npm install && npm run docs:dev。地址必须带 /my-book-wiki/ 前缀，直接打开 / 会 404
  - icon: ⏹
    title: 停掉进程
    details: 终端 Ctrl+C。仍占 5173 时用 pkill -f "vitepress dev"，不要乱杀 node
---
