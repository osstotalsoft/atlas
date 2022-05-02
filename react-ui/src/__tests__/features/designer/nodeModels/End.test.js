import createEngine, { DefaultPortModel, DiagramModel } from '@projectstorm/react-diagrams'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import EndNodeModel from 'features/designer/nodeModels/endNode/EndNodeModel'
import LambdaNodeModel from 'features/designer/nodeModels/lambdaNode/LambdaNodeModel'

describe('END', () => {
  it('Should validate if the node has all ports connected with the corresponding number of links', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    engine.setModel(model)

    const end = new EndNodeModel()
    const end_in = end.addPort(new DefaultPortModel({ in: true, name: 'in', type: 'END' }))

    //input port is not connected
    model.addAll(end)
    expect(end.validate()[1]).toContain(errorMessages.notLinked)

    const lambda = new LambdaNodeModel()
    const lambda_out = lambda.addInPort('out')
    const link1 = lambda_out.link(end_in)

    //end is connected correctly
    model.addAll(end, lambda, link1)
    expect(end.validate()[0]).toBe(true)
  })
})
