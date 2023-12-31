import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import { Quad_Graph } from '@rdfjs/types'
import { rdf, sr } from '@shared/namespaces.js'
import { shaclToType } from '@shared/shaclToType.js'
import grapoi from 'grapoi'
import { Request, Response } from 'types-express'

import { context, store } from '../Base.ts'

export const types = async (request: Request, response: Response) => {
  const shapeGraphIris: Quad_Graph[] = [...store.match(null, rdf('type'), sr('MainShape'))].map((quad) => quad.graph)

  let output = ''

  for (const shapeGraphIri of shapeGraphIris) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /** @ts-ignore */
    const shaclQuads = store.match(null, null, null, shapeGraphIri)
    const shaclPointer = grapoi({ dataset: datasetFactory.dataset(shaclQuads), factory })

    output += (await shaclToType(shaclPointer, context, false)) + '\n\n'
  }

  response.set('Content-Type', 'text/plain')
  response.send(output)
}
