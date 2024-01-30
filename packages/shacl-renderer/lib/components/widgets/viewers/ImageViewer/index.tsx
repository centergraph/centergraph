import { WidgetProps } from '@centergraph/shacl-renderer/lib/types'

export default function LiteralViewer({ term }: WidgetProps) {
  return <>{term.value}</>
}
