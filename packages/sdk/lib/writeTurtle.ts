import { Writer } from 'n3'
import { Quad } from '@rdfjs/types'

export const writeTurtle = async (quads: Quad[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const writer = new Writer()
    writer.addQuads(quads)
    writer.end((error, result) => {
      if (error) reject(error)
      if (result) resolve(result)
    })
  })
}
