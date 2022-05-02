import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { LoadingFakeText, IconCard, CardTitle, AddButton, Pagination } from '@bit/totalsoft_oss.react-mui.kit.core'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import { makeStyles, Grid } from '@material-ui/core'
import styles from '../styles/styles'
import { useTranslation } from 'react-i18next'
import WorkflowItem from './WorkflowItem'
import { defaults } from 'apollo/defaultCacheData'
import { workflowsPager } from 'apollo/cacheKeyFunctions'

const defaultPager = defaults[workflowsPager]
const useStyles = makeStyles(styles)

const WorkflowList = ({
  pager,
  setPager,
  workflowList,
  loading,
  onRefresh,
  onEditWorkflow,
  onAddWorkflow,
  onDeleteWorkflow,
  onCloneWorkflow
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { page, pageSize, totalCount } = pager
  const currentPageWorkflows = workflowList.slice(page * pageSize, (page + 1) * pageSize)
  const handleRowsPerPageChange = useCallback(newPageSize => setPager({ ...defaultPager, pageSize: parseInt(newPageSize, 10) }), [setPager])

  useEffect(() => {
    if (workflowList && totalCount !== workflowList.length)
      setPager(currentPager => ({ ...currentPager, totalCount: workflowList?.length }))
  }, [workflowList, totalCount, setPager])

  const handlePageChange = useCallback(
    newPage => {
      setPager(currentPager => ({ ...currentPager, page: newPage }))
    },
    [setPager]
  )

  return (
    <IconCard
      icon={AccountTreeIcon}
      title={
        <CardTitle
          title={t('Workflow.Name')}
          actions={[<AddButton key='addButton' color={'theme'} title={t('Workflow.Buttons.AddWorkflow')} onClick={onAddWorkflow} />]}
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
                    <Th className={`${classes.tableHeader} ${classes.executeColumn}`}>{t('Workflow.Buttons.Execute')}</Th>
                    <Th className={classes.tableHeader}>{t('Workflow.Name')}</Th>
                    <Th className={classes.tableHeader}>{t('Workflow.Version')}</Th>
                    <Th className={classes.tableHeader}>{t('Workflow.Description')}</Th>
                    <Th className={classes.tableHeader}>{t('Workflow.CreatedBy')}</Th>
                    <Th className={classes.tableHeader}>{t('Workflow.UpdatedBy')}</Th>
                    <Th className={classes.tableHeader} />
                  </Tr>
                </Thead>
                <Tbody>
                  {currentPageWorkflows?.map(workflow => (
                    <WorkflowItem
                      key={workflow?.name + workflow?.version}
                      workflow={workflow}
                      onEditWorkflow={onEditWorkflow}
                      onDeleteWorkflow={onDeleteWorkflow}
                      onCloneWorkflow={onCloneWorkflow}
                    />
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

WorkflowList.propTypes = {
  pager: PropTypes.object.isRequired,
  setPager: PropTypes.func.isRequired,
  workflowList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onEditWorkflow: PropTypes.func.isRequired,
  onAddWorkflow: PropTypes.func.isRequired,
  onDeleteWorkflow: PropTypes.func.isRequired,
  onCloneWorkflow: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
}

export default WorkflowList
