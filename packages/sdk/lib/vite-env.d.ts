declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['shacl-renderer']: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { mode: string }, HTMLElement>
    }
  }
  interface ElementEventMap {
    settings: CustomEvent
  }
}

declare module 'd2l-fetch'
declare module 'd2l-fetch-dedupe'
declare module 'd2l-fetch-simple-cache'
