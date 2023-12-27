import { sh } from '../../helpers/namespaces'
import { Settings } from '../../types'
import ShaclProperty from './ShaclProperty'

type FormLevelProps = {
  shaclPointer: GrapoiPointer
  dataPointer: GrapoiPointer
  settings: Settings
}

export default function FormLevel({ shaclPointer, dataPointer, settings }: FormLevelProps) {
  const shaclProperties = [...shaclPointer.out(sh('property'))]

  return [...shaclProperties].map((shaclProperty) => (
    <ShaclProperty dataPointer={dataPointer} settings={settings} key={shaclProperty.term.value} shaclPointer={shaclProperty} />
  ))
}
