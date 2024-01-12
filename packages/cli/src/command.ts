import { PackageOutputs } from './types.ts'

const urlRegex = /(http:\/\/\S+)[^\s,\.]/gi

export const command = async (
  callback: () => void
): Promise<{
  packageOutputs: PackageOutputs
  exit: () => void
}> => {
  const command = new Deno.Command('npm', {
    args: ['run', 'dev'],
    cwd: Deno.cwd() + '/../..',
    stdin: 'piped',
    stdout: 'piped',
  })

  const child = command.spawn()

  const textDecoder = new TextDecoder()
  const reader = child.stdout.getReader()

  const packageOutputs: PackageOutputs = {}

  const getChunk = () => {
    reader.read().then(({ done, value }) => {
      const text = textDecoder.decode(value)

      const lines = text.split('\n')

      for (const line of lines) {
        if (line.startsWith('@centergraph')) {
          const identifier = line.split(': ')[0]
          const [product, packageName, task] = identifier.split(/:|\//g)
          if (!packageOutputs[identifier]) {
            const packageInfo = JSON.parse(Deno.readTextFileSync(`../${packageName}/package.json`))

            packageOutputs[identifier] = {
              product,
              packageName,
              packageInfo,
              task,
              url: '',
              ready: false,
              identifier,
              logs: [],
            }
          }

          if (line.toLowerCase().includes('ready')) {
            packageOutputs[identifier].ready = true
          }

          const match = line.match(urlRegex)

          if (match) {
            packageOutputs[identifier].url = match[0]
          }

          packageOutputs[identifier].logs.push(line.replace(identifier, ''))
        }
      }

      if (!done) {
        callback()
        getChunk()
      } else {
        child.stdin.close()
      }
    })
  }

  getChunk()

  return {
    packageOutputs,
    exit: () => child.stdin.close(),
  }
}
