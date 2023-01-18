export const tasksHelpConfig = {
  SYSTEM_TASKS: [
    {
      type: 'title',
      text: 'Helpers.Tray.SystemTasks'
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/configuration/systask.html'
    }
  ],
  TASKS: [
    {
      type: 'title',
      text: 'Helpers.Tray.Tasks'
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link:  'https://conductor.netflix.com/gettingstarted/basicconcepts.html#worker-tasks'
    }
  ],
  WORKFLOWS: [
    {
      type: 'title',
      text: 'Helpers.Tray.Workflows'
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/sub-workflow-task.html'
    }
  ]
}

export const sysTasksHelpConfig = {
  START: [
    {
      type: 'title',
      text: 'Helpers.Tray.Start.Def'
    },
    { type: 'divider' },
    { type: 'important', text: 'Helpers.Tray.Start.Mandatory' }
  ],
  LAMBDA: [
    {
      type: 'title',
      text: 'Helpers.Tray.Lambda.Def'
    },
    {
      type: 'paragraph',
      text: 'Helpers.Tray.Lambda.Details',
      gutterBottom: true
    },
    { type: 'divider' },
    { type: 'title', text: 'Helpers.Common.Output', gutterBottom: false },
    {
      type: 'dictionary',
      dictionaryItems: [
        {
          term: 'Helpers.Tray.Lambda.ResultTerm',
          def: 'Helpers.Tray.Lambda.ResultDef'
        }
      ]
    },
    {
      type: 'paragraph',
      text: 'Helpers.Tray.Lambda.ReferenceOutput',
      highlight: 'Helpers.Tray.Lambda.ReferenceOutputHighlight',
      highlightStyle: 'yellow'
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/inline-task.html'
    }
  ],
  DECISION: [
    { type: 'title', text: 'Helpers.Tray.Decision.Def' },
    {
      type: 'paragraph',
      text: 'Helpers.Tray.Decision.Details',
      gutterBottom: true
    },
    {
      type: 'divider'
    },
    { type: 'title', text: 'Helpers.Common.Output', gutterBottom: false },
    {
      type: 'dictionary',
      dictionaryItems: [
        {
          term: 'Helpers.Tray.Decision.CaseOutputTerm',
          def: 'Helpers.Tray.Decision.CaseOutputDef'
        }
      ]
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/switch-task.html'
    }
  ],
  EVENT: [
    { type: 'title', text: 'Helpers.Tray.Event.Def' },
    {
      type: 'paragraph',
      text: 'Helpers.Tray.Event.Details',
      gutterBottom: true
    },
    {
      type: 'divider'
    },
    { type: 'title', text: 'Helpers.Common.Output', gutterBottom: false },
    {
      type: 'dictionary',
      dictionaryItems: [
        {
          term: 'Helpers.Tray.Event.WorkflowInstanceIdTerm'
        },
        {
          term: 'Helpers.Tray.Event.WorkflowTypeTerm'
        },
        {
          term: 'Helpers.Tray.Event.WorkflowVersionTerm'
        },
        {
          term: 'Helpers.Tray.Event.CorrelationIdTerm'
        },
        {
          term: 'Helpers.Tray.Event.SinkTerm',
          def: 'Helpers.Tray.Event.SinkDef'
        },
        {
          term: 'Helpers.Tray.Event.AsyncCompleteTerm',
          def: 'Helpers.Tray.Event.AsyncCompleteDef'
        },
        {
          term: 'Helpers.Tray.Event.EventProducedTerm',
          def: 'Helpers.Tray.Event.EventProducedDef'
        }
      ]
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/event-task.html'
    }
  ],
  HTTP: [
    { type: 'title', text: 'Helpers.Tray.Http.Def' },
    { type: 'divider' },
    { type: 'title', text: 'Helpers.Tray.Http.Output', gutterBottom: false },
    {
      type: 'dictionary',
      dictionaryItems: [
        {
          term: 'Helpers.Tray.Http.BodyTerm',
          def: 'Helpers.Tray.Http.BodyDef'
        },
        { term: 'Helpers.Tray.Http.HeadersTerm', def: 'Helpers.Tray.Http.HeadersDef' },
        {
          term: 'Helpers.Tray.Http.StatusCodeTerm',
          def: 'Helpers.Tray.Http.StatusCodeDef'
        },
        { term: 'Helpers.Tray.Http.ReasonPhraseTerm', def: 'Helpers.Tray.Http.ReasonPhraseDef' }
      ]
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/http-task.html'
    }
  ],
  FORK_JOIN: [
    { type: 'title', text: 'Helpers.Tray.Fork.Def' },
    {
      type: 'important',
      text: 'Helpers.Tray.Fork.Important',
      gutterBottom: true
    },
    { type: 'divider' },
    { type: 'title', text: 'Helpers.Common.Output', gutterBottom: false },
    {
      type: 'dictionary',
      dictionaryItems: [{ term: 'Helpers.Tray.Fork.OutputTerm' }]
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/fork-task.html'
    }
  ],
  JOIN: [
    { type: 'title', text: 'Helpers.Tray.Join.Def' },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/join-task.html'
    }
  ],
  FORK_JOIN_DYNAMIC: [
    {
      type: 'title',
      text: 'Helpers.Tray.DynamicFork.Def'
    },
    { type: 'divider' },
    {
      type: 'paragraph',
      text: 'Helpers.Tray.DynamicFork.Details'
    },
    {
      type: 'paragraph',
      text: 'Helpers.Tray.DynamicFork.ComparisonFork'
    },
    { type: 'paragraph', text: 'Helpers.Tray.DynamicFork.ForkedTask' },
    {
      type: 'important',
      text: 'Helpers.Tray.DynamicFork.Important'
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/dynamic-fork-task.html'
    }
  ],
  TERMINATE: [
    {
      type: 'title',
      text: 'Helpers.Tray.Terminate.Def'
    },
    { type: 'divider' },
    { type: 'title', text: 'Helpers.Common.Output', gutterBottom: false },
    {
      type: 'dictionary',
      dictionaryItems: [
        {
          term: 'Helpers.Tray.Terminate.OutputTerm',
          def: 'Helpers.Tray.Terminate.OutputDef'
        }
      ]
    },
    {
      type: 'hyperlink',
      text: 'Helpers.Common.SeeDocumentation',
      keyword: 'Helpers.Common.Here',
      link: 'https://conductor.netflix.com/reference-docs/terminate-task.html'
    }
  ],
  END: [{ type: 'title', text: 'Helpers.Tray.End.Def' }, { type: 'divider' }, { type: 'important', text: 'Helpers.Tray.End.Mandatory' }]
}
