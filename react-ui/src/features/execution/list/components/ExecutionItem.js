import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Td, Tr } from 'react-super-responsive-table'
import { EditButton, Typography, IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import { makeStyles } from '@mui/styles'
import tableStyle from 'assets/jss/components/tableStyle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { Link } from '@mui/material'

const useStyles = makeStyles(tableStyle)

const ExecutionItem = ({ onSeeDetails, onGotoDefinition, execution }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const handleSeeDetails = useCallback(() => onSeeDetails(execution), [execution, onSeeDetails])
  const handleGoToDefinition = useCallback(() => {
    onGotoDefinition(execution?.workflowType, execution?.version)
  }, [execution?.version, execution?.workflowType, onGotoDefinition])

  return (
    <>
      <Tr>
        <Td className={classes.tableContent}>
          <Typography>{execution?.workflowType}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Typography>{execution?.version}</Typography>
        </Td>
        <Td className={classes.tableContent}>
          <Typography><Link href={"executions/" + execution?.workflowId} underline="none">{execution?.workflowId}</Link></Typography>
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
          <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.GoToDefinition')} onClick={handleGoToDefinition}>
            <ExitToAppIcon fontSize='small' />
          </IconButton>
        </Td>
      </Tr>
    </>
  )
}

ExecutionItem.propTypes = {
  execution: PropTypes.object.isRequired,
  onSeeDetails: PropTypes.func.isRequired,
  onGotoDefinition: PropTypes.func.isRequired
}

export default ExecutionItem
