import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { FakeText, Card, IconButton, Pagination } from '@totalsoft/rocket-ui'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
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
    <Card
      icon={AssignmentIcon}
      title={t('Task.Name')}
      actions={[<IconButton key='addButton' type='add' color='secondary' title={t('Task.Buttons.AddTask')} onClick={onAddTask} />]}
    >
      {loading ? (
        <FakeText lines={10} />
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
            count={pager.totalCount}
            pageSize={pager.pageSize}
            page={pager.page}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageChange={handlePageChange}
            onRefresh={onRefresh}
          />
        </>
      )}
    </Card>
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
