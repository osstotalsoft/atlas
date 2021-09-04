import createEngine, { DiagramModel } from '@projectstorm/react-diagrams'
import { EndNodeFactory } from '../nodeModels/endNode/EndNodeFactory'
import { EndNodeModel } from '../nodeModels/endNode/EndNodeModel'
import { StartNodeFactory } from '../nodeModels/startNode/StartNodeFactory'
import { StartNodeModel } from '../nodeModels/startNode/StartNodeModel'
import { JoinNodeFactory } from '../nodeModels/joinNode/JoinNodeFactory'
import { DynamicForkNodeFactory } from '../nodeModels/dynamicForkNode/DynamicForkNodeFactory'
import { ForkNodeFactory } from '../nodeModels/forkNode/ForkNodeFactory'

export const getApplicationEngine = () => {
  var engine = createEngine()

  // register factories
  engine.getNodeFactories().registerFactory(new StartNodeFactory())
  engine.getNodeFactories().registerFactory(new EndNodeFactory())
  engine.getNodeFactories().registerFactory(new JoinNodeFactory())
  engine.getNodeFactories().registerFactory(new ForkNodeFactory())
  engine.getNodeFactories().registerFactory(new DynamicForkNodeFactory())

  //setup the diagram model
  var model = new DiagramModel()

  const start = new StartNodeModel()
  start.setPosition(200, 100)

  const end = new EndNodeModel()
  end.setPosition(800, 100)

  // add the models to the root graph
  model.addAll(start, end)

  // load model into engine
  engine.setModel(model)
  return engine
}
