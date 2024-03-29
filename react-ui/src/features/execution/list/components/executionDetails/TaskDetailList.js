import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import styles from '../../styles'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import TaskDetailItem from './TaskDetailItem'

const useStyles = makeStyles(styles)

const TaskDetailList = ({ tasks }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Grid className={classes.enableScrollX}>
      <Table className={classes.table}>
        <Thead>
          <Tr>
            <Th className={classes.tableHeader}>{t('Execution.Task.Type')}</Th>
            <Th className={classes.tableHeader}>{t('Execution.Task.Task')}</Th>
            <Th className={classes.tableHeader}>{t('Execution.Task.SubWorkflow')}</Th>
            <Th className={classes.tableHeader}>{t('Execution.StartTime')}</Th>
            <Th className={classes.tableHeader}>{t('Execution.EndTime')}</Th>
            <Th className={classes.tableHeader}>{t('Execution.Status')}</Th>
            <Th className={classes.tableHeader} />
          </Tr>
        </Thead>
        <Tbody>
          {tasks?.map((task, index) => (
            <TaskDetailItem key={index} task={task} />
          ))}
        </Tbody>
      </Table>
    </Grid>
  )
}

TaskDetailList.propTypes = {
  tasks: PropTypes.array.isRequired
}

export default TaskDetailList
