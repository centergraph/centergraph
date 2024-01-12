export type PackageOutputs = {
  [packageName: string]: {
    identifier: string
    product: string
    packageName: string
    packageInfo: {
      description: string
    }
    task: string
    logs: string[]
    ready: boolean
    url: string
  }
}
