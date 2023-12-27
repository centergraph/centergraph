import { sh } from '@/helpers/namespaces'
import { WidgetProps } from '@/types'
import FormLevel from '@/components/core/FormLevel'
import './style.css'

export default function BlankNodeEditor({ dataPointer, shaclPointer, settings }: WidgetProps) {
  const node = shaclPointer.out(sh('node')).term
  const nodeShapePointer = shaclPointer.node(node)
  return <FormLevel key={dataPointer.term.value} settings={settings} shaclPointer={nodeShapePointer} dataPointer={dataPointer}></FormLevel>
}
