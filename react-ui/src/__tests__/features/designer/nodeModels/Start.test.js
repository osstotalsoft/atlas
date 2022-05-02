import createEngine, { DefaultPortModel, DiagramModel } from '@projectstorm/react-diagrams'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import HttpNodeModel from 'features/designer/nodeModels/httpNode/HttpNodeModel'
import LambdaNodeModel from 'features/designer/nodeModels/lambdaNode/LambdaNodeModel'
import StartNodeModel from 'features/designer/nodeModels/startNode/StartNodeModel'

describe('START', () => {
  it('Should validate if the node has all ports connected with the corresponding number of links', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    engine.setModel(model)

    const start = new StartNodeModel()
    const start_out = start.addPort(new DefaultPortModel({ in: false, name: 'out', type: 'START' }))

    //output port is not connected
    model.addAll(start)
    expect(start.validate()[1]).toContain(errorMessages.notLinked)

    const lambda = new LambdaNodeModel()
    const lambda_in = lambda.addInPort('in')
    const link1 = start_out.link(lambda_in)

    //start is connected correctly
    model.addAll(start, lambda, link1)
    expect(start.validate()[0]).toBe(true)

    const http = new HttpNodeModel()
    const http_in = http.addInPort('in')
    const link2 = start_out.link(http_in)

    //start has two output links. One to Lambda, another to Http
    model.addAll(start, lambda, link1, link2)
    expect(start.validate()[1]).toContain(errorMessages.multipleLinks)
  })
})
