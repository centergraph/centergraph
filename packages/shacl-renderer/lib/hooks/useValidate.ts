import { useSignals } from '@preact/signals-react/runtime'
import { Signal, signal } from '@preact/signals-react'
import { Validator } from 'shacl-engine'
import { Settings } from '@/types'
import { DataFactory } from 'n3'
import * as _ from 'lodash-es'
import { Term } from '@rdfjs/types'

const reportSignal = signal<unknown>(null)
let validate: undefined | (() => void) = undefined

const getErrorMessages = (reportSignal: Signal<any>, path: unknown) => {
  const errors = reportSignal.value?.results?.filter((result: { path: unknown }) => _.isEqual(result.path, path)) ?? []
  return errors.flatMap((error: { message: Array<Term> }) => error.message.flatMap((message: Term) => message.value))
}

export const useValidate = (settings: Settings) => {
  if (!validate) {
    const validator = new Validator(settings.shaclStore, { factory: DataFactory })
    validate = () => {
      validator.validate({ dataset: settings.dataStore }).then((report: unknown) => {
        reportSignal.value = report
      })
    }
    validate()
  }

  useSignals()
  return {
    reportSignal,
    validate,
    getErrorMessages,
  }
}
