const { map } = require('ramda')

function filterByTerm(inputArr, searchTerm) {
  return inputArr.filter(function (arrayElement) {
    return arrayElement.movie.match(searchTerm)
  })
}

describe('Here I learn good testing techniques', () => {
  it('Should work to assign to object', () => {
    const myData = { one: 1 }
    myData['two'] = 2
    expect(myData).toEqual({ one: 1, two: 2 })
  })

  it('Is assigned with null', () => {
    const n = null
    expect(n).toBeNull()
    expect(n).toBeDefined()
    expect(n).not.toBeUndefined()
    expect(n).not.toBeTruthy()
    expect(n).toBeFalsy()
  })

  it('Is assigned with 0', () => {
    const z = 0
    expect(z).not.toBeNull()
    expect(z).toBeDefined()
    expect(z).not.toBeUndefined()
    expect(z).not.toBeTruthy()
    expect(z).toBeFalsy()
  })

  it('Is assigned with false', () => {
    const z = false
    expect(z).not.toBeNull()
    expect(z).toBeDefined()
    expect(z).not.toBeUndefined()
    expect(z).toBeFalsy()
    expect(z).not.toBeTruthy()
    const test = '0'
    if (test === 0) {
      console.log('zero ca string nu e falsy. Doar cand faci egalitate isi schimba tipul in numeric')
    }
  })

  it('Float numbers should be close to, they cannot be equal', () => {
    const a = 0.1
    const b = 0.2
    expect(a + b).toBeCloseTo(0.3)
  })

  it('Should call this function only with numbers', () => {
    const mock = jest.fn()
    ;[(1, 2, 3)] |> map(mock)
    expect(mock).toHaveBeenCalledWith(expect.anything())
  })

  it('Should filter the the list', () => {
    const input = [
      { id: 1, movie: 'The Godfather' },
      { id: 2, movie: 'The dark knight' },
      { id: 3, movie: 'Forrest Gump' }
    ]

    const output = [{ id: 3, movie: 'Forrest Gump' }]

    expect(filterByTerm(input, 'Forrest')).toEqual(output)
  })
})
