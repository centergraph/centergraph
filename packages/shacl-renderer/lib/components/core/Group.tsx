import { ReactNode, createElement } from 'react'
import { rdfs, sh, sr } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { lastPart } from '@centergraph/shacl-renderer/lib/helpers/lastPart'
import { Settings } from '@centergraph/shacl-renderer/lib/types'

export default function Group({
  children,
  groupPointer,
  settings,
}: {
  children?: ReactNode
  groupPointer: GrapoiPointer
  settings: Settings
}) {
  const label = groupPointer.out([sh('name'), rdfs('label')]).values[0]
  const groupClassName = lastPart(groupPointer.term)?.toLocaleLowerCase().replace(/ /g, '-')
  const shaclCssClasses = groupPointer.out(sr('class')).values.join(' ')

  const settingsCssClasses = settings.cssClasses[settings.mode].group.replace('[ID]', groupClassName ?? '').trim()
  const skipWrapper = groupPointer.term.value === 'default' || !settingsCssClasses
  const className = `${settingsCssClasses} ${shaclCssClasses}`.trim()

  const wrapper = (children: ReactNode) =>
    createElement(groupPointer.out(sr('element')).value ?? 'div', { className }, children)

  const inner = (
    <>
      {label ? <h4 className="form-label">{label}</h4> : null}
      {Array.isArray(children) ? children.flatMap((child) => [child, ' ']) : children}
    </>
  )

  return children ? (skipWrapper ? inner : wrapper(inner)) : null
}
