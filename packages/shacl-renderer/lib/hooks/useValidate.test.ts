import { expect, test } from 'vitest'
import { useValidate, reportSignal } from './useValidate'
import { renderHook } from '@testing-library/react-hooks/dom'
import datasetFactory from '@rdfjs/dataset'
import { Settings } from '@/types'
import defaultCssClasses from '@/defaultCssClasses'
import { prepare } from '@/helpers/getBestWidget.test'
import { rdf, schema, sh } from '@/helpers/namespaces'
import BrokenJohnDoe from '@/../public/broken-john-doe.ttl?raw'
import { Parser } from 'n3'
import parsePath from 'shacl-engine/lib/parsePath'

test('that returns the signal', async () => {
  const { shaclPointer, targetMetas, loaders, shaclDataset } = await prepare('edit')

  const parser = new Parser()
  const quads = await parser.parse(BrokenJohnDoe)
  const dataDataset = datasetFactory.dataset(quads)

  const settings: Settings = {
    fetch: fetch.bind(globalThis),
    mode: 'edit',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: targetMetas,
      viewers: [],
    },
    widgetLoaders: loaders,
    dataDataset,
    shaclDataset,
    cssClasses: defaultCssClasses('edit'),
  }

  const output = renderHook(() => useValidate(settings))
  expect(output.result.current.reportSignal.value).toBe(null)

  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('birthDate')).value)

  const path = parsePath(specificShaclPointer.out(sh('path')))

  const messages1 = output.result.current.getErrorMessages(reportSignal, path)
  expect(messages1).toStrictEqual([])

  await output.result.current.validate()

  const messages2 = output.result.current.getErrorMessages(reportSignal, path)

  expect(messages2).toStrictEqual(['Value does not have datatype <http://www.w3.org/2001/XMLSchema#date>'])
})
