import { cpSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const source = resolve('app/dist')
const target = resolve('dist')

if (!existsSync(source)) {
  console.error(`Build output not found at ${source}`)
  process.exit(1)
}

rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })
console.log(`Copied ${source} -> ${target}`)
