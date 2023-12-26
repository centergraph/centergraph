import { Store, Writer, WriterOptions } from '../deps.ts'

export const writeTurtle = (options: WriterOptions & { store: Store }) => {
  return new Promise((resolve, reject) => {
    const writer = new Writer(options)
    writer.addQuads([...options.store])
    writer.end((error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
}
