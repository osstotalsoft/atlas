const { nodeConfig } = require('features/designer/constants/NodeConfig')
const { getApplicationDiagram } = require('features/designer/diagram/getApplicationDiagram')
const { drawDiagram } = require('features/designer/drawingHandler')
const { default: HttpNodeModel } = require('features/designer/nodeModels/httpNode/HttpNodeModel')

describe('Undo and Redo actions should work as expected.', () => {
  //START->HTTP->END
  it('Should UNDO the command of deleting the HTTP node. Redo should delete the node again', () => {
    //Arrange
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

    http.setSelected(true)

    //DELETE
    diagram.deleteSelected()
    const deleted = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.HTTP.type)
    expect(deleted).toBeUndefined()

    //UNDO
    diagram.undo()
    const restored = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.HTTP.type)
    expect(restored).not.toBeUndefined()
    expect(Object.values(restored.portsIn[0].links)[0].sourcePort.parent.type).toEqual(nodeConfig.START.type)
    expect(Object.values(restored.portsOut[0].links)[0].targetPort.parent.type).toEqual(nodeConfig.END.type)

    //REDO
    diagram.redo()
    const deletedAgain = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.HTTP.type)
    expect(deletedAgain).toBeUndefined()
  })

  //In order to easily follow the tests using this complex workflow, please open its corresponding diagram found at src\__tests__\img\workflowForTesting.JPG
  it('Should undo the deletion of DECISION node and bring back the node with its links. Redo command should delete it again.', () => {
    const wfString =
      '{"__typename":"WorkflowDef","createdBy":"admin@totalsoft.ro","description":null,"failureWorkflow":null,"name":"AllExistingNodes","ownerEmail":"admin@totalsoft.ro","tasks":[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_6K0H","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":"","caseValueParam":"","decisionCases":{"case1":[{"name":"EVENT","taskReferenceName":"eventTaskRefBKLS","inputParameters":{"Payload":{"DocumentId":"${workflow.input.DocumentId}","SiteId":"${workflow.input.SiteId}"},"Headers":"${workflow.input.Headers}","action":"complete_task","completeSink":""},"type":"EVENT","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"sink":"conductor","optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],"case2":[{"name":"TERMINATE","taskReferenceName":"terminateTaskRef_7H34","inputParameters":{"terminationStatus":"COMPLETED","workflowOutput":"False"},"type":"TERMINATE","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]},"description":null,"forkTasks":[],"inputParameters":{"param":"${workflow.input.param}"},"name":"DECISION","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"decisionTaskRef_4SN6","type":"DECISION"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"http_request":{"uri":"${workflow.input.uri}","method":"GET","accept":"application/json","contentType":"application/json","headers":{"httpHeader":"aaaa, bbb","header2":"blabla"},"body":"","vipAddress":"","asyncComplete":false,"oauthConsumerKey":"","oauthConsumerSecret":"","connectionTimeOut":100,"readTimeOut":150}},"name":"HTTP_task","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"httpRequestTaskRef_SSWW","type":"HTTP"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":"http_task","inputParameters":{},"name":"http_task","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"http_task_ref_VMQS","type":"TASK"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{},"name":"TestP1","optional":false,"startDelay":0,"subWorkflowParam":{"__typename":"SubWorkflowParams","name":"TestP1","version":1},"taskReferenceName":"testp1_ref_2Z6O","type":"SUB_WORKFLOW"}]],"inputParameters":{},"name":"FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"forkTaskRef_0CMK","type":"FORK_JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_TDWG","type":"JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_L5QV","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"dynamicTasks":"${workflow.input.dynamic_tasks}","input":"${workflow.input.dynamic_tasks_input}"},"name":"DYNAMIC_FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"dynamicForkTaskRef_RN5P","type":"FORK_JOIN_DYNAMIC"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_UPBM","type":"JOIN"}],"timeoutSeconds":0,"updatedBy":"admin@totalsoft.ro","version":1,"workflowStatusListenerEnabled":true}'
    const wfObject = JSON.parse(wfString)
    const diagram = getApplicationDiagram()
    const { engine } = diagram
    drawDiagram(wfObject, engine, false)

    expect(engine.getModel().getNodes().length).toEqual(14)
    expect(engine.getModel().getLinks().length).toEqual(15)

    const decision = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.DECISION.type)
    decision.setSelected(true)

    //DELETE
    diagram.deleteSelected()
    expect(engine.getModel().getNodes().length).toEqual(13)
    expect(engine.getModel().getLinks().length).toEqual(12)

    //UNDO
    diagram.undo()
    expect(engine.getModel().getNodes().length).toEqual(14)
    expect(engine.getModel().getLinks().length).toEqual(15)

    //REDO
    diagram.redo()
    expect(engine.getModel().getNodes().length).toEqual(13)
    expect(engine.getModel().getLinks().length).toEqual(12)
  })

  //In order to easily follow the tests using this complex workflow, please open its corresponding diagram found at src\__tests__\img\workflowForTesting.JPG
  it('Should undo the deletion of FORK node and bring back the node with its links. Redo command should delete it again.', () => {
    const wfString =
      '{"__typename":"WorkflowDef","createdBy":"admin@totalsoft.ro","description":null,"failureWorkflow":null,"name":"AllExistingNodes","ownerEmail":"admin@totalsoft.ro","tasks":[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_6K0H","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":"","caseValueParam":"","decisionCases":{"case1":[{"name":"EVENT","taskReferenceName":"eventTaskRefBKLS","inputParameters":{"Payload":{"DocumentId":"${workflow.input.DocumentId}","SiteId":"${workflow.input.SiteId}"},"Headers":"${workflow.input.Headers}","action":"complete_task","completeSink":""},"type":"EVENT","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"sink":"conductor","optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],"case2":[{"name":"TERMINATE","taskReferenceName":"terminateTaskRef_7H34","inputParameters":{"terminationStatus":"COMPLETED","workflowOutput":"False"},"type":"TERMINATE","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]},"description":null,"forkTasks":[],"inputParameters":{"param":"${workflow.input.param}"},"name":"DECISION","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"decisionTaskRef_4SN6","type":"DECISION"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"http_request":{"uri":"${workflow.input.uri}","method":"GET","accept":"application/json","contentType":"application/json","headers":{"httpHeader":"aaaa, bbb","header2":"blabla"},"body":"","vipAddress":"","asyncComplete":false,"oauthConsumerKey":"","oauthConsumerSecret":"","connectionTimeOut":100,"readTimeOut":150}},"name":"HTTP_task","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"httpRequestTaskRef_SSWW","type":"HTTP"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":"http_task","inputParameters":{},"name":"http_task","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"http_task_ref_VMQS","type":"TASK"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{},"name":"TestP1","optional":false,"startDelay":0,"subWorkflowParam":{"__typename":"SubWorkflowParams","name":"TestP1","version":1},"taskReferenceName":"testp1_ref_2Z6O","type":"SUB_WORKFLOW"}]],"inputParameters":{},"name":"FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"forkTaskRef_0CMK","type":"FORK_JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_TDWG","type":"JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_L5QV","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"dynamicTasks":"${workflow.input.dynamic_tasks}","input":"${workflow.input.dynamic_tasks_input}"},"name":"DYNAMIC_FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"dynamicForkTaskRef_RN5P","type":"FORK_JOIN_DYNAMIC"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_UPBM","type":"JOIN"}],"timeoutSeconds":0,"updatedBy":"admin@totalsoft.ro","version":1,"workflowStatusListenerEnabled":true}'
    const wfObject = JSON.parse(wfString)
    const diagram = getApplicationDiagram()
    const { engine } = diagram
    drawDiagram(wfObject, engine, false)

    expect(engine.getModel().getNodes().length).toEqual(14)
    expect(engine.getModel().getLinks().length).toEqual(15)

    const fork = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.FORK_JOIN.type)
    fork.setSelected(true)

    //DELETE
    diagram.deleteSelected()
    expect(engine.getModel().getNodes().length).toEqual(13)
    expect(engine.getModel().getLinks().length).toEqual(12)

    //UNDO
    diagram.undo()
    expect(engine.getModel().getNodes().length).toEqual(14)
    expect(engine.getModel().getLinks().length).toEqual(15)

    const restored = engine
      .getModel()
      .getNodes()
      .find(n => n.type == nodeConfig.FORK_JOIN.type)
    expect(Object.values(restored.portsIn[0].links)[0].sourcePort.parent.type).toEqual(nodeConfig.HTTP.type)
    expect(Object.values(restored.portsOut[0].links)[0].targetPort.parent.type).toEqual(nodeConfig.TASK.type)
    expect(Object.values(restored.portsOut[0].links)[1].targetPort.parent.type).toEqual(nodeConfig.SUB_WORKFLOW.type)

    //REDO
    diagram.redo()
    expect(engine.getModel().getNodes().length).toEqual(13)
    expect(engine.getModel().getLinks().length).toEqual(12)
  })
})
