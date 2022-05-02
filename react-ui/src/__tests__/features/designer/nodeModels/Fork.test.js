import createEngine, { DefaultPortModel, DiagramModel } from '@projectstorm/react-diagrams'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import ForkNodeModel from 'features/designer/nodeModels/forkNode/ForkNodeModel'
import LambdaNodeModel from 'features/designer/nodeModels/lambdaNode/LambdaNodeModel'
import StartNodeModel from 'features/designer/nodeModels/startNode/StartNodeModel'

describe('FORK', () => {
  it('Should validate if the node has all ports connected with the corresponding number of links', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    engine.setModel(model)

    const fork = new ForkNodeModel()
    const fork_in = fork.addInPort('in')
    const fork_out = fork.addInPort('out')

    //input port not connected
    model.addAll(fork)
    expect(fork.validate()[1]).toContain(errorMessages.notLinked)

    const start = new StartNodeModel()
    const start_out = start.addPort(new DefaultPortModel({ in: false, name: 'out', type: 'START' }))

    const link1 = start_out.link(fork_in)

    //input port connected, out port not connected
    model.addAll(start, link1)
    expect(fork.validate()[1]).toContain(errorMessages.notLinked)

    const lambda1 = new LambdaNodeModel()
    const lambda1_in = lambda1.addInPort('in')
    const link2 = fork_out.link(lambda1_in)

    //node connected correctly
    model.addAll(link2)
    expect(fork.validate()[0]).toBe(true)

    const lambda2 = new LambdaNodeModel()
    const lambda2_in = lambda2.addInPort('in')
    const link3 = fork_out.link(lambda2_in)

    //node has two output links but it should be ok
    model.addAll(link3)
    expect(fork.validate()[0]).toBe(true)
  })
})
