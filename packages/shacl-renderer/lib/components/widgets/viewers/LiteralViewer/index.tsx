import { WidgetProps } from '../../../../types'

export default function LiteralViewer({ term }: WidgetProps) {
  return <span>{term.value}</span>
}
