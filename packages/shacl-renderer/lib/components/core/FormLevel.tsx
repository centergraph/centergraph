import { sh } from '../../helpers/namespaces'
import { Settings } from '../../types'
import ShaclProperty from './ShaclProperty'

type FormLevelProps = {
  shaclPointer: GrapoiPointer
  settings: Settings
}

export default function FormLevel({ shaclPointer, settings }: FormLevelProps) {
  const shaclProperties = [...shaclPointer.out(sh('property'))]

  return [...shaclProperties].map((shaclProperty) => (
    <ShaclProperty settings={settings} key={shaclProperty.term.value} shaclPointer={shaclProperty} />
  ))
}
