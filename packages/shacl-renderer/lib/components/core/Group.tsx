import { ReactNode } from 'react'
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

  const settingsCssClasses = settings.cssClasses[settings.mode].group.replace('[ID]', groupClassName ?? '')
  const skipWrapper = groupPointer.term.value === 'default' || !settingsCssClasses

  return children ? (
    skipWrapper ? (
      <>
        {label ? <h4 className="form-label">{label}</h4> : null}
        {children}
      </>
    ) : (
      <div className={`${settingsCssClasses} ${shaclCssClasses}`}>
        {label ? <h4 className="form-label">{label}</h4> : null}
        {children}
      </div>
    )
  ) : null
}
