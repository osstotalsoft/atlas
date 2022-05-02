import createEngine, { DefaultPortModel, DiagramModel } from '@projectstorm/react-diagrams'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import EventNodeModel from 'features/designer/nodeModels/eventNode/EventNodeModel'
import LambdaNodeModel from 'features/designer/nodeModels/lambdaNode/LambdaNodeModel'
import StartNodeModel from 'features/designer/nodeModels/startNode/StartNodeModel'

describe('EVENT', () => {
  it('Should validate if the node has all ports connected with the corresponding number of links', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    engine.setModel(model)

    const event = new EventNodeModel()
    const event_in = event.addInPort('in')
    const event_out = event.addInPort('out')

    //input port not connected
    model.addAll(event)
    expect(event.validate()[1]).toContain(errorMessages.notLinked)

    const start = new StartNodeModel()
    const start_out = start.addPort(new DefaultPortModel({ in: false, name: 'out', type: 'START' }))

    const link1 = start_out.link(event_in)

    //input port connected, out port not connected
    model.addAll(start, link1)
    expect(event.validate()[1]).toContain(errorMessages.notLinked)

    const lambda1 = new LambdaNodeModel()
    const lambda1_in = lambda1.addInPort('in')
    const link2 = event_out.link(lambda1_in)

    //node connected correctly
    model.addAll(link2)
    expect(event.validate()[0]).toBe(true)

    const lambda2 = new LambdaNodeModel()
    const lambda2_in = lambda2.addInPort('in')
    const link3 = event_out.link(lambda2_in)

    //node has two output links
    model.addAll(link3)
    expect(event.validate()[1]).toContain(errorMessages.multipleLinks)
  })
})
