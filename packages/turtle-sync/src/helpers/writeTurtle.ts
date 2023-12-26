import { Store, Writer, WriterOptions } from '../deps.ts'

export const writeTurtle = (options: WriterOptions & { store: Store }) => {
  return new Promise((resolve, reject) => {
    try {
      const writer = new Writer(options)
      writer.addQuads([...options.store])
      writer.end((_error, result) => {
        resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}
