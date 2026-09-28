import { copyFileSync, existsSync, realpathSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '../.vitepress/dist')
const src = join(dist, 'readme.html')
const dest = join(dist, 'README.html')

if (!existsSync(src)) {
  console.warn('[alias-readme] skip: readme.html 不存在')
  process.exit(0)
}

try {
  if (existsSync(dest) && realpathSync(src) === realpathSync(dest)) {
    console.log('[alias-readme] 文件系统不区分大小写，跳过复制')
    process.exit(0)
  }
} catch {
  // 目标还不存在，或无法比较 inode 时继续复制
}

copyFileSync(src, dest)
console.log('[alias-readme] 已生成 README.html')
