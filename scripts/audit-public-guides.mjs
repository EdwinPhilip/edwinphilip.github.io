#!/usr/bin/env node
/**
 * Enforce public documentation framing. Portfolio Home and About are
 * intentionally excluded: those pages describe the author's biography.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const root = resolve('docs/guides')
const failures = []
let files = 0
let diagrams = 0
let faqs = 0

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (path.endsWith('.md')) check(path)
  }
}

function check(file) {
  files++
  const source = readFileSync(file, 'utf8')
  const lines = source.split(/\r?\n/)
  let inFence = false
  let fences = 0
  const fencePattern = new RegExp('^\\s*' + String.fromCharCode(96) + '{3,}\\s*([\\w-]*)')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const fence = line.match(fencePattern)
    if (fence) {
      fences++
      inFence = !inFence
      if (fence[1].toLowerCase() === 'mermaid') diagrams++
      continue
    }
    if (inFence) continue
    if (/\b(?:catawiki|hackerrank|interviewer|interview|agent launchpad|kron)\b/i.test(line)) {
      failures.push(file + ':' + (i + 1) + ': employer, private-project or interview framing')
    }
    if (/\b(?:in my experience|at my company|my work at|I built|I implemented|I led)\b/i.test(line)) {
      failures.push(file + ':' + (i + 1) + ': personal work-history framing')
    }
    if (/^#\s+Q\d+(?:\s|[.:·—-])/.test(line)) {
      failures.push(file + ':' + (i + 1) + ': question-coded article heading')
    }
    for (const link of line.matchAll(/\]\((\.\/[^)#]+)(?:#[^)]+)?\)/g)) {
      const href = decodeURIComponent(link[1])
      const dest = resolve(dirname(file), href)
      if (!existsSync(dest) && !existsSync(dest + '.md') &&
          !existsSync(join(dest, 'index.md'))) {
        failures.push(file + ':' + (i + 1) + ': broken relative link ' + href)
      }
    }
  }
  if (inFence || fences % 2 !== 0) {
    failures.push(file + ': unbalanced Markdown code fences')
  }
  if (file.endsWith('/follow-ups.md')) {
    const heading = lines.find(line => line.startsWith('# ')) || ''
    const declared = Number((heading.match(/(\d+)\s+Advanced Technical FAQs/i) || [])[1])
    const actual = lines.filter(line => /^## \d+\./.test(line)).length
    faqs += actual
    if (!declared || declared !== actual) {
      failures.push(file + ': FAQ heading count ' + (declared || '?') + ' does not match ' + actual)
    }
  }
}

walk(root)
console.log('Audited ' + files + ' Markdown guides, ' + faqs + ' FAQs and ' + diagrams + ' Mermaid blocks.')
if (failures.length) {
  for (const problem of failures) console.error('ERROR: ' + problem)
  process.exitCode = 1
} else {
  console.log('Public documentation audit passed.')
}
