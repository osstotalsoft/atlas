import { SCHEDULE_LIST_QUERY } from '../list/queries/ScheduleListQueries'

export const updateCacheList = (cache, variables, newList) => {
  cache.writeQuery({
    query: SCHEDULE_LIST_QUERY,
    data: {
      scheduleList: newList
    },
    variables
  })
}
