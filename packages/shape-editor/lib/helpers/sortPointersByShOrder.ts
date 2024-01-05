import { sh } from '@centergraph/shared/lib/namespaces'

export const sortPointersByShOrder = (a: GrapoiPointer, b: GrapoiPointer) => {
  const shOrderA = a.out(sh('order')).value
  const orderA = shOrderA ? parseFloat(shOrderA) : 0

  const shOrderB = b.out(sh('order')).value
  const orderB = shOrderB ? parseFloat(shOrderB) : 0

  return orderB - orderA
}
