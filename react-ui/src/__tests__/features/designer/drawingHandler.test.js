import { getApplicationDiagram } from 'features/designer/diagram/getApplicationDiagram'
const { nodeConfig } = require('features/designer/constants/NodeConfig')
const { drawDiagram } = require('features/designer/drawingHandler')

describe('Drawing handler should work as expected', () => {
  it('Draws diagram based on workflow JSON definition, containing one Event node:', () => {
    const wfString =
      '{"__typename":"WorkflowDef","createdBy":"admin@totalsoft.ro","description":null,"failureWorkflow":null,"name":"ForTest","ownerEmail":"admin@totalsoft.ro","tasks":[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"Payload":{"DocumentId":"${workflow.input.DocumentId}","SiteId":"${workflow.input.SiteId}"},"Headers":"${workflow.input.Headers}","action":"complete_task","completeSink":""},"name":"EVENT","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"eventTaskRef64Q5","type":"EVENT"}],"timeoutSeconds":0,"updatedBy":"","version":1,"workflowStatusListenerEnabled":true}'
    const wfObj = JSON.parse(wfString)

    const diagram = getApplicationDiagram()
    const { engine } = diagram

    drawDiagram(wfObj, engine, false)
    expect(engine.getModel().getNodes().length).toEqual(3)

    const eventNode = engine
      .getModel()
      .getNodes()
      .find(n => n.type === nodeConfig.EVENT.type)
    expect(eventNode).not.toBeUndefined()
  })

  //In order to easily follow the tests using this complex workflow, please open its corresponding diagram found at src\__tests__\img\workflowForTesting.JPG
  it('Draws diagram composed by 2 Lambda, 1 Decision, 1 Fork, 2 Join, 1 Http, 1 Event, 1 DynamicFork, 1 Terminate, 1 Task, 1 Subworkflow, 1 Start, 1 End and 15 Links', () => {
    const wfString =
      '{"__typename":"WorkflowDef","createdBy":"admin@totalsoft.ro","description":null,"failureWorkflow":null,"name":"AllExistingNodes","ownerEmail":"admin@totalsoft.ro","tasks":[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_6K0H","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":"","caseValueParam":"","decisionCases":{"case1":[{"name":"EVENT","taskReferenceName":"eventTaskRefBKLS","inputParameters":{"Payload":{"DocumentId":"${workflow.input.DocumentId}","SiteId":"${workflow.input.SiteId}"},"Headers":"${workflow.input.Headers}","action":"complete_task","completeSink":""},"type":"EVENT","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"sink":"conductor","optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}],"case2":[{"name":"TERMINATE","taskReferenceName":"terminateTaskRef_7H34","inputParameters":{"terminationStatus":"COMPLETED","workflowOutput":"False"},"type":"TERMINATE","decisionCases":{},"defaultCase":[],"forkTasks":[],"startDelay":0,"joinOn":[],"optional":false,"defaultExclusiveJoinTask":[],"asyncComplete":false,"loopOver":[]}]},"description":null,"forkTasks":[],"inputParameters":{"param":"${workflow.input.param}"},"name":"DECISION","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"decisionTaskRef_4SN6","type":"DECISION"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"http_request":{"uri":"${workflow.input.uri}","method":"GET","accept":"application/json","contentType":"application/json","headers":{"httpHeader":"aaaa, bbb","header2":"blabla"},"body":"","vipAddress":"","asyncComplete":false,"oauthConsumerKey":"","oauthConsumerSecret":"","connectionTimeOut":100,"readTimeOut":150}},"name":"HTTP_task","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"httpRequestTaskRef_SSWW","type":"HTTP"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":"http_task","inputParameters":{},"name":"http_task","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"http_task_ref_VMQS","type":"TASK"}],[{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"inputParameters":{},"name":"TestP1","optional":false,"startDelay":0,"subWorkflowParam":{"__typename":"SubWorkflowParams","name":"TestP1","version":1},"taskReferenceName":"testp1_ref_2Z6O","type":"SUB_WORKFLOW"}]],"inputParameters":{},"name":"FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"forkTaskRef_0CMK","type":"FORK_JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_TDWG","type":"JOIN"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"lambdaValue":"${workflow.input.lambdaValue}","scriptExpression":"if ($.lambdaValue == 1) {\\n  return {testvalue: true} \\n} else { \\n  return {testvalue: false}\\n}"},"name":"LAMBDA","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"lambdaTaskRef_L5QV","type":"LAMBDA"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{"dynamicTasks":"${workflow.input.dynamic_tasks}","input":"${workflow.input.dynamic_tasks_input}"},"name":"DYNAMIC_FORK","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"dynamicForkTaskRef_RN5P","type":"FORK_JOIN_DYNAMIC"},{"__typename":"WorkflowTask","asyncComplete":false,"caseExpression":null,"caseValueParam":null,"decisionCases":{},"description":null,"forkTasks":[],"inputParameters":{},"name":"JOIN","optional":false,"startDelay":0,"subWorkflowParam":null,"taskReferenceName":"joinTaskRef_UPBM","type":"JOIN"}],"timeoutSeconds":0,"updatedBy":"admin@totalsoft.ro","version":1,"workflowStatusListenerEnabled":true}'
    const wfObject = JSON.parse(wfString)

    const diagram = getApplicationDiagram()
    const { engine } = diagram
    drawDiagram(wfObject, engine, false)

    const lambdaList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.LAMBDA.type)
    const decisionList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.DECISION.type)
    const forkList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.FORK_JOIN.type)
    const joinLIst = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.JOIN.type)
    const eventList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.EVENT.type)
    const httpList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.HTTP.type)
    const dynamicForkList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.FORK_JOIN_DYNAMIC.type)
    const terminateList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.TERMINATE.type)
    const taskList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.TASK.type)
    const subworkflowList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.SUB_WORKFLOW.type)
    const startList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.START.type)
    const endList = engine
      .getModel()
      .getNodes()
      .filter(n => n.type === nodeConfig.END.type)

    expect(lambdaList.length).toEqual(2)
    expect(decisionList.length).toEqual(1)
    expect(forkList.length).toEqual(1)
    expect(joinLIst.length).toEqual(2)
    expect(eventList.length).toEqual(1)
    expect(httpList.length).toEqual(1)
    expect(dynamicForkList.length).toEqual(1)
    expect(terminateList.length).toEqual(1)
    expect(taskList.length).toEqual(1)
    expect(subworkflowList.length).toEqual(1)
    expect(startList.length).toEqual(1)
    expect(endList.length).toEqual(1)

    const links = engine.getModel().getLinks()
    expect(links.length).toEqual(15)
  })
})
