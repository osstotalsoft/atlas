import { SCHELLAR_LIST_QUERY } from '../list/queries/SchellarListQueries'

export const updateCacheList = (cache, variables, newList) => {
  cache.writeQuery({
    query: SCHELLAR_LIST_QUERY,
    data: {
      scheduleList: newList
    },
    variables
  })
}
