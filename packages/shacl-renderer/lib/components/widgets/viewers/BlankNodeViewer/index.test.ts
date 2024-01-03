import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import LiteralViewer from '.'
import { DataFactory } from 'n3'
import { createElement } from 'react'
import { prepareComponentTest } from '@centergraph/shacl-renderer/lib/helpers/prepareComponentTest'

test('it renders a address div', async () => {
  const term = DataFactory.literal('Lorem')
  const { setTerm, dataPointer, shaclPointer, settings } = await prepareComponentTest()

  const output = render(
    createElement(LiteralViewer, {
      term,
      setTerm,
      shaclPointer,
      dataPointer,
      settings,
    })
  )

  expect(output.baseElement.children[0].innerHTML).toBe(
    '<div class="level flex-grow-1 p-3"><div class="group group-address address"></div></div>'
  )
})
