import factory from '@rdfjs/data-model'
import datasetFactory from '@rdfjs/dataset'
import namespace from '@rdfjs/namespace'
import { faker } from 'faker'
import grapoi from 'grapoi'
import { emptyDir } from 'https://deno.land/std@0.212.0/fs/empty_dir.ts'
import { ensureDir } from 'https://deno.land/std@0.212.0/fs/ensure_dir.ts'
import { Parser, Writer } from 'n3'

const rdf = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const fake = namespace('https://fakerjs.dev/')
const sh = namespace('http://www.w3.org/ns/shacl#')
const xsd = namespace('http://www.w3.org/2001/XMLSchema#')

const folder = '../../data/address-book'
const context = JSON.parse(Deno.readTextFileSync(`${folder}/context.json`))
delete context['@vocab']

const shaclFilePath = Deno.args[0]
if (!shaclFilePath) throw new Error('No SHACL argument given')
const shaclFile = Deno.readTextFileSync(shaclFilePath.split('#')[0])

const outputFolder = Deno.args[1]

if (outputFolder && !outputFolder.endsWith('/')) throw new Error('The output folder must end with a /')

const amount = Deno.args[2] ? parseInt(Deno.args[2]) : 1
const shapesGraph = Deno.args[3]
const parser = new Parser()
const quads = await parser.parse(shaclFile)
const dataset = datasetFactory.dataset(quads)
const relativeIri = shaclFilePath.split('#')[1] ? `#${shaclFilePath.split('#')[1]}` : ''
const pointer = grapoi({ dataset, factory, term: factory.namedNode(relativeIri) })

type FakerValue = string | Date | number
type FakerGenerator = () => FakerValue

const getFakerGenerator = (dotSeparatedString: string, pointer: any): FakerGenerator => {
  const parts = dotSeparatedString.split('.')

  for (const part of parts) {
    pointer = pointer[part]
  }

  return pointer as unknown as FakerGenerator
}

type FakerState = { [key: string]: FakerValue }

const processLevel = (
  shapePointer: any,
  dataPointer: any,
  state: FakerState,
  nameParts: string[] = [],
  root?: boolean
) => {
  const shaclProperties = [...shapePointer.distinct().out(sh('property'))].sort((a, b) => {
    const shOrderA = a.out(sh('order')).value
    const orderA = shOrderA ? parseFloat(shOrderA) : 0

    const shOrderB = b.out(sh('order')).value
    const orderB = shOrderB ? parseFloat(shOrderB) : 0

    return orderA - orderB
  })

  if (root) {
    dataPointer.addOut(sh('shapesGraph'), factory.namedNode(shapesGraph))
  }

  if (shapePointer.out(sh('targetClass')).term) {
    dataPointer.addOut(rdf('type'), shapePointer.out(sh('targetClass')).term)
  }

  for (const shaclProperty of shaclProperties) {
    const pathPredicate = shaclProperty.out(sh('path')).term
    const fakerGeneratorString = shaclProperty.out(fake('generator')).value?.split('/').pop() as string

    const isNamePart = !!shaclProperty.hasOut(rdf('type'), fake('namePart')).ptrs.length

    if (pathPredicate && fakerGeneratorString) {
      let value = null

      if (state[fakerGeneratorString]) {
        value = state[fakerGeneratorString]
      }

      const fakerGenerator = getFakerGenerator(fakerGeneratorString, faker)

      if (!value && fakerGenerator) {
        value = fakerGenerator()
      }

      if (value instanceof Date) {
        dataPointer.addOut(pathPredicate, factory.literal(value.toISOString().split('T')[0], xsd('date')))
      } else if (typeof value === 'number') {
        dataPointer.addOut(pathPredicate, factory.literal(value.toString()))
      } else if (typeof value === 'string') {
        dataPointer.addOut(pathPredicate, factory.literal(value))
      }

      if (isNamePart && value) {
        nameParts.push(value.toString())
      }
    }

    const node = shaclProperty.out(sh('node')).term
    const nodeShapePointer = shaclProperty.node(node)
    if (node && nodeShapePointer) {
      const blank = factory.blankNode()
      dataPointer.addOut(pathPredicate, blank)
      const blankPointer = dataPointer.node(blank)
      processLevel(nodeShapePointer, blankPointer, state, nameParts)
    }
  }
}

const shape = pointer.hasOut(rdf('type'))

const createItem = () => {
  const dataset = datasetFactory.dataset()
  const dataPointer = grapoi({ dataset, factory, term: factory.namedNode('') })

  const sex = faker.person.sexType()
  const firstName = faker.person.firstName(sex)
  const lastName = faker.person.lastName()
  const email = faker.internet.email({ firstName, lastName })

  const state = {
    'person.sexType': sex,
    'person.firstName': firstName,
    'person.lastName': lastName,
    'person.email': email,
  }

  const nameParts: string[] = []
  processLevel(shape, dataPointer, state, nameParts, true)

  return {
    dataset,
    name: nameParts.join('-').toLocaleLowerCase(),
  }
}

await ensureDir(outputFolder)
await emptyDir(outputFolder)

for (let i = 0; i < amount; i++) {
  const writer = new Writer({
    prefixes: context,
  })
  const { dataset, name } = createItem()
  writer.addQuads([...dataset])
  writer.end((error, output) => {
    Deno.writeTextFileSync(`${outputFolder}${name}.ttl`, output)
  })
}
