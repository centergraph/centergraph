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
    dataStore: new Store(),
  }

  public shaclShapes!: GrapoiPointer
  public dataPointer!: GrapoiPointer

  constructor() {
    super()
    this.#root = ReactDOM.createRoot(this)
    this.initiateSettings()

    // Reflect the settings
    this.classList.add('shacl-renderer')
    this.classList.add(`mode-${this.settings.mode}`)
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

    // Attribute overrides
    const mode = this.getAttribute('mode')
    if (mode && ['view', 'edit'].includes(mode)) this.settings.mode = mode as 'view' | 'edit'

    const settingsEvent = new CustomEvent('settings', { detail: { settings: this.settings } })
    this.dispatchEvent(settingsEvent)
  }

  async loadData() {
    const dataUrl = this.getAttribute('data-url')

    if (dataUrl) {
      const response = await this.settings.fetch(dataUrl).then((response) => response.text())
      const parser = new Parser({ baseIRI: dataUrl })
      const quads = await parser.parse(response)
      this.settings.dataStore.addQuads(quads)
    }

    const subject = this.getAttribute('subject')
    if (!subject) throw new Error('Subject is required')

    this.dataPointer = grapoi({ dataset: this.settings.dataStore, factory: DataFactory, term: DataFactory.namedNode(subject) })
  }

  async loadShaclShapes() {
    const shaclShapesUrl = this.getAttribute('shacl-shapes-url')
    if (!shaclShapesUrl) throw new Error(`Please set the shacl-shapes-url attribute`)
    const response = await this.settings.fetch(shaclShapesUrl).then((response) => response.text())
    const parser = new Parser()
    const quads = await parser.parse(response)
    const dataset = new Store(quads)
    this.shaclShapes = grapoi({ dataset, factory: DataFactory })
  }

  async connectedCallback() {
    await this.loadShaclShapes()
    await this.loadData()

    let shaclRoot = this.shaclShapes.hasOut(rdf('type'), sh('NodeShape'))
    if (this.settings.targetClass) shaclRoot = shaclRoot.hasOut(sh('targetClass'), DataFactory.namedNode(this.settings.targetClass))

    // TODO Make the form shape selectable.
    // For now we choose the first shape that matches.
    shaclRoot.ptrs = [shaclRoot.ptrs[0]]

    this.#root.render(
      <StrictMode>
        <form onSubmit={(event) => event.preventDefault()}>
          <FormLevel htmlChildren={[...this.children]} shaclPointer={shaclRoot} dataPointer={this.dataPointer} settings={this.settings} />
        </form>
      </StrictMode>
    )
  }
}

if (!customElements.get('shacl-renderer')) {
  customElements.define('shacl-renderer', ShaclRenderer)
} else {
  location.reload()
}
