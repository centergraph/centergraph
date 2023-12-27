import { DataFactory } from 'n3'
import { WidgetProps } from '@/types'

export default function TextFieldEditor({ term, setTerm, settings }: WidgetProps) {
  return (
    <input
      className={settings.cssClasses.input}
      value={term.value}
      onChange={(event) => setTerm(DataFactory.literal(event.target.value))}
    />
  )
}
