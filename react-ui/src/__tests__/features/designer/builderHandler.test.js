import createEngine, { DiagramModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import DecisionNodeModel from 'features/designer/nodeModels/decisionNode/DecisionNodeModel'
import EndNodeModel from 'features/designer/nodeModels/endNode/EndNodeModel'
import StartNodeModel from 'features/designer/nodeModels/startNode/StartNodeModel'
import { keys } from 'ramda'
const { getStartNode, getEndNode, getLinksArray, decisionCasesToPorts, parseDiagramToJSON } = require('features/designer/builderHandler')
const { getApplicationDiagram } = require('features/designer/diagram/getApplicationDiagram')
const { drawDiagram } = require('features/designer/drawingHandler')

describe('builderHandler should work as expected', () => {
  it('Should get the START node', () => {
    const wfString =
      '{"__typename":"WorkflowDef","createdBy":"admin@totalsoft.ro","description":null,"failureWorkflow":null,"name":"Frumusel","ownerEmail":"admin@totalsoft.ro","tasks":[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_12BE","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":"","caseValueParam":"param","decisionCases":{"a":[{"name":"EVENT","taskReferenceName":"eventTaskRefF0I9","inputParameters":{"payload":{"documentId":"${workflow.input.documentId}","siteId":"${workflow.input.siteId}"},"headers":"${workflow.input.headers}","headers.workflowId":"${workflow.workflowId}","headers.workflowType":"${workflow.workflowType}","headers.taskRefName":"eventTaskRefF0I9","action":"complete_task","completeSink":"","sink":"conductor","asyncComplete":false},"type":"EVENT","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"sink":"conductor","optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],"b":[{"name":"HTTP_task","taskReferenceName":"httpRequestTaskRef_ZQ1S","inputParameters":{"http_request":{"uri":"${workflow.input.uri}","method":"GET","accept":"application/json","contentType":"application/json","headers":{"httpHeader":"aaaa, bbb","header2":"blabla"},"body":"","vipAddress":"","asyncComplete":false,"oauthConsumerKey":"","oauthConsumerSecret":"","connectionTimeOut":100,"readTimeOut":150}},"type":"HTTP","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]},"description":null,"forkTasks":[],"inputParameters":{"param":"b"},"name":"DECISION","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"decisionTaskRef_9N8A","type":"DECISION"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_YFUC","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_YFDR","type":"LAMBDA"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_48CD","type":"LAMBDA"}]],"inputParameters":{},"name":"FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"forkTaskRef_17RD","type":"FORK_JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_QUBF","type":"JOIN"}],"timeoutSeconds":0,"updatedBy":"admin@totalsoft.ro","version":1,"workflowStatusListenerEnabled":true}'
    const wfObject = JSON.parse(wfString)

    const diagram = getApplicationDiagram()
    const { engine } = diagram

    drawDiagram(wfObject, engine)
    expect(engine.getModel().getNodes().length).toEqual(11)

    const start = getStartNode(engine.getModel().getLinks())
    expect(start).toBeInstanceOf(StartNodeModel)

    engine.getModel().removeNode(start)
    expect(engine.getModel().getNodes().length).toEqual(10)
  })

  it("Should not break if it doesn't find a START node", () => {
    const diagram = getApplicationDiagram()
    const { engine } = diagram
    engine.setModel(new DiagramModel())

    const missingStart = getStartNode(engine.getModel().getLinks())
    expect(missingStart).toBeUndefined()
  })

  it('Should get the END node', () => {
    const wfString =
      '{"__typename":"WorkflowDef","createdBy":"admin@totalsoft.ro","description":null,"failureWorkflow":null,"name":"Frumusel","ownerEmail":"admin@totalsoft.ro","tasks":[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_12BE","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":"","caseValueParam":"param","decisionCases":{"a":[{"name":"EVENT","taskReferenceName":"eventTaskRefF0I9","inputParameters":{"payload":{"documentId":"${workflow.input.documentId}","siteId":"${workflow.input.siteId}"},"headers":"${workflow.input.headers}","headers.workflowId":"${workflow.workflowId}","headers.workflowType":"${workflow.workflowType}","headers.taskRefName":"eventTaskRefF0I9","action":"complete_task","completeSink":"","sink":"conductor","asyncComplete":false},"type":"EVENT","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"sink":"conductor","optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],"b":[{"name":"HTTP_task","taskReferenceName":"httpRequestTaskRef_ZQ1S","inputParameters":{"http_request":{"uri":"${workflow.input.uri}","method":"GET","accept":"application/json","contentType":"application/json","headers":{"httpHeader":"aaaa, bbb","header2":"blabla"},"body":"","vipAddress":"","asyncComplete":false,"oauthConsumerKey":"","oauthConsumerSecret":"","connectionTimeOut":100,"readTimeOut":150}},"type":"HTTP","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]},"description":null,"forkTasks":[],"inputParameters":{"param":"b"},"name":"DECISION","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"decisionTaskRef_9N8A","type":"DECISION"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_YFUC","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_YFDR","type":"LAMBDA"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_48CD","type":"LAMBDA"}]],"inputParameters":{},"name":"FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"forkTaskRef_17RD","type":"FORK_JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_QUBF","type":"JOIN"}],"timeoutSeconds":0,"updatedBy":"admin@totalsoft.ro","version":1,"workflowStatusListenerEnabled":true}'
    const wfObject = JSON.parse(wfString)

    const diagram = getApplicationDiagram()
    const { engine } = diagram

    drawDiagram(wfObject, engine)
    expect(engine.getModel().getNodes().length).toEqual(11)

    const end = getEndNode(engine.getModel().getLinks())
    expect(end).toBeInstanceOf(EndNodeModel)

    engine.getModel().removeNode(end)
    expect(engine.getModel().getNodes().length).toEqual(10)
  })

  it("Should not break if it doesn't find a END node", () => {
    const engine = createEngine()
    engine.setModel(new DiagramModel())
    const missingEnd = getEndNode(engine.getModel().getLinks())
    expect(missingEnd).toBeUndefined()
  })

  it('Should return the exact number of input and output links', () => {
    const wfString =
      '{"__typename":"WorkflowDef","createdBy":"admin@totalsoft.ro","description":null,"failureWorkflow":null,"name":"TestLInks","ownerEmail":"admin@totalsoft.ro","tasks":[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_SO1C","type":"LAMBDA"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"Payload":{"DocumentId":"${workflow.input.DocumentId}","SiteId":"${workflow.input.SiteId}"},"Headers":"${workflow.input.Headers}","action":"complete_task","completeSink":""},"name":"EVENT","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"eventTaskRefKRBK","type":"EVENT"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"http_request":{"uri":"${workflow.input.uri}","method":"GET","accept":"application/json","contentType":"application/json","headers":{"httpHeader":"aaaa, bbb","header2":"blabla"},"body":"","vipAddress":"","asyncComplete":false,"oauthConsumerKey":"","oauthConsumerSecret":"","connectionTimeOut":100,"readTimeOut":150}},"name":"HTTP_task","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"httpRequestTaskRef_P9NN","type":"HTTP"}]],"inputParameters":{},"name":"FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"forkTaskRef_B01R","type":"FORK_JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_WC2G","type":"JOIN"}],"timeoutSeconds":0,"updatedBy":"","version":1,"workflowStatusListenerEnabled":true}'
    const wfObject = JSON.parse(wfString)

    const diagram = getApplicationDiagram()
    const { engine } = diagram

    drawDiagram(wfObject, engine)

    const join = engine
      .getModel()
      .getNodes()
      .find(n => n.type === nodeConfig.JOIN.type)
    const inputLinks = getLinksArray('in', join)
    expect(inputLinks.length).toEqual(3)

    const fork = engine
      .getModel()
      .getNodes()
      .find(n => n.type === nodeConfig.FORK_JOIN.type)
    const outputLinks = getLinksArray('out', fork)
    expect(outputLinks.length).toEqual(3)
  })

  it('Should return [] if there are no links', () => {
    const wfString =
      '{"__typename":"WorkflowDef","createdBy":"admin@totalsoft.ro","description":null,"failureWorkflow":null,"name":"TestLInks","ownerEmail":"admin@totalsoft.ro","tasks":[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_SO1C","type":"LAMBDA"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"Payload":{"DocumentId":"${workflow.input.DocumentId}","SiteId":"${workflow.input.SiteId}"},"Headers":"${workflow.input.Headers}","action":"complete_task","completeSink":""},"name":"EVENT","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"eventTaskRefKRBK","type":"EVENT"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{"http_request":{"uri":"${workflow.input.uri}","method":"GET","accept":"application/json","contentType":"application/json","headers":{"httpHeader":"aaaa, bbb","header2":"blabla"},"body":"","vipAddress":"","asyncComplete":false,"oauthConsumerKey":"","oauthConsumerSecret":"","connectionTimeOut":100,"readTimeOut":150}},"name":"HTTP_task","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"httpRequestTaskRef_P9NN","type":"HTTP"}]],"inputParameters":{},"name":"FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"forkTaskRef_B01R","type":"FORK_JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_WC2G","type":"JOIN"}],"timeoutSeconds":0,"updatedBy":"","version":1,"workflowStatusListenerEnabled":true}'
    const wfObject = JSON.parse(wfString)

    const diagram = getApplicationDiagram()
    const { engine } = diagram

    drawDiagram(wfObject, engine)

    const start = engine
      .getModel()
      .getNodes()
      .find(n => n.type === nodeConfig.START.type)
    const inputLinks = getLinksArray('in', start)
    expect(inputLinks.length).toEqual(0)

    const end = engine
      .getModel()
      .getNodes()
      .find(n => n.type === nodeConfig.END.type)
    const outputLinks = getLinksArray('out', end)
    expect(outputLinks.length).toEqual(0)
  })

  it('Should create output ports based on the decision cases', () => {
    const decisionNode = new DecisionNodeModel()
    const cases = keys({ case1: 'This is the first case', case2: 'This is the second case', case3: 'This is the third case' })
    decisionCasesToPorts(decisionNode, cases)

    expect(decisionNode.getOutPorts().length).toEqual(3)
    expect(decisionNode.getOutPorts()[0].getOptions().label).toEqual('case1')
    expect(decisionNode.getOutPorts()[1].getOptions().label).toEqual('case2')
    expect(decisionNode.getOutPorts()[2].getOptions().label).toEqual('case3')
  })

  it('Should parse diagram to JSON. Even workflows containing decision in decision branches.', () => {
    const wfString =
      '{"name":"multeDecizii","version":1,"historyId":null,"description":null,"createdBy":"admin@totalsoft.ro","updatedBy":"admin@totalsoft.ro","ownerEmail":"admin@totalsoft.ro","createTime":0,"updateTime":1643104997962,"timeoutSeconds":0,"failureWorkflow":null,"workflowStatusListenerEnabled":true,"outputParameters":{},"inputParameters":[],"schemaVersion":2,"restartable":true,"__typename":"WorkflowDef","tasks":[{"type":"DECISION","name":"DECISION","description":null,"caseValueParam":"param","caseExpression":"","decisionCases":{"1":[{"name":"DECISION","taskReferenceName":"decisionTaskRef_1RJK","inputParameters":{"param2":"${workflow.input.param2}"},"type":"DECISION","caseValueParam":"param2","caseExpression":"","decisionCases":{"a":[{"name":"TERMINATE","taskReferenceName":"terminateTaskRef_G6OF","inputParameters":{"terminationStatus":"COMPLETED","workflowOutput":"False"},"type":"TERMINATE","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],"b":[{"name":"TERMINATE","taskReferenceName":"terminateTaskRef_7CCJ","inputParameters":{"terminationStatus":"COMPLETED","workflowOutput":"False"},"type":"TERMINATE","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],"2":[{"name":"DECISION","taskReferenceName":"decisionTaskRef_42CC","inputParameters":{"param3":"${workflow.input.param3}"},"type":"DECISION","caseValueParam":"param3","caseExpression":"","decisionCases":{"c":[{"name":"FORK","taskReferenceName":"forkTaskRef_F3FR","inputParameters":{},"type":"FORK_JOIN","decisionCases":{},"defaultCase":[],"forkTasks":[[{"name":"LAMBDA","taskReferenceName":"lambdaTaskRef_VO1G","inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"type":"LAMBDA","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],[{"name":"EVENT","taskReferenceName":"eventTaskRefRRVV","inputParameters":{"Payload":{"DocumentId":"${workflow.input.DocumentId}","SiteId":"${workflow.input.SiteId}"},"Headers":"${workflow.input.Headers}","action":"complete_task","completeSink":""},"type":"EVENT","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"sink":"conductor","optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],[{"name":"HTTP_task","taskReferenceName":"httpRequestTaskRef_PP9R","inputParameters":{"http_request":{"uri":"${workflow.input.uri}","method":"GET","accept":"application/json","contentType":"application/json","headers":{},"body":"","vipAddress":"","asyncComplete":false,"oauthConsumerKey":"","oauthConsumerSecret":"","connectionTimeOut":100,"readTimeOut":150}},"type":"HTTP","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]},{"name":"JOIN","taskReferenceName":"joinTaskRef_3SMX","inputParameters":{},"type":"JOIN","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":["lambdaTaskRef_VO1G","eventTaskRefRRVV","httpRequestTaskRef_PP9R"],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],"d":[{"name":"LAMBDA","taskReferenceName":"lambdaTaskRef_LWCY","inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"type":"LAMBDA","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]},"inputParameters":{"param":"${workflow.input.param}"},"taskReferenceName":"decisionTaskRef_ZVKF","subWorkflowParam":null,"dynamicForkTasksInputParamName":null,"dynamicForkTasksParam":null,"optional":false,"sink":null,"startDelay":0,"asyncComplete":false,"__typename":"WorkflowTask","forkTasks":[],"defaultCase":[{"type":"LAMBDA","name":"LAMBDA","description":null,"caseValueParam":null,"caseExpression":null,"decisionCases":{},"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"taskReferenceName":"lambdaTaskRef_UBN6","subWorkflowParam":null,"dynamicForkTasksInputParamName":null,"dynamicForkTasksParam":null,"optional":false,"sink":null,"startDelay":0,"asyncComplete":false,"__typename":"WorkflowTask"}]}]}'

    const wfObject = JSON.parse(wfString)

    const diagram = getApplicationDiagram()
    const { engine } = diagram
    drawDiagram(wfObject, engine)

    const finalWorkflowObject = parseDiagramToJSON(engine)
    expect(finalWorkflowObject.tasks.length).toEqual(wfObject.tasks.length)
  })
})
