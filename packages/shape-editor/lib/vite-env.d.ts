/// <reference types="vite/client" />

type GrapoiPointer = {
  in: (predicates?: Array<NamedNode> | NamedNode, objects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  out: (predicates?: Array<NamedNode | null> | NamedNode, subjects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  hasOut: (predicates?: Array<NamedNode | null> | NamedNode, subjects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  hasIn: (predicates?: Array<NamedNode | null> | NamedNode, objects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  deleteOut: (predicates?: Array<unknown> | unknown, objects?: Array<unknown> | unknown) => GrapoiPointer
  addOut: (predicates?: Array<unknown> | unknown, objects?: Array<unknown> | unknown) => GrapoiPointer
  quads: () => Array<Quad>
  trim(): GrapoiPointer
  distinct(): GrapoiPointer
  values: Array<string>
  filter: (item: unknown) => GrapoiPointer
  value: string
  isList: () => boolean
  deleteList: () => GrapoiPointer
  list: () => Array<GrapoiPointer>
  ptrs: Array<{ dataset: DatasetCore } & GrapoiPointer>
  clone: (data?: unknown) => GrapoiPointer
  node: (predicates?: Array<NamedNode | null> | NamedNode, subjects?: Array<NamedNode> | NamedNode) => GrapoiPointer
  execute: (paths: Array<unknown>) => GrapoiPointer
  executeAll: (paths: Array<unknown>) => GrapoiPointer
  replace: (replacement: unknown) => GrapoiPointer
  term: Term
  terms: Array<Term>
  [Symbol.iterator]: () => Iterator<GrapoiPointer>
}

declare module 'grapoi' {
  function grapoi({ dataset, factory, term }: { dataset: Dataset; factory: DataFactory; term?: NamedNode }): GrapoiPointer
  export = grapoi
}

declare module 'shacl-engine/lib/parsePath'
declare module 'shacl-engine'
