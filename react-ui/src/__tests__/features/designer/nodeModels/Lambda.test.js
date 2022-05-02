import createEngine, { DefaultPortModel, DiagramModel } from '@projectstorm/react-diagrams'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import HttpNodeModel from 'features/designer/nodeModels/httpNode/HttpNodeModel'
import LambdaNodeModel from 'features/designer/nodeModels/lambdaNode/LambdaNodeModel'
import StartNodeModel from 'features/designer/nodeModels/startNode/StartNodeModel'

describe('LAMBDA', () => {
  it('Should validate if the node has all ports connected with the corresponding number of links', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    engine.setModel(model)

    const lambda = new LambdaNodeModel()
    const lambda_in = lambda.addInPort('in')
    const lambda_out = lambda.addInPort('out')

    //input port not connected
    model.addAll(lambda)
    expect(lambda.validate()[1]).toContain(errorMessages.notLinked)

    const start = new StartNodeModel()
    const start_out = start.addPort(new DefaultPortModel({ in: false, name: 'out', type: 'START' }))

    const link1 = start_out.link(lambda_in)

    //input port connected, out port not connected
    model.addAll(start, link1)
    expect(lambda.validate()[1]).toContain(errorMessages.notLinked)

    const http1 = new HttpNodeModel()
    const http1_in = http1.addInPort('in')
    const link2 = lambda_out.link(http1_in)

    //node connected correctly
    model.addAll(link2)
    expect(lambda.validate()[0]).toBe(true)

    const http2 = new HttpNodeModel()
    const http2_in = http2.addInPort('in')
    const link3 = lambda_out.link(http2_in)

    //node has two output links
    model.addAll(link3)
    expect(lambda.validate()[1]).toContain(errorMessages.multipleLinks)
  })
})
