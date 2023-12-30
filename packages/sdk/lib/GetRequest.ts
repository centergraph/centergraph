import { createElement } from 'react'
import View from './components/View'

export class GetRequest {
  #url: string

  constructor(url: string) {
    this.#url = url
  }

  then<TResult = string, TRejection = never>(
    onfulfilled?: (value: string) => TResult | PromiseLike<TResult>,
    onrejected?: (reason: unknown) => TRejection | PromiseLike<TRejection>
  ): PromiseLike<TResult | TRejection> {
    return fetch(this.#url)
      .then((response) => response.text())
      .then(onfulfilled, onrejected)
  }

  as(viewMode: string) {
    const promise = this as unknown as Promise<string>

    return createElement(View, {
      viewMode,
      url: this.#url,
      promise,
      key: this.#url,
    })
  }
}
