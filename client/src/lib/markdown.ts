export function htmlToMarkdown(html: string): string {
  const temp = document.createElement('div')
  temp.innerHTML = html

  let markdown = ''

  const processNode = (node: Node, indent = 0): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent || ''
      if (text.trim()) {
        text = text.replace(/\*\*(.+?)\*\*/g, '**$1**')
        text = text.replace(/__(.+?)__/g, '**$1**')
        text = text.replace(/(.+?)\*(?!\*)([^*\n]+)\*/g, '*$2*')
        text = text.replace(/(.+?)_(?!_)([^_\n]+)_/g, '_$2_')
        text = text.replace(/`([^`]+)`/g, '`$1`')
      }
      return text
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      const tag = el.tagName.toLowerCase()

      switch (tag) {
        case 'H1': return `# ${processChildren(node)}`
        case 'H2': return `## ${processChildren(node)}`
        case 'H3': return `### ${processChildren(node)}`
        case 'H4': return `#### ${processChildren(node)}`
        case 'P': return `\n${processChildren(node)}\n`
        case 'BR': return '\n'
        case 'B': return `**${processChildren(node)}**`
        case 'STRONG': return `**${processChildren(node)}**`
        case 'I': return `*${processChildren(node)}*`
        case 'EM': return `*${processChildren(node)}*`
        case 'U': return `<u>${processChildren(node)}</u>`
        case 'CODE': return '`' + processChildren(node) + '`'
        case 'PRE': return '\n```\n' + el.textContent + '\n```\n'
        case 'BLOCKQUOTE': return `\n> ${processChildren(node)}\n`
        case 'UL': return `\n${processChildren(node)}\n`
        case 'OL': return `\n${processChildren(node)}\n`
        case 'LI': return `${'  '.repeat(indent)}- ${processChildren(node)}\n`
        case 'A': return `[${processChildren(node)}](${el.getAttribute('href') || ''})`
        case 'IMG': return `![${el.getAttribute('alt') || ''}](${el.getAttribute('src') || ''})`
        case 'DIV': return processChildren(node)
        case 'SPAN': return processChildren(node)
        default: return processChildren(node)
      }
    }

    return ''
  }

  const processChildren = (node: Node): string => {
    let result = ''
    node.childNodes.forEach((child) => {
      result += processNode(child)
    })
    return result
  }

  markdown = processChildren(temp)
  markdown = markdown.replace(/\n{3,}/g, '\n\n').trim()

  return markdown
}

export function downloadMarkdown(title: string, markdown: string) {
  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
