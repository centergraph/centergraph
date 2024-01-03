import { expect, test } from 'vitest'
import { score } from './meta'
import { schema, sh } from '@centergraph/shacl-renderer/lib/helpers/namespaces'
import { prepareScoreTest } from '@centergraph/shacl-renderer/lib/helpers/prepareTestScore'

test('it scores', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('givenName'))
  const givenScore = score(dataPointer, shaclPointer)
  expect(givenScore).toBe(1)
})

test('it does not score', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('address'))
  const givenScore = score(dataPointer, shaclPointer)
  expect(givenScore).toBe(undefined)
})

test('it scores on datatype', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('givenName'))
  shaclPointer.deleteOut(sh('datatype'))
  const givenScore = score(dataPointer, shaclPointer)
  expect(givenScore).toBe(1)
})
