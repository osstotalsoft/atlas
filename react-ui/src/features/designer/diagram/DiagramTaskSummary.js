import React from 'react'
import PropTypes from 'prop-types'
import { Box, makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import tableStyle from 'assets/jss/components/tableStyle'
import { IconCollapseCard } from '@bit/totalsoft_oss.react-mui.kit.core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import DiagramTaskSummaryHeader from './DiagramTaskSummaryHeader'
import ReactJson from 'react-json-view'

const useStyles = makeStyles(tableStyle)

const DiagramTaskSummary = ({ selectedTask }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <>
      <Box className={classes.tableHeader}>
        <DiagramTaskSummaryHeader selectedTask={selectedTask} />
      </Box>
      <IconCollapseCard
        icon={ArrowForwardIcon}
        canExpand={true}
        defaultExpanded={true}
        title={t('Execution.Input')}
        content={
          <ReactJson
            src={selectedTask?.inputData}
            name={false}
            displayDataTypes={false}
            enableClipboard={false}
            style={{ wordBreak: 'break-word' }}
          />
        }
      />
      <IconCollapseCard
        icon={ArrowBackIcon}
        canExpand={true}
        defaultExpanded={true}
        title={t('Execution.Output')}
        content={
          <ReactJson
            src={selectedTask?.outputData}
            name={false}
            displayDataTypes={false}
            enableClipboard={false}
            style={{ wordBreak: 'break-word' }}
          />
        }
      />
    </>
  )
}

DiagramTaskSummary.propTypes = {
  selectedTask: PropTypes.object.isRequired
}

export default DiagramTaskSummary
