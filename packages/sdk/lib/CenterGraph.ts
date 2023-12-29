import { createElement } from 'react'
import View from './components/View'

export type CenterGraphOptions = {
  base: string
}

export class CenterGraph {
  #options: CenterGraphOptions

  constructor(options: CenterGraphOptions) {
    this.#options = options
  }

  /**
   * Returns a thenable
   * @param path
   * @returns
   */
  get(path: string) {
    const url = this.#options.base + path

    return {
      url,
      then<TResult = string, TRejection = never>(
        onfulfilled?: (value: string) => TResult | PromiseLike<TResult>,
        onrejected?: (reason: unknown) => TRejection | PromiseLike<TRejection>
      ): PromiseLike<TResult | TRejection> {
        return fetch(this.url)
          .then((response) => response.text())
          .then(onfulfilled, onrejected)
      },

      as(viewMode: string) {
        const promise = this as unknown as Promise<string>

        return function () {
          return createElement(View, {
            viewMode,
            url,
            promise,
          })
        }
      },
    }
  }
}
