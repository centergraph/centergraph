import { WidgetProps } from '@centergraph/shacl-renderer/lib/types'
import './style.css'

export default function LiteralViewer({ term }: WidgetProps) {
  return <>{term.value}</>
}
