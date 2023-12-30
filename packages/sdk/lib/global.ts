declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React.JSX {
    interface IntrinsicElements {
      ['shacl-renderer']: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { mode: string }, HTMLElement>
    }
  }
  interface ElementEventMap {
    settings: CustomEvent
  }
}

export {}
