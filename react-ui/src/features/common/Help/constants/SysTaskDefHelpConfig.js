export const commonTaskDefHelpConfig = {
  NAME: [{ type: 'title', text: 'Helpers.SystemTaskDef.Common.Name' }],
  TASK_REF_NAME: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Common.TaskRefName' },
    {
      type: 'important',
      text: 'Helpers.SystemTaskDef.Common.UniqueTaskRef'
    }
  ],
  DESCRIPTION: [{ type: 'title', text: 'Helpers.SystemTaskDef.Common.Description' }],
  ADD_NEW_PARAM: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Common.AddNewParam' },
    {
      type: 'paragraph',
      text: 'Helpers.SystemTaskDef.Common.NewParamValues',
      highlight: 'Helpers.SystemTaskDef.Common.NewParamValuesHighlight',
      highlightStyle: 'yellow'
    },
    {
      type: 'paragraph',
      text: 'Helpers.SystemTaskDef.Common.NewParamNote'
    }
  ],
  OPTIONAL: [
    {
      type: 'title',
      text: 'Helpers.SystemTaskDef.Common.Optional'
    }
  ],
  START_DELAY: [{ type: 'title', text: 'Helpers.SystemTaskDef.Common.StartDelay' }],
  ASYNC_COMPLETE: [
    {
      type: 'dictionary',
      dictionaryItems: [
        {
          term: 'Helpers.SystemTaskDef.Common.TrueTerm',
          def: 'Helpers.SystemTaskDef.Common.TrueDef'
        },
        {
          term: 'Helpers.SystemTaskDef.Common.FalseTerm',
          def: 'Helpers.SystemTaskDef.Common.FalseDef'
        }
      ]
    }
  ]
}

export const lambdaHelpConfig = {
  SCRIPT_EXPRESSION: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Lambda.ScriptExpression' },
    { type: 'important', text: 'Helpers.SystemTaskDef.Lambda.Important' }
  ]
}

export const decisionHelpConfig = {
  PARAMETER_OR_EXPRESSION: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Decision.ParameterOrExpression' },
    {
      type: 'dictionary',
      dictionaryItems: [
        { term: 'Helpers.SystemTaskDef.Decision.ParameterTerm', def: 'Helpers.SystemTaskDef.Decision.ParameterDef' },
        { term: 'Helpers.SystemTaskDef.Decision.ExpressionTerm', def: 'Helpers.SystemTaskDef.Decision.ExpressionDef' }
      ]
    },
    { type: 'important', text: 'Helpers.SystemTaskDef.Decision.Important' }
  ],
  ADD_NEW_CASE_VALUE: [
    {
      type: 'title',
      text: 'Helpers.SystemTaskDef.Decision.AddNewCase'
    }
  ],
  CASE_VALUE_PARAM: [{ type: 'title', text: 'Helpers.SystemTaskDef.Decision.CaseValueParam' }]
}

export const eventHelpConfig = {
  SINK: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Event.SinkDef' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Event.SinkExample' }
  ],
  PAYLOAD: [{ type: 'title', text: 'Helpers.SystemTaskDef.Event.Payload' }]
}

export const httpHelpConfig = {
  URI: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Http.UriDef' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.UriDetails' }
  ],
  METHOD: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Http.MethodDef' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.MethodDetails' }
  ],
  ACCEPT: [
    {
      type: 'title',
      text: 'Helpers.SystemTaskDef.Http.AcceptDef'
    },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.AcceptDefault' }
  ],
  CONTENT_TYPE: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Http.ContentTypeDef' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.ContentTypeDetails' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.ContentTypeDefault' }
  ],
  VIP_ADDRESS: [{ type: 'title', text: 'Helpers.SystemTaskDef.Http.VipAddressDef' }],
  CONSUMER_KEY: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Http.ConsumerKeyDef' },
    {
      type: 'hyperlink',
      text: 'Helpers.SystemTaskDef.Http.OAuthDocumentation',
      keyword: 'Helpers.SystemTaskDef.Http.OAuthDocumentationKeyword',
      link: 'https://oauth.net/core/1.0/'
    }
  ],
  CONSUMER_SECRET: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Http.ConsumerSecretDef' },
    {
      type: 'hyperlink',
      text: 'Helpers.SystemTaskDef.Http.OAuthDocumentation',
      keyword: 'Helpers.SystemTaskDef.Http.OAuthDocumentationKeyword',
      link: 'https://oauth.net/core/1.0/'
    }
  ],
  CONNECTION_TIMEOUT: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Http.ConnectionTimeoutDef' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.ConnectionTimeoutDetails' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.ConnectionTimeoutDefault' }
  ],
  READ_TIMEOUT: [
    { type: 'title', text: 'Helpers.SystemTaskDef.Http.ReadTimeoutDef' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.ReadTimeoutDetails' },
    { type: 'paragraph', text: 'Helpers.SystemTaskDef.Http.ReadTimeoutDefault' }
  ],
  HEADERS: [{ type: 'title', text: 'Helpers.SystemTaskDef.Http.HeadersDef' }],
  BODY: [{ type: 'title', text: 'Helpers.SystemTaskDef.Http.BodyDef' }]
}

export const terminateHelpConfig = {
  FAILED_OR_COMPLETED: [{ type: 'title', text: 'Helpers.SystemTaskDef.Terminate.FailedOrCompletedDef' }],
  WORKFLOW_OUTPUT: [{ type: 'title', text: 'Helpers.SystemTaskDef.Terminate.WorkflowOutputDef' }]
}
