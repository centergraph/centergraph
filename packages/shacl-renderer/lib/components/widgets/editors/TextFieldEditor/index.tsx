import { DataFactory } from 'n3'
import { WidgetProps } from '@/types'

export default function TextFieldEditor({ term, setTerm, settings, className }: WidgetProps) {
  return (
    <input
      className={`${settings.cssClasses.input} ${className}`}
      value={term.value}
      onChange={(event) => setTerm(DataFactory.literal(event.target.value))}
    />
  )
}
