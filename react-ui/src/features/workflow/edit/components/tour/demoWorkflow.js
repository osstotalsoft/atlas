export const demoWf = {
  tasks: [
    {
      type: 'EVENT',
      name: 'EVENT',
      taskReferenceName: 'eventTaskRef966C',
      inputParameters: {
        Payload: {
          DocumentId: '${workflow.input.DocumentId}',
          SiteId: '${workflow.input.SiteId}'
        },
        Headers: '${workflow.input.Headers}',
        action: 'complete_task',
        completeSink: ''
      },
      optional: false,
      startDelay: 0,
      sink: 'conductor',
      asyncComplete: false
    },
    {
      name: 'FORK',
      type: 'FORK_JOIN',
      taskReferenceName: 'forkTaskRef_H3FE',
      description: null,
      forkTasks: [
        [
          {
            type: 'HTTP',
            name: 'HTTP_task',
            taskReferenceName: 'httpRequestTaskRef_YJ3W',
            inputParameters: {
              http_request: {
                uri: '${workflow.input.uri}',
                method: 'GET',
                accept: 'application/json',
                contentType: 'application/json',
                headers: {
                  httpHeader: 'aaaa, bbb',
                  header2: 'blabla'
                },
                body: '',
                vipAddress: '',
                asyncComplete: false,
                oauthConsumerKey: '',
                oauthConsumerSecret: '',
                connectionTimeOut: 100,
                readTimeOut: 150
              }
            },
            asyncComplete: false,
            startDelay: 0,
            optional: false
          }
        ],
        [
          {
            type: 'HTTP',
            name: 'HTTP_task',
            taskReferenceName: 'httpRequestTaskRef_SICY',
            inputParameters: {
              http_request: {
                uri: '${workflow.input.uri}',
                method: 'GET',
                accept: 'application/json',
                contentType: 'application/json',
                headers: {
                  httpHeader: 'aaaa, bbb',
                  header2: 'blabla'
                },
                body: '',
                vipAddress: '',
                asyncComplete: false,
                oauthConsumerKey: '',
                oauthConsumerSecret: '',
                connectionTimeOut: 100,
                readTimeOut: 150
              }
            },
            asyncComplete: false,
            startDelay: 0,
            optional: false
          }
        ]
      ]
    },
    {
      name: 'JOIN',
      type: 'JOIN',
      taskReferenceName: 'joinTaskRef_ASNU',
      description: null,
      joinOn: ['httpRequestTaskRef_YJ3W', 'httpRequestTaskRef_SICY']
    },
    {
      name: 'LAMBDA',
      type: 'LAMBDA',
      description: null,
      taskReferenceName: 'lambdaTaskRef_U7SB',
      inputParameters: {
        lambdaValue: '${workflow.input.lambdaValue}',
        scriptExpression: 'if ($.lambdaValue == 1) {\n  return {testvalue: true} \n} else { \n  return {testvalue: false}\n}'
      },
      optional: false,
      startDelay: 0
    }
  ],
  outputParameters: {},
  inputParameters: [],
  schemaVersion: 2,
  restartable: true,
  workflowStatusListenerEnabled: true,
  timeoutSeconds: 0
}
