import { addPropertyPrefix } from '../index'

describe('propertyChangeAdapters tests suite:', () => {
  it('addPropertyPrefix should prefix first param:', () => {
    const prefix = 'prefix'
    const fn = str => str
    const param = 'param'

    const result = addPropertyPrefix(prefix, fn)(param)
    expect(result).toBe(prefix + '.' + param)
  })
})
