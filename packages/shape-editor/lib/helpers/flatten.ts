export function flatten(obj: object) {
  const result = Object.create(obj)
  for (const key in result) {
    // eslint-disable-next-line no-self-assign
    result[key] = result[key]
  }
  return result
}
