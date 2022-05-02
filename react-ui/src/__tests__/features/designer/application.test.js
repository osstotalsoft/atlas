const { getApplicationDiagram } = require('features/designer/diagram/getApplicationDiagram')

describe('Application Engine', () => {
  it('Should instantiate a new application Engine', () => {
    const engine = getApplicationDiagram()
    expect(engine.getModel().getNodes().length).toEqual(2)
  })
})
