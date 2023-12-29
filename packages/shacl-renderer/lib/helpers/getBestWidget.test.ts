import { getBestWidget } from './getBestWidget'
import { expect, test } from 'vitest'
import { rdf, schema, sh } from './namespaces'
import { prepareTestState } from './prepareTestState'

test('getting the best widget appropriate for a date field', async () => {
  const { targetMetas, shaclPointer, dataPointer } = await prepareTestState('edit')
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('birthDate')).value)

  const iri = getBestWidget(targetMetas, dataPointer, specificShaclPointer)
  expect(iri).toBe('http://datashapes.org/dash#DatePickerEditor')
})

test('getting the best widget appropriate for a text field', async () => {
  const { targetMetas, shaclPointer, dataPointer } = await prepareTestState('edit')
  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('givenName')).value)

  const iri = getBestWidget(targetMetas, dataPointer, specificShaclPointer)
  expect(iri).toBe('http://datashapes.org/dash#TextFieldEditor')
})
