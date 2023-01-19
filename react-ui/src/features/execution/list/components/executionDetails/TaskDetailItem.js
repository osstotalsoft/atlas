import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import tableStyles from 'assets/jss/components/tableStyle'
import { makeStyles } from '@material-ui/core'
import { Tr, Td } from 'react-super-responsive-table'
import { Typography, IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const useStyles = makeStyles(tableStyles)

const TaskDetailItem = ({ task }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const history = useHistory()

  const handleSubWorkflowClick = useCallback(
    () => history.push(`/executions/${task?.outputData?.subWorkflowId}`),
    [history, task?.outputData?.subWorkflowId]
  )

  return (
    <Tr>
      <Td className={classes.tableContent}>
        <Typography>{task?.taskType}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <Typography>{`${task?.taskDefName} (${task?.referenceTaskName})`}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        {task?.taskType === 'SUB_WORKFLOW' ? (
          <IconButton
            size='small'
            color='themeNoBackground'
            onClick={handleSubWorkflowClick}
            tooltip={t('Execution.Buttons.GoToExecution')}
          >
            <ExitToAppIcon fontSize='small' />
          </IconButton>
        ) : (
          <Typography>{'-'}</Typography>
        )}
      </Td>
      <Td className={classes.tableContent}>
        <Typography>{t('DATE_FORMAT', { date: { value: task?.startTime, format: 'DD-MM-YYYY HH:mm:ss' } }) || '-'}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <Typography>{t('DATE_FORMAT', { date: { value: task?.endTime, format: 'DD-MM-YYYY HH:mm:ss' } }) || '-'}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <Typography>{task?.status}</Typography>
      </Td>
    </Tr>
  )
}

TaskDetailItem.propTypes = {
  task: PropTypes.object.isRequired
}

export default TaskDetailItem
