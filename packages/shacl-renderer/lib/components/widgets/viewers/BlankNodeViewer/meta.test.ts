import { expect, test } from 'vitest'
import { score } from './meta'
import { schema, sh } from '@/helpers/namespaces'
import { prepareScoreTest } from '@/helpers/prepareTestScore'

test('it scores', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('address'))
  const givenScore = score(dataPointer, shaclPointer)
  expect(givenScore).toBe(1)
})

test('it does not score', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('givenName'))
  const givenScore = score(dataPointer, shaclPointer)
  expect(givenScore).toBe(-1)
})

test.only('it score for without', async () => {
  const { dataPointer, shaclPointer } = await prepareScoreTest(schema('address'))
  const givenScore1 = score(dataPointer, shaclPointer)
  expect(givenScore1).toBe(1)

  shaclPointer.deleteOut(sh('nodeKind'))
  dataPointer.deleteOut(schema('address'))

  const givenScore2 = score(dataPointer.node(), shaclPointer)
  expect(givenScore2).toBe(undefined)
})
