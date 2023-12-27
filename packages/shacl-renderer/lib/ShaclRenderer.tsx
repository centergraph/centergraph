import { StrictMode } from 'react'
import ReactDOM, { Root } from 'react-dom/client'
import { Settings } from './types'
import { Parser, Store } from 'n3'
import grapoi from 'grapoi'
import FormLevel from './components/core/FormLevel'
import { rdf, sh } from './helpers/namespaces'
import { DataFactory } from 'n3'
import { loadWidgets } from './helpers/loadWidgets'

export class ShaclRenderer extends HTMLElement {
  #root: Root

  public settings: Settings = {
    fetch: fetch.bind(window),
    mode: 'edit',
    targetClass: 'https://schema.org/Person',
    widgetMetas: {
      editors: [],
      viewers: [],
    },
    widgetLoaders: new Map(),
  }

  public shaclShapes!: GrapoiPointer

  constructor() {
    super()
    this.#root = ReactDOM.createRoot(this)
    this.initiateSettings()
  }

  async initiateSettings() {
    const editorPromises = loadWidgets({
      targetMetas: this.settings.widgetMetas.editors,
      loaders: this.settings.widgetLoaders,
      metasGlob: import.meta.glob('./components/widgets/editors/*/meta.ts'),
      modulesGlob: import.meta.glob('./components/widgets/editors/*/index.tsx'),
    })

    const viewerPromises = loadWidgets({
      targetMetas: this.settings.widgetMetas.viewers,
      loaders: this.settings.widgetLoaders,
      metasGlob: import.meta.glob('./components/widgets/viewers/*/meta.ts'),
      modulesGlob: import.meta.glob('./components/widgets/viewers/*/index.tsx'),
    })

    await Promise.allSettled([...editorPromises, ...viewerPromises])

    const settingsEvent = new CustomEvent('settings', { detail: { settings: this.settings } })
    this.dispatchEvent(settingsEvent)
  }

  async loadShaclShapes() {
    const shaclShapesUrl = this.getAttribute('shacl-shapes-url')
    if (!shaclShapesUrl) throw new Error(`Please set the shacl-shapes-url attribute`)
    const response = await this.settings.fetch(shaclShapesUrl).then((response) => response.text())
    const parser = new Parser()
    const quads = await parser.parse(response)
    const dataset = new Store(quads)
    this.shaclShapes = grapoi({ dataset })
  }

  async connectedCallback() {
    await this.loadShaclShapes()

    let shaclRoot = this.shaclShapes.hasOut(rdf('type'), sh('NodeShape'))
    if (this.settings.targetClass) shaclRoot = shaclRoot.hasOut(sh('targetClass'), DataFactory.namedNode(this.settings.targetClass))

    // TODO Make the form shape selectable.
    // For now we choose the first shape that matches.
    shaclRoot.ptrs = [shaclRoot.ptrs[0]]

    this.#root.render(
      <StrictMode>
        <h1>test2</h1>
        <FormLevel shaclPointer={shaclRoot} settings={this.settings} />
      </StrictMode>
    )
  }
}

if (!customElements.get('shacl-renderer')) {
  customElements.define('shacl-renderer', ShaclRenderer)
} else {
  location.reload()
}
