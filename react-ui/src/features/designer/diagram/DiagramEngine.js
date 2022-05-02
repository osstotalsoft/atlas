import createEngine, { DefaultNodeModel, DiagramModel } from '@projectstorm/react-diagrams'
import StartNodeModel from '../nodeModels/startNode/StartNodeModel'
import EndNodeModel from '../nodeModels/endNode/EndNodeModel'
import UndoRedoAction from '../actions/UndoRedoAction'
import DeleteAction from '../actions/DeleteAction'
import commandHandlers from './command/commandHandlers'
import CommandManager from './command/CommandManager'
import States from './states/States'

export default class DiagramEngine {
  constructor(nodes) {
    this.nodes = nodes

    this.initializeEngine()
    this.initializeModel()
  }

  getEngine = () => this.engine

  getModel = () => this.engine.getModel()

  /**
   * Initialization methods
   */
  initializeEngine = () => {
    this.engine = createEngine({ registerDefaultDeleteItemsAction: false })

    this.engine.commands = new CommandManager()
    this.engine.registerListener(commandHandlers(this))

    this.engine.getStateMachine().pushState(new States())

    this.engine.getActionEventBus().registerAction(new UndoRedoAction())
    this.engine.getActionEventBus().registerAction(new DeleteAction())

    this.registerNodes()
  }

  initializeModel = () => {
    this.model = new DiagramModel()

    const start = new StartNodeModel()
    start.setPosition(200, 100)

    const end = new EndNodeModel()
    end.setPosition(800, 100)
    this.model.addAll(start, end)

    this.engine.setModel(this.model)
  }

  registerNodes = () => {
    this.nodes.forEach(Factory => {
      this.engine.getNodeFactories().registerFactory(new Factory())
    })
  }

  getSelectedNodes = () =>
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(entity => entity instanceof DefaultNodeModel)

  fireAction = event => {
    this.engine.getActionEventBus().fireAction({
      event: {
        ...event,
        key: '',
        preventDefault: () => {},
        stopPropagation: () => {}
      }
    })
  }

  undo = () => this.fireAction({ type: 'keydown', ctrlKey: true, code: 'KeyZ' })
  deleteSelected = () => this.fireAction({ type: 'keydown', code: 'Delete' })

  redo = () =>
    this.fireAction({
      type: 'keydown',
      ctrlKey: true,
      code: 'KeyY'
    })
}
