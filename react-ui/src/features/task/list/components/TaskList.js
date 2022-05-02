import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { LoadingFakeText, IconCard, CardTitle, AddButton, Pagination } from '@bit/totalsoft_oss.react-mui.kit.core'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { makeStyles, Grid } from '@material-ui/core'
import tableStyle from 'assets/jss/components/tableStyle'
import { useTranslation } from 'react-i18next'
import TaskItem from './TaskItem'
import { defaults } from 'apollo/defaultCacheData'
import { tasksPager } from 'apollo/cacheKeyFunctions'

const defaultPager = defaults[tasksPager]

const useStyles = makeStyles(tableStyle)

const TaskList = ({ pager, setPager, taskList, loading, onEditTask, onAddTask, onRefresh, onDeleteRow }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { page, pageSize, totalCount } = pager
  const currentPageTasks = taskList.slice(page * pageSize, (page + 1) * pageSize)
  const handleRowsPerPageChange = useCallback(newPageSize => setPager({ ...defaultPager, pageSize: parseInt(newPageSize, 10) }), [setPager])

  useEffect(() => {
    if (taskList && totalCount !== taskList.length) setPager(currentPager => ({ ...currentPager, totalCount: taskList?.length }))
  }, [setPager, taskList, totalCount])

  const handlePageChange = useCallback(
    newPage => {
      setPager(currentPager => ({ ...currentPager, page: newPage }))
    },
    [setPager]
  )

  return (
    <IconCard
      icon={AssignmentIcon}
      title={
        <CardTitle
          title={t('Task.Name')}
          actions={[<AddButton key='addButton' color={'theme'} title={t('Task.Buttons.AddTask')} onClick={onAddTask} />]}
        />
      }
      content={
        loading ? (
          <LoadingFakeText lines={10} />
        ) : (
          <>
            <Grid className={classes.enableScrollX}>
              <Table className={classes.table}>
                <Thead>
                  <Tr>
                    <Th className={classes.tableHeader}>{t('Task.Name')}</Th>
                    <Th className={classes.tableHeader}>{t('Task.Description')}</Th>
                    <Th className={classes.tableHeader}>{t('Task.CreateTime')}</Th>
                    <Th className={classes.tableHeader} />
                  </Tr>
                </Thead>
                <Tbody>
                  {currentPageTasks?.map(task => (
                    <TaskItem key={task?.name} task={task} onEditTask={onEditTask} onDeleteRow={onDeleteRow} />
                  ))}
                </Tbody>
              </Table>
            </Grid>
            <Pagination
              totalCount={pager.totalCount}
              pageSize={pager.pageSize}
              page={pager.page}
              onRowsPerPageChange={handleRowsPerPageChange}
              onPageChange={handlePageChange}
              onRefresh={onRefresh}
            />
          </>
        )
      }
    />
  )
}

TaskList.propTypes = {
  pager: PropTypes.object.isRequired,
  setPager: PropTypes.func.isRequired,
  taskList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired
}

export default TaskList
