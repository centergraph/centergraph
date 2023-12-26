/// <reference types="vite/client" />

type GrapoiPointer = {
  in: (predicates?: Array<NamedNode>, objects?: Array<NamedNode>) => GrapoiPointer
  out: (predicates?: Array<NamedNode | null> | NamedNode, subjects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  hasOut: (predicates?: Array<NamedNode | null> | NamedNode, subjects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  deleteOut: (predicates?: Array<unknown> | unknown, objects?: Array<unknown> | unknown) => GrapoiPointer
  addOut: (predicates?: Array<unknown> | unknown, objects?: Array<unknown> | unknown) => GrapoiPointer
  quads: () => Array<Quad>
  trim(): GrapoiPointer
  distinct(): GrapoiPointer
  values: Array<string>
  filter: (item: unknown) => boolean
  value: string
  isList: () => boolean
  deleteList: () => GrapoiPointer
  list: () => Array<GrapoiPointer>
  ptrs: Array<unknown>
  clone: (data: unknown) => GrapoiPointer
  node: (pointers?: Array<unknown>) => GrapoiPointer
  execute: (paths: Array<unknown>) => GrapoiPointer
  executeAll: (paths: Array<unknown>) => GrapoiPointer
  replace: (replacement: unknown) => GrapoiPointer
  term: Term
  terms: Array<Term>
  [Symbol.iterator]: () => Iterator<GrapoiPointer>
}

declare module 'grapoi' {
  function grapoi({ dataset: Dataset }): GrapoiPointer
  export = grapoi
}

declare module 'shacl-engine/lib/parsePath'
