import { sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { WidgetProps } from '@centergraph/shacl-renderer/lib/types'
import FormLevel from '@centergraph/shacl-renderer/lib/components/core/FormLevel'

export default function BlankNodeViewer({ dataPointer, shaclPointer, settings }: WidgetProps) {
  const node = shaclPointer.out(sh('node')).term
  const nodeShapePointer = shaclPointer.node(node)
  return <FormLevel settings={settings} shaclPointer={nodeShapePointer} dataPointer={dataPointer} />
}
