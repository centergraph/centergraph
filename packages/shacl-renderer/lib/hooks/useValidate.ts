import { Signal, signal } from '@preact/signals-react'
import { Validator } from 'shacl-engine'
import { DataFactory } from 'n3'
import isEqual from 'lodash-es/isEqual'
import { Term } from '@rdfjs/types'
import { useContext } from 'react'
import { state } from '@centergraph/shacl-renderer/lib/context/state'

export const reportSignal = signal<unknown>(null)
let validate: undefined | (() => void) = undefined

const getErrorMessages = (reportSignal: Signal<any>, path: unknown) => {
  const errors = reportSignal.value?.results?.filter((result: { path: unknown }) => isEqual(result.path, path)) ?? []
  return errors.flatMap((error: { message: Array<Term> }) => error.message.flatMap((message: Term) => message.value))
}

export const useValidate = () => {
  const { data, shacl } = useContext(state)

  if (!validate) {
    const validator = new Validator(shacl, { factory: DataFactory })
    validate = async () => {
      await validator.validate({ dataset: data }).then((report: unknown) => {
        reportSignal.value = report
      })
    }
    validate()
  }

  return {
    reportSignal,
    validate,
    getErrorMessages,
  }
}
