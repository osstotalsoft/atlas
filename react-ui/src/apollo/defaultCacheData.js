import { emptyObject } from 'utils/constants'
import {
  workflowsPager,
  tasksPager,
  executionsPager,
  eventHandlersPager,
  workflowListFilter,
  taskListFilter,
  executionsFilter,
  eventHandlersFilter
} from './cacheKeyFunctions'

// Here you define the default values for local apollo state (@client only values)
// https://www.apollographql.com/docs/react/local-state/local-state-management/

const workflowsDefaultPager = {
  afterId: null,
  totalCount: 0,
  pageSize: 10,
  sortBy: 'Name',
  direction: 1,
  page: 0
}

const tasksDefaultPager = {
  afterId: null,
  totalCount: 0,
  pageSize: 10,
  sortBy: 'Name',
  direction: 1,
  page: 0
}

const executionsDefaultPager = {
  totalCount: 0,
  pageSize: 10,
  sortBy: 'Name',
  start: 0,
  page: 0
}

const eventHandlersDefaultPager = {
  totalCount: 0,
  pageSize: 10,
  direction: 1,
  page: 0
}

const workflowDefaultListFilter = emptyObject
const taskDefaultListFilter = emptyObject
const executionsDefaultFilter = emptyObject
const eventHandlersDefaultFilter = emptyObject

export const defaults = {
  [workflowsPager]: workflowsDefaultPager,
  [tasksPager]: tasksDefaultPager,
  [executionsPager]: executionsDefaultPager,
  [eventHandlersPager]: eventHandlersDefaultPager,
  [executionsFilter]: executionsDefaultFilter,
  [workflowListFilter]: workflowDefaultListFilter,
  [taskListFilter]: taskDefaultListFilter,
  [eventHandlersFilter]: eventHandlersDefaultFilter
}
