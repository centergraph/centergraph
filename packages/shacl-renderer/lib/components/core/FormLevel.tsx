import { DataFactory } from 'n3'
import { sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { Settings } from '@centergraph/shacl-renderer/lib/types'
import Group from './Group'
import ShaclProperty from './ShaclProperty'
import { ReactNode } from 'react'

type FormLevelProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
  isRoot?: boolean
  children?: ReactNode
}

export default function FormLevel({ shaclPointer, settings, dataPointer, children, isRoot }: FormLevelProps) {
  const shaclProperties = [...shaclPointer.out(sh('property'))]

  const shaclPropertyWidgets = [...shaclProperties]
    .map((shaclProperty) => {
      const group = shaclProperty.out(sh('group')).value ?? 'default'
      const order = shaclProperty.out(sh('order')).value ? parseFloat(shaclProperty.out(sh('order')).value) : 0
      const innerProps = { shaclPointer: shaclProperty, dataPointer, settings }
      const widget = <ShaclProperty key={shaclProperty.term.value} {...innerProps} />
      return { group, order, widget }
    })
    .sort((a, b) => b.order - a.order)

  const groupIdentifiers = new Set(shaclPropertyWidgets.map(({ group }) => group))
  const groups = [...groupIdentifiers.values()].map((groupIdentifier) => {
    const groupPointer = shaclPointer.node([DataFactory.namedNode(groupIdentifier)])

    return (
      <Group settings={settings} key={groupIdentifier} groupPointer={groupPointer}>
        {shaclPropertyWidgets.filter(({ group }) => group === groupIdentifier).map(({ widget }) => widget)}
      </Group>
    )
  })

  return isRoot ? (
    <>
      {groups}
      {children}
    </>
  ) : (
    <div className={settings.cssClasses[settings.mode].formLevel}>
      {groups}
      {children}
    </div>
  )
}
