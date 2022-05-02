import createEngine, { DiagramModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { getApplicationDiagram } from 'features/designer/diagram/getApplicationDiagram'
import EventNodeModel from 'features/designer/nodeModels/eventNode/EventNodeModel'
import HttpNodeModel from 'features/designer/nodeModels/httpNode/HttpNodeModel'
import { cloneSelection, parseObjectParameters, validateEngineWorkflow } from 'features/workflow/common/functions'

describe('Actions should do what they are supposed to do.', () => {
  it('Should copy and paste the selected items', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    const http = new HttpNodeModel()

    http.setSelected(true)

    model.addNode(http)
    engine.setModel(model)

    const selectedItems = engine.model.getSelectedEntities()
    cloneSelection(engine, selectedItems)

    const nodes = engine.model.getNodes().filter(n => n.type === nodeConfig.HTTP.type)
    expect(nodes).toHaveLength(2)
  })

  it('Should duplicate the entire selection and new nodes should also be linked', () => {
    const engine = createEngine()
    const model = new DiagramModel()
    const node1 = new HttpNodeModel()
    const node2 = new EventNodeModel()
    const outPort = node1.addOutPort('Out')
    const inPort = node2.addInPort('In')
    const link = outPort.link(inPort)

    node1.setSelected(true)
    node2.setSelected(true)
    link.setSelected(true)

    model.addAll(node1, node2, link)
    engine.setModel(model)

    const selectedItems = engine.model.getSelectedEntities()
    cloneSelection(engine, selectedItems)

    const httpNodes = engine.model.getNodes().filter(n => n.type === nodeConfig.HTTP.type)
    const eventNodes = engine.model.getNodes().filter(n => n.type === nodeConfig.EVENT.type)
    const links = engine.model.getLinks()

    expect(httpNodes).toHaveLength(2)
    expect(eventNodes).toHaveLength(2)
    expect(links).toHaveLength(2)

    const duplicatedNodes = engine.model.getNodes().filter(n => n.inputs.taskReferenceName.startsWith('Copy'))
    const duplicatedHttp = duplicatedNodes.filter(n => n.type === nodeConfig.HTTP.type)[0]
    const duplicatedEvent = duplicatedNodes.filter(n => n.type === nodeConfig.EVENT.type)[0]

    expect(duplicatedHttp.portsOut[1].links[0]).toEqual(duplicatedEvent.portsIn[1].links[0])
  })

  it('Should parse the parameter values which have a correct JSON object structure', () => {
    let input = {}
    input.inputParameters = {
      stringValue: `{'this is not a correct structure for a JSON object'}`,
      objectValue: `{"firstParam":2, "secondParam":"secondValue"}`,
      skipThisParam: `{"param":"Even if this is a correct JSON object, it should be skipped from parsing"}`
    }

    parseObjectParameters(input, ['skipThisParam'])

    expect(typeof input.inputParameters.stringValue).toBe('string')
    expect(typeof input.inputParameters.objectValue).toBe('object')
    expect(typeof input.inputParameters.skipThisParam).toBe('string')
  })

  it('Should validate if the workflow is correctly built. No error should be found', () => {
    //START-HTTP-END
    const diagram = getApplicationDiagram()
    const { engine } = diagram

    const start = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.START.type)
    const startPort = start.getPorts().out

    const end = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.END.type)
    const endPort = end.getPorts().in

    const http = new HttpNodeModel()
    const link1 = startPort.link(http.getInPorts()[0])
    const link2 = http.getOutPorts()[0].link(endPort)
    engine.getModel().addAll(start, http, end, link1, link2)

    const validationResults = validateEngineWorkflow(engine)
    const errors = validationResults.filter(([isValid]) => !isValid)

    expect(errors).toHaveLength(0)
  })

  it('Should return validation errors for workflow that has nodes that are not connected.', () => {
    //START-HTTP END
    //Http node is not connected to the End node
    const diagram = getApplicationDiagram()
    const { engine } = diagram

    const start = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.START.type)
    const startPort = start.getPorts().out

    const end = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.END.type)

    const http = new HttpNodeModel()
    const link1 = startPort.link(http.getInPorts()[0])
    engine.getModel().addAll(start, http, end, link1)

    const validationResults = validateEngineWorkflow(engine)
    const errors = validationResults.filter(([isValid]) => !isValid)

    expect(errors.length).toBeGreaterThan(0)
  })

  it('Should return validation error for workflow that has no tasks.', () => {
    //START-END
    //The workflow has no tasks
    const diagram = getApplicationDiagram()
    const { engine } = diagram

    const start = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.START.type)
    const startPort = start.getPorts().out

    const end = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.END.type)
    const endPort = end.getPorts().in

    const link1 = startPort.link(endPort)
    engine.getModel().addAll(start, link1, end)

    const validationResults = validateEngineWorkflow(engine)
    const errors = validationResults.filter(([isValid]) => !isValid)

    expect(errors.length).toBeGreaterThan(0)
  })
})
