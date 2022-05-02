import createEngine, { DefaultPortModel, DiagramModel } from '@projectstorm/react-diagrams'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import JoinNodeModel from 'features/designer/nodeModels/joinNode/JoinNodeModel'
import LambdaNodeModel from 'features/designer/nodeModels/lambdaNode/LambdaNodeModel'
import StartNodeModel from 'features/designer/nodeModels/startNode/StartNodeModel'

describe('JOIN', () => {
  it('Should validate if the node has all ports connected with the corresponding number of links', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    engine.setModel(model)

    const join = new JoinNodeModel()
    const join_in = join.addInPort('in')
    const join_out = join.addInPort('out')

    //input port not connected
    model.addAll(join)
    expect(join.validate()[1]).toContain(errorMessages.notLinked)

    const start = new StartNodeModel()
    const start_out = start.addPort(new DefaultPortModel({ in: false, name: 'out', type: 'START' }))

    const link1 = start_out.link(join_in)

    //input port connected, out port not connected
    model.addAll(start, link1)
    expect(join.validate()[1]).toContain(errorMessages.notLinked)

    const lambda1 = new LambdaNodeModel()
    const lambda1_in = lambda1.addInPort('in')
    const link2 = join_out.link(lambda1_in)

    //node connected correctly
    model.addAll(link2)
    expect(join.validate()[0]).toBe(true)

    const lambda2 = new LambdaNodeModel()
    const lambda2_in = lambda2.addInPort('in')
    const link3 = join_out.link(lambda2_in)

    //node has two output links
    model.addAll(link3)
    expect(join.validate()[1]).toContain(errorMessages.multipleLinks)
  })
})
