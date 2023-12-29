import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import LiteralViewer from '.'
import { DataFactory } from 'n3'
import { createElement } from 'react'
import { prepareComponentTest } from '@/helpers/prepareComponentTest'

test('it renders an input', async () => {
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

  expect(output.baseElement.children[0].innerHTML).toBe('<input class="form-control" value="Lorem">')
})
