import { DecisionNodeModel } from '../nodeModels/decisionNode/DecisionNodeModel'
import { EndNodeModel } from '../nodeModels/endNode/EndNodeModel'
import { LambdaNodeModel } from '../nodeModels/lambdaNode/LambdaNodeModel'
import { StartNodeModel } from '../nodeModels/startNode/StartNodeModel'
import { JoinNodeModel } from '../nodeModels/joinNode/JoinNodeModel'
import { TerminateNodeModel } from '../nodeModels/terminateNode/TerminateNodeModel'
import { ForkNodeModel } from '../nodeModels/forkNode/ForkNodeModel'
import { DynamicForkNodeModel } from '../nodeModels/dynamicForkNode/DynamicForkNodeModel'
import { EventNodeModel } from '../nodeModels/eventNode/EventNodeModel'
import { HttpNodeModel } from '../nodeModels/httpNode/HttpNodeModel'
import { includes } from 'ramda'
import { SubworkflowNodeModel } from '../nodeModels/subworkflowNode/SubworkflowNodeModel'
import { theme } from 'utils/theme'
import { TaskNodeModel } from '../nodeModels/taskNode/TaskNodeModel'

export const nodeConfig = {
  START: {
    name: 'START',
    type: 'START',
    color: 'rgb(0,0,0)',
    getInstance: () => new StartNodeModel()
  },
  LAMBDA: {
    name: 'LAMBDA',
    type: 'LAMBDA',
    color: 'rgb(255,233,28)',
    hasParametersTab: true,
    getInstance: task => new LambdaNodeModel(task)
  },
  EVENT: {
    name: 'EVENT',
    type: 'EVENT',
    color: 'rgb(254,58,158)',
    hasParametersTab: true,
    getInstance: task => new EventNodeModel(task)
  },
  HTTP: {
    name: 'HTTP',
    type: 'HTTP',
    color: 'rgb(255,152,0)',
    hasParametersTab: true,
    getInstance: task => new HttpNodeModel(task)
  },
  DECISION: {
    name: 'DECISION',
    type: 'DECISION',
    color: 'rgb(20, 247, 127)',
    hasParametersTab: true,
    getInstance: task => new DecisionNodeModel(task)
  },
  TERMINATE: {
    name: 'TERMINATE',
    type: 'TERMINATE',
    color: 'rgb(255,0,0)',
    hasParametersTab: false,
    terminationStatus: {
      completed: 'COMPLETED',
      failed: 'FAILED'
    },
    getInstance: task => new TerminateNodeModel(task)
  },
  JOIN: {
    name: 'JOIN',
    type: 'JOIN',
    color: 'rgb(63,81,181)',
    hasParametersTab: true,
    getInstance: task => new JoinNodeModel(task)
  },
  FORK_JOIN: {
    name: 'FORK',
    type: 'FORK_JOIN',
    color: 'rgb(53,137,204)',
    getInstance: task => new ForkNodeModel(task)
  },
  FORK_JOIN_DYNAMIC: {
    name: 'DYNAMIC_FORK',
    type: 'FORK_JOIN_DYNAMIC',
    color: 'rgb(125,0,156)',
    hasParametersTab: true,
    getInstance: task => new DynamicForkNodeModel(task)
  },
  SUB_WORKFLOW: {
    name: 'SUB_WORKFLOW',
    type: 'SUB_WORKFLOW',
    color: theme.palette.secondary.main,
    hasParametersTab: true,
    getInstance: task => new SubworkflowNodeModel(task)
  },
  TASK: {
    name: 'TASK',
    type: 'TASK',
    color: 'rgb(123,132,220)',
    hasParametersTab: true,
    getInstance: task => new TaskNodeModel(task)
  },
  END: {
    name: 'END',
    type: 'END',
    color: 'rgb(0,0,0)',
    getInstance: () => new EndNodeModel()
  }
}
export const isDefault = type =>
  includes(type, [
    nodeConfig.LAMBDA.type,
    nodeConfig.TERMINATE.type,
    nodeConfig.EVENT.type,
    nodeConfig.HTTP.type,
    nodeConfig.SUB_WORKFLOW.type,
    nodeConfig.TASK.type
  ])
