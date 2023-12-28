import { Settings } from '@/types'
import { DataFactory } from 'n3'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Validator } from 'shacl-engine'
import { reportContext } from './ReportContext'

export default function ReportContextProvider({ children, settings }: { children: ReactNode; settings: Settings }) {
  const [report, setReport] = useState()
  const validator = useMemo(() => new Validator(settings.shaclStore, { factory: DataFactory }), [settings.shaclStore])
  const validate = useMemo(() => () => validator.validate({ dataset: settings.dataStore }).then(setReport), [validator, settings.dataStore])

  useEffect(() => {
    validate()
  }, [validate])

  return (
    <reportContext.Provider
      value={{
        report,
        validate,
      }}
    >
      {children}
    </reportContext.Provider>
  )
}
