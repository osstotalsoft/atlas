import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { FakeText, Card, Pagination, IconButton } from '@totalsoft/rocket-ui'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import PublishIcon from '@mui/icons-material/Publish'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
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
  onCloneWorkflow,
  onExportButton,
  onImport
}) => {
  const [selected, setSelected] = useState([])
  const classes = useStyles()
  const { t } = useTranslation()
  const { page, pageSize, totalCount } = pager
  const currentPageWorkflows = workflowList.slice(page * pageSize, (page + 1) * pageSize)
  const handleRowsPerPageChange = useCallback(newPageSize => setPager({ ...defaultPager, pageSize: parseInt(newPageSize, 10) }), [setPager])

  const fileInputRef = useRef()

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

  const onHandleExportButton = useCallback(() => {
    onExportButton(selected)
  }, [onExportButton, selected])

  const onHandleImportButton = useCallback(() => {
    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }, [])

  const onSelect = useCallback(
    (name, checked) => {
      if (checked) {
        setSelected(prev => [...prev, name])
      } else {
        setSelected(prev => prev.filter(a => a !== name))
      }
    },
    [setSelected]
  )

  return (
    <Card
      icon={AccountTreeIcon}
      actions={[
        <IconButton key='addButton' type="add" color='secondary' title={t('Workflow.Buttons.AddWorkflow')} onClick={onAddWorkflow} />,
        <IconButton key='exportButton' color='secondary' title={t('Export.ExportButton')} onClick={onHandleExportButton}>
          <ImportExportIcon />
        </IconButton>,

        <IconButton key='importButton' color='secondary' title={t('Export.ImportButton')} onClick={onHandleImportButton}>
          <input ref={fileInputRef} accept='.json' style={{ display: 'none' }} type='file' onChange={onImport} />
          <PublishIcon />
        </IconButton>
      ]}
    >
      {loading ? (
        <FakeText lines={10} />
      ) : (
        <>
          <Grid className={classes.enableScrollX}>
            <Table className={classes.table}>
              <Thead>
                <Tr>
                  <Th className={`${classes.tableHeader}`}></Th>
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
                    onSelect={onSelect}
                    selected={selected}
                  />
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

WorkflowList.propTypes = {
  pager: PropTypes.object.isRequired,
  setPager: PropTypes.func.isRequired,
  workflowList: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onEditWorkflow: PropTypes.func.isRequired,
  onAddWorkflow: PropTypes.func.isRequired,
  onDeleteWorkflow: PropTypes.func.isRequired,
  onCloneWorkflow: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onExportButton: PropTypes.func,
  onImport: PropTypes.func
}

export default WorkflowList
