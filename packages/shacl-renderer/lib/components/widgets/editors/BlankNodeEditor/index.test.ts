import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import LiteralViewer from '.'
import { DataFactory } from 'n3'
import { createElement } from 'react'
import { prepareComponentTest } from '@/helpers/prepareComponentTest'
import { rdf, schema, sh } from '@/helpers/namespaces'

test.only('it renders a FormLevel', async () => {
  const term = DataFactory.blankNode()
  const { setTerm, dataPointer, shaclPointer, settings } = await prepareComponentTest()

  const specificShaclPointer = shaclPointer
    .hasOut(rdf('type'), sh('NodeShape'))
    .out(sh('property'))
    .filter((pointer: GrapoiPointer) => pointer.hasOut(sh('path'), schema('address')).value)

  const output = render(
    createElement(LiteralViewer, {
      term,
      setTerm,
      shaclPointer: specificShaclPointer,
      dataPointer: dataPointer.out(schema('address')),
      settings,
    })
  )

  expect(output.baseElement.children[0].innerHTML).toBe(
    '<div class="form-level flex-grow-1 p-3"><div class="group group-address address"></div></div>'
  )
})
