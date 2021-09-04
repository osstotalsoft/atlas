export const hash = () => Math.random().toString(36).toUpperCase().substr(2, 4)

export const systemTasks = (type, props) => {
  switch (type) {
    case 'fork': {
      return {
        name: 'forkTask',
        taskReferenceName: 'forkTaskRef_' + hash(),
        type: 'FORK_JOIN',
        forkTasks: [],
        optional: false,
        startDelay: 0
      }
    }
    case 'join': {
      return {
        name: 'joinTask',
        taskReferenceName: 'joinTaskRef_' + hash(),
        type: 'JOIN',
        joinOn: [],
        optional: false,
        startDelay: 0
      }
    }
    case 'while': {
      const taskReferenceName = 'whileTaskRef_' + hash()
      return {
        name: 'whileTask',
        taskReferenceName: taskReferenceName,
        type: 'DO_WHILE',
        loopOver: [],
        loopCondition: `$.${taskReferenceName}['iteration'] < $.iterations`,
        inputParameters: {
          iterations: 10
        },
        optional: false,
        startDelay: 0
      }
    }
    case 'while_end': {
      return {
        name: 'whileTask_end',
        taskReferenceName: 'while_end' + hash(),
        type: 'WHILE_END',
        optional: false,
        startDelay: 0
      }
    }
    case 'decision': {
      return {
        name: 'decisionTask',
        taskReferenceName: 'decisionTaskRef_' + hash(),
        inputParameters: {
          param: 'true'
        },
        type: 'DECISION',
        caseValueParam: 'param',
        decisionCases: {
          true: []
        },
        defaultCase: [],
        optional: false,
        startDelay: 0
      }
    }
    case 'lambda': {
      return {
        name: 'LAMBDA_TASK',
        taskReferenceName: 'lambdaTaskRef_' + hash(),
        type: 'lambda',
        inputParameters: {
          lambdaValue: '${workflow.input.lambdaValue}',
          scriptExpression: 'if ($.lambdaValue == 1) {\n  return {testvalue: true} \n} else { \n  return {testvalue: false}\n}'
        },
        optional: false,
        startDelay: 0
      }
    }
    case 'js': {
      return {
        name: 'GLOBAL___js',
        taskReferenceName: 'lambdaJsTaskRef_' + hash(),
        type: 'SIMPLE',
        inputParameters: {
          lambdaValue: '${workflow.input.lambdaValue}',
          scriptExpression: `if ($.lambdaValue == 1) {
    return {testvalue: true};
  } else {
    return {testvalue: false};
  }`
        },
        optional: false,
        startDelay: 0
      }
    }
    case 'py': {
      return {
        name: 'GLOBAL___py',
        taskReferenceName: 'lambdaPyTaskRef_' + hash(),
        type: 'SIMPLE',
        inputParameters: {
          lambdaValue: '${workflow.input.lambdaValue}',
          scriptExpression: `if inputData["lambdaValue"] == "1":
    return {"testValue": True}
  else:
    return {"testValue": False}`
        },
        optional: false,
        startDelay: 0
      }
    }
    case 'graphQL': {
      // graphQL task is a simple facade on top of HTTP task
      return {
        name: props.prefixHttpTask + 'HTTP_task',
        taskReferenceName: 'graphQLTaskRef_' + hash(),
        inputParameters: {
          http_request: {
            uri: '${workflow.input.uri}',
            method: 'POST',
            body: {
              variables: {},
              query: `query queryResourceTypes {
       QueryResourceTypes{
           ID
           Name
       }
   }`
            },
            contentType: 'application/json',
            headers: {},
            timeout: 3600
          }
        },
        optional: false,
        startDelay: 0,
        type: 'SIMPLE'
      }
    }
    case 'terminate': {
      return {
        name: 'TERMINATE_TASK',
        taskReferenceName: 'terminateTaskRef_' + hash(),
        inputParameters: {
          terminationStatus: 'COMPLETED',
          workflowOutput: 'Expected workflow output'
        },
        type: 'TERMINATE',
        startDelay: 0,
        optional: false
      }
    }
    case 'http': {
      return {
        name: props.prefixHttpTask + 'HTTP_task',
        taskReferenceName: 'httpRequestTaskRef_' + hash(),
        inputParameters: {
          http_request: {
            uri: '${workflow.input.uri}',
            method: 'GET',
            contentType: 'application/json',
            headers: {},
            timeout: 3600
          }
        },
        type: 'SIMPLE',
        startDelay: 0,
        optional: false
      }
    }
    case 'event': {
      return {
        name: 'EVENT_TASK',
        taskReferenceName: 'eventTaskRef' + hash(),
        inputParameters: {
          Payload: JSON.parse('{"DocumentId": "${workflow.input.DocumentId}","SiteId": "${workflow.input.SiteId}"}'),
          Headers: '${workflow.input.Headers}',
          'Headers.WorkflowId': '${workflow.workflowId}',
          'Headers.WorkflowType': '${workflow.workflowType}',
          'Headers.TaskRefName': 'GetScoringGridTasks',
          action: 'complete_task',
          completeSink: ''
        },
        type: 'EVENT',
        sink: 'conductor',
        startDelay: 0,
        asyncComplete: true,
        optional: false
      }
    }
    case 'wait': {
      return {
        name: 'WAIT_TASK',
        taskReferenceName: 'waitTaskRef' + hash(),
        type: 'WAIT',
        startDelay: 0,
        optional: false
      }
    }
    case 'raw': {
      return {
        name: 'RAW',
        inputParameters: {
          raw: ''
        }
      }
    }
    case 'dynamic_fork': {
      return {
        name: 'dynamic_fanout',
        taskReferenceName: 'dynamic_fanout' + hash(),
        dynamicForkTasksInputParamName: 'input',
        dynamicForkTasksParam: 'dynamicTasks',
        inputParameters: {
          dynamicTasks: '${workflow.input.dynamic_tasks}',
          input: '${workflow.input.dynamic_tasks_input}'
        },
        type: 'FORK_JOIN_DYNAMIC',
        startDelay: 0,
        optional: false
      }
    }
    default:
      break
  }
}
