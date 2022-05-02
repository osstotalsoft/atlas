import createEngine, { DefaultPortModel, DiagramModel } from '@projectstorm/react-diagrams'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import DynamicForkNodeModel from 'features/designer/nodeModels/dynamicForkNode/DynamicForkNodeModel'
import LambdaNodeModel from 'features/designer/nodeModels/lambdaNode/LambdaNodeModel'
import StartNodeModel from 'features/designer/nodeModels/startNode/StartNodeModel'

describe('DYNAMIC_FORK', () => {
  it('Should validate if the node has all ports connected with the corresponding number of links', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    engine.setModel(model)

    const dynamicFork = new DynamicForkNodeModel()
    const dynamicFork_in = dynamicFork.addInPort('in')
    const dynamicFork_out = dynamicFork.addInPort('out')

    //input port not connected
    model.addAll(dynamicFork)
    expect(dynamicFork.validate()[1]).toContain(errorMessages.notLinked)

    const start = new StartNodeModel()
    const start_out = start.addPort(new DefaultPortModel({ in: false, name: 'out', type: 'START' }))

    const link1 = start_out.link(dynamicFork_in)

    //input port connected, out port not connected
    model.addAll(start, link1)
    expect(dynamicFork.validate()[1]).toContain(errorMessages.notLinked)

    const lambda1 = new LambdaNodeModel()
    const lambda1_in = lambda1.addInPort('in')
    const link2 = dynamicFork_out.link(lambda1_in)

    //node connected correctly
    model.addAll(link2)
    expect(dynamicFork.validate()[0]).toBe(true)

    const lambda2 = new LambdaNodeModel()
    const lambda2_in = lambda2.addInPort('in')
    const link3 = dynamicFork_out.link(lambda2_in)

    //node has two output links
    model.addAll(link3)
    expect(dynamicFork.validate()[1]).toContain(errorMessages.multipleLinks)
  })
})
