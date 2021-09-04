export const handlerConfig = {
  name: '',
  active: true,
  sink: '',
  condition: '',
  actions: []
}

export const actionType = {
  COMPLETE_TASK: 'COMPLETE_TASK',
  FAIL_TASK: 'FAIL_TASK',
  START_WORKFLOW: 'START_WORKFLOW'
}

export const actionTypeList = [{ name: actionType.START_WORKFLOW }, { name: actionType.COMPLETE_TASK }, { name: actionType.FAIL_TASK }]
