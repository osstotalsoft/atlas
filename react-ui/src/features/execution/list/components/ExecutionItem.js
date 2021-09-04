import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Td, Tr } from 'react-super-responsive-table'
import { EditButton, Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import { makeStyles } from '@material-ui/core'
import tableStyle from 'assets/jss/components/tableStyle'

const useStyles = makeStyles(tableStyle)

const ExecutionItem = ({ onSeeDetails, execution }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const handleSeeDetails = useCallback(() => onSeeDetails(execution), [execution, onSeeDetails])

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>
          <Typography>{execution?.workflowType}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{execution?.workflowId}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{execution?.status}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{t('DATE_FORMAT', { date: { value: execution?.startTime, format: 'DD-MM-YYYY HH:mm:ss' } }) || '-'}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{t('DATE_FORMAT', { date: { value: execution?.endTime, format: 'DD-MM-YYYY HH:mm:ss' } }) || '-'}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <EditButton
            size='small'
            color='themeNoBackground'
            tooltip={t('Execution.Buttons.SeeDetails')}
            editMode={false}
            onClick={handleSeeDetails}
          />
        </Td>
      </Tr>
    </>
  )
}

ExecutionItem.propTypes = {
  execution: PropTypes.object.isRequired,
  onSeeDetails: PropTypes.func.isRequired
}

export default ExecutionItem
