import { sysTasksHelpConfig } from 'features/common/Help/constants/TrayHelpConfig'
import { nodeConfig } from './NodeConfig'

const { START, LAMBDA, EVENT, HTTP, DECISION, JOIN, TERMINATE, FORK_JOIN, FORK_JOIN_DYNAMIC, END } = nodeConfig

const trayItems = [
  { type: START.type, name: START.name, color: START.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.START },
  { type: LAMBDA.type, name: LAMBDA.name, color: LAMBDA.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.LAMBDA },
  { type: DECISION.type, name: DECISION.name, color: DECISION.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.DECISION },
  { type: EVENT.type, name: EVENT.name, color: EVENT.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.EVENT },
  { type: HTTP.type, name: HTTP.name, color: HTTP.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.HTTP },
  { type: FORK_JOIN.type, name: FORK_JOIN.name, color: FORK_JOIN.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.FORK_JOIN },
  { type: JOIN.type, name: JOIN.name, color: JOIN.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.JOIN },
  {
    type: FORK_JOIN_DYNAMIC.type,
    name: FORK_JOIN_DYNAMIC.name,
    color: FORK_JOIN_DYNAMIC.color,
    isSystemTask: true,
    helpConfig: sysTasksHelpConfig.FORK_JOIN_DYNAMIC
  },
  { type: TERMINATE.type, name: TERMINATE.name, color: TERMINATE.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.TERMINATE },
  { type: END.type, name: END.name, color: END.color, isSystemTask: true, helpConfig: sysTasksHelpConfig.END }
]

export default trayItems
