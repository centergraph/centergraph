import { OutgoingMessage } from 'node:http'

const oldSet = Headers.prototype.set
Headers.prototype.set = function set(key, value) {
  if (Array.isArray(value)) {
    this.delete(key)
    value.forEach((v) => this.append(key, v))
  } else {
    oldSet.call(this, key, value)
  }
}

OutgoingMessage.prototype.setHeader = function (name: string, value: string | number | readonly string[]) {
  /** @ts-expect-error The typing seems broken */
  this.set(name, value)
  return this
}
