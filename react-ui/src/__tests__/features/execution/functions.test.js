const { generateFreeText } = require('features/execution/common/functions')

describe('Functions should do what they are supposed to do.', () => {
  it('Should generate the correct freeText for workflowType that partially matches', () => {
    const expectedFreeText =
      '(workflowType:/.*[Tt][Ee][Ss][Tt].*/)AND(workflowId:c9c74c91-a03a-4e87-833e-eed51ab7f8c2)AND(version:1)AND(status:COMPLETED)'
    const result = generateFreeText(
      { workflowType: 'test', workflowId: 'c9c74c91-a03a-4e87-833e-eed51ab7f8c2', version: 1, status: 'COMPLETED' },
      false
    )
    expect(result).toEqual(expectedFreeText)
  })

  it('Should generate the correct freeText for workflowType that matches exactly', () => {
    const expectedFreeText =
      '(workflowType:/[Tt][Ee][Ss][Tt]/)AND(workflowId:c9c74c91-a03a-4e87-833e-eed51ab7f8c2)AND(version:1)AND(status:COMPLETED)'
    const result = generateFreeText(
      { workflowType: 'test', workflowId: 'c9c74c91-a03a-4e87-833e-eed51ab7f8c2', version: 1, status: 'COMPLETED' },
      true
    )
    expect(result).toEqual(expectedFreeText)
  })

  it('Should generate the correct freeText for workflowType that matches partially by default', () => {
    const expectedFreeText =
      '(workflowType:/.*[Tt][Ee][Ss][Tt].*/)AND(workflowId:c9c74c91-a03a-4e87-833e-eed51ab7f8c2)AND(version:1)AND(status:COMPLETED)'
    const result = generateFreeText({
      workflowType: 'test',
      workflowId: 'c9c74c91-a03a-4e87-833e-eed51ab7f8c2',
      version: 1,
      status: 'COMPLETED'
    })
    expect(result).toEqual(expectedFreeText)
  })
})
