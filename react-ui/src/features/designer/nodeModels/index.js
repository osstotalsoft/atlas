import StartNodeFactory from './startNode/StartNodeFactory'
import EndNodeFactory from './endNode/EndNodeFactory'
import JoinNodeFactory from './joinNode/JoinNodeFactory'
import ForkNodeFactory from './forkNode/ForkNodeFactory'
import DynamicForkNodeFactory from './dynamicForkNode/DynamicForkNodeFactory'
import SubworkflowNodeFactory from './subworkflowNode/SubworkflowNodeFactory'

const nodes = [StartNodeFactory, EndNodeFactory, JoinNodeFactory, ForkNodeFactory, DynamicForkNodeFactory, SubworkflowNodeFactory]

export default nodes
