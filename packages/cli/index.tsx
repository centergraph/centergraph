import spinners from 'cli-spinners'
import figlet from 'figlet'
import { Newline, render, Text } from 'ink'
import { Task, TaskList } from 'ink-task-list'
import React, { useEffect, useState } from 'npm:react'

import { command } from './command.ts'
import { PackageOutputs } from './types.ts'

console.clear()

export function Main() {
  const [packageOutputs, setPackageOutputs] = useState<PackageOutputs>({})
  const [renderCount, setRenderCount] = useState(1)
  const [header, setHeader] = useState('')

  useEffect(() => {
    figlet.text(
      'CenterGraph',
      {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true,
      },
      function (_err: unknown, data: string) {
        setHeader(data)
      }
    )

    command(() => {
      setRenderCount((value: number) => value + 1)
    }).then(setPackageOutputs)
  }, [])

  return renderCount ? (
    <>
      <Text>{header}</Text>

      <TaskList>
        {Object.values(packageOutputs as PackageOutputs)
          .sort((a, b) => {
            if (!a.ready && !b.ready) {
              return a.packageName.localeCompare(b.packageName)
            }

            return a.url.localeCompare(b.url)
          })
          .map((packageOutput) => {
            const label = packageOutput.ready ? (
              <Text>
                <Text>{packageOutput.packageName}</Text>
                <Newline />
                <Text color={'green'}>{packageOutput.url}</Text>
                <Newline />
                <Text color={'gray'}>{packageOutput.packageInfo.description}</Text>
                <Newline />
              </Text>
            ) : (
              <Text>{packageOutput.packageName}</Text>
            )

            return (
              <Task
                key={packageOutput.identifier}
                label={label}
                state={packageOutput.ready ? 'success' : 'loading'}
                spinner={spinners.dots}
              />
            )
          })}
      </TaskList>
    </>
  ) : null
}

render(<Main />)
