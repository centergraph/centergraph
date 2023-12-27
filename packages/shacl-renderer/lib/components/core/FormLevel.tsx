import { DataFactory } from 'n3'
import { sh } from '../../helpers/namespaces'
import { Settings } from '../../types'
import Group from './Group'
import ShaclProperty from './ShaclProperty'
import { ReactNode } from 'react'

type FormLevelProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
  children?: ReactNode
  htmlChildren?: Array<Element>
}

export default function FormLevel(props: FormLevelProps) {
  const { shaclPointer, settings, dataPointer, children, htmlChildren } = props
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
      <Group key={groupIdentifier} groupPointer={groupPointer}>
        {shaclPropertyWidgets.filter(({ group }) => group === groupIdentifier).map(({ widget }) => widget)}
      </Group>
    )
  })

  return (
    <div
      className={`form-level ps-3 pe-3`}
      ref={(element) => {
        if (!htmlChildren) return
        htmlChildren.forEach((child) => element?.appendChild(child))
      }}
    >
      {groups}
      {children}
    </div>
  )
}
