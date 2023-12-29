import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import LiteralViewer from '.'
import { DataFactory } from 'n3'
import { createElement } from 'react'
import { prepareComponentTest } from '@/helpers/prepareComponentTest'
import { xsd } from '@/helpers/namespaces'

test('it renders a date input', async () => {
  const term = DataFactory.literal('1990-01-07', xsd('date'))
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

  expect(output.baseElement.children[0].innerHTML).toBe('<input type="date" class="form-control" value="1990-01-07">')
})
