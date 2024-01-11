import { DatasetCore } from '@rdfjs/types'
import { createContext } from 'react'
import datasetFactory from '@rdfjs/dataset'

export const state = createContext<{ data: DatasetCore; shacl: DatasetCore }>({
  data: datasetFactory.dataset(),
  shacl: datasetFactory.dataset(),
})
