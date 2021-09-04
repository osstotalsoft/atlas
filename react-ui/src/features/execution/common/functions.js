import { EXECUTION_LIST_QUERY } from '../list/queries/ExecutionListQuery'

export const updateCacheList = (cache, newList, totalHits, variables) => {
  cache.writeQuery({
    query: EXECUTION_LIST_QUERY,
    data: {
      search1: {
        results: newList,
        totalHits: totalHits + 1
      }
    },
    variables
  })
}

export const generateFreeText = ({ workflowType, workflowId, status }) => {
  let query = ''
  if (workflowType) {
    let search = ''
    for (let i = 0; i < workflowType.length; i++) {
      search += `[${workflowType[i].toUpperCase()}${workflowType[i].toLowerCase()}]`
    }
    query = `(workflowType:/.*${search}.*/)`
  }
  if (workflowId) {
    if (query) query += 'AND'
    query += `(workflowId:${workflowId.trim()})`
  }
  if (status) {
    if (query) query += 'AND'
    query += `(status:${status})`
  }
  return query
}
