import React from 'react'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { makeStyles } from '@mui/styles'
import styles from '../styles'
import WorkflowHistoryItem from './WorkflowHistoryItem'
import { useTranslation } from 'react-i18next'
import LoadingFakeText from '@bit/totalsoft_oss.react-mui.fake-text'
import { apply } from 'ramda'

const useStyles = makeStyles(styles)

const WorkflowHistoryList = ({ workflow, historyList, loading, onRevert }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const latestVersion = apply(
    Math.max,
    historyList?.map(h => h.snapshotNumber)
  )

  if (loading) return <LoadingFakeText lines={6} />
  return (
    <Table className={classes.table}>
      <Thead>
        <Tr>
          <Th className={classes.tableHeader}>{t('WorkflowHistory.TimeStamp')}</Th>
          <Th className={classes.tableHeader}>{t('WorkflowHistory.ChangedBy')}</Th>
          <Th className={classes.tableHeader} />
        </Tr>
      </Thead>
      <Tbody>
        {historyList?.map(history => (
          <WorkflowHistoryItem
            key={history?.id}
            history={history}
            onRevert={onRevert}
            isLatest={history.snapshotNumber === latestVersion}
            workflow={workflow}
          />
        ))}
      </Tbody>
    </Table>
  )
}

WorkflowHistoryList.propTypes = {
  workflow: PropTypes.object,
  historyList: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  onRevert: PropTypes.func.isRequired
}

export default WorkflowHistoryList
