const originalElement = global.Element
global.Element = function () {}
import { removeEmpty, objectReplaceKey, getFileContents, isJsonString } from 'utils/functions'

describe('Functions must work as expected', () => {
  afterAll(() => {
    global.Element = originalElement
  })

  it('Should clean the object from null values', () => {
    const myObject = { prop1: 'a', prop2: { nested1: null, nested2: { inNested1: 1, inNested2: undefined } } }
    const expected = { prop1: 'a', prop2: { nested2: { inNested1: 1 } } }

    expect(removeEmpty(myObject)).toStrictEqual(expected)
  })

  it('Should replace old key with new key in the given object', () => {
    const myObject = { prop1: 1, prop2: 2 }
    const expected = { prop1: 1, newProp: 2 }

    expect(objectReplaceKey(myObject, 'prop2', 'newProp')).toStrictEqual(expected)
  })

  it('Should get the file content', async () => {
    const fileContent = 'This is the file content'
    const file = new Blob([fileContent], { type: 'text/plain' })

    expect(await getFileContents(file)).toContain('This')
  })

  it('Should say whether is JSON or not', () => {
    const isJSON = '{"firstProp":1, "secondProp":2, "thirdProp":"Test"}'
    const notJSON = ''
    const alsoNot = {}

    expect(isJsonString(isJSON)).toEqual(true)
    expect(isJsonString(notJSON)).toEqual(false)
    expect(isJsonString(alsoNot)).toEqual(false)
  })
})
