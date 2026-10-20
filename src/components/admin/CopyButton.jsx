import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button type="button" className="btn-link" onClick={copy}>
      {copied ? <Check size={15} /> : <Copy size={15} />}
      {copied ? 'Copiado' : label}
    </button>
  )
}