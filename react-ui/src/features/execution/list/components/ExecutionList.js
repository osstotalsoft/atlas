import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import ExecutionItem from './ExecutionItem'
import { IconCard, LoadingFakeText, Pagination } from '@bit/totalsoft_oss.react-mui.kit.core'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import tableStyle from 'assets/jss/components/tableStyle'

const useStyles = makeStyles(tableStyle)

const ExecutionList = ({ executionList, loading, pager, onRowsPerPageChange, onPageChange, onRefresh, onSeeDetails, onGotoDefinition }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const { page, pageSize, totalCount } = pager

  return (
    <IconCard
      icon={PlayCircleFilledIcon}
      title={t('Execution.Executions')}
      content={
        loading ? (
          <LoadingFakeText lines={10} />
        ) : (
          <>
            <Grid className={classes.enableScrollX}>
              <Table className={classes.table}>
                <Thead>
                  <Tr>
                    <Th className={classes.tableHeader}>{t('Execution.Name')}</Th>
                    <Th className={classes.tableHeader}>{t('Execution.Version')}</Th>
                    <Th className={classes.tableHeader}>{t('Execution.WorkflowId')}</Th>
                    <Th className={classes.tableHeader}>{t('Execution.Status')}</Th>
                    <Th className={classes.tableHeader}>{t('Execution.StartTime')}</Th>
                    <Th className={classes.tableHeader}>{t('Execution.EndTime')}</Th>
                    <Th className={classes.tableHeader} />
                  </Tr>
                </Thead>
                <Tbody>
                  {executionList?.map(execution => (
                    <ExecutionItem
                      key={execution?.workflowId}
                      onSeeDetails={onSeeDetails}
                      execution={execution}
                      onGotoDefinition={onGotoDefinition}
                    />
                  ))}
                </Tbody>
              </Table>
            </Grid>
            <Pagination
              totalCount={totalCount}
              pageSize={pageSize}
              page={page}
              onRowsPerPageChange={onRowsPerPageChange}
              onPageChange={onPageChange}
              onRefresh={onRefresh}
            />
          </>
        )
      }
    />
  )
}

ExecutionList.propTypes = {
  executionList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  pager: PropTypes.object.isRequired,
  onSeeDetails: PropTypes.func.isRequired,
  onGotoDefinition: PropTypes.func.isRequired
}

export default ExecutionList
