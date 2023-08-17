import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Dialog, Button } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { makeStyles } from '@mui/styles'
import styles from '../styles/styles'
import { WORKFLOW_EXPORT_QUERY } from '../queries/WorkflowListQuery'
import { useLazyQuery } from '@apollo/client'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import CompareDefinitionDialog from 'features/workflow/edit/components/workflowHistory/modals/CompareDefinitionDialog'

const useStyles = makeStyles(styles)

const ImportDialog = ({ open, data, onClose, onImport }) => {
  const { t } = useTranslation()
  const [replace, setReplace] = useState({})
  const [existingFlows, setExistingFlows] = useState({})
  const [importFlows, setImportFlows] = useState({})
  const [step, setStep] = useState(0)
  const [compareDialog, setCompareDialog] = useState(false)
  const [tenantCode, setTenantCode] = useState('')
  const [compare, setCompare] = useState({ current: {}, imported: {} })
  const classes = useStyles()

  const handleToggleCompare = useCallback(() => setCompareDialog(current => !current), [])

  const [getWorkflowsForExport] = useLazyQuery(WORKFLOW_EXPORT_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: result => {
      setExistingFlows(JSON.parse(result.exportWorkflows.data))
      setImportFlows(JSON.parse(data))
      setTenantCode(result.exportWorkflows.tenantCode)
    }
  })

  useEffect(() => {
    getWorkflowsForExport({ variables: { workflowList: [] } })
  }, [getWorkflowsForExport])
  useEffect(() => {
    let toReplace = {}
    toReplace['{{NatsPrefix}}'] = ''
    const nameRegex = /({{NamePrefix}})/
    const namePrefix = data.match(nameRegex)
    if (namePrefix && namePrefix[0]) {
      toReplace[namePrefix[0]] = tenantCode ? `${tenantCode}_` : ''
    }

    const uriRegex = /(?<=")https?:\/\/[^"]+/g
    const urls = [...data.matchAll(uriRegex)].map(a => a[0])
    urls.forEach(url => (toReplace[url] = url))

    setReplace(toReplace)
  }, [data, tenantCode])

  const handleChange = useCallback(
    (value, event) => {
      setReplace(prev => ({ ...prev, [event.target.id]: event.target.value }))
    },
    [setReplace]
  )

  const handleOnClose = useCallback(
    event => {
      if (event.type === 'mouseup') return
      onClose()
    },
    [onClose]
  )

  const onViewClick = useCallback(
    event => {
      const name = event.currentTarget.id
      const imported = importFlows.flows.find(a => a.name === name) ?? {}
      var imp = JSON.stringify(imported)
      Object.keys(replace).forEach(key => {
        imp = imp.replaceAll(key, replace[key])
      })
      const changedImported = JSON.parse(imp)

      const existing = existingFlows.flows.find(a => a.name.endsWith(name.replace('{{NamePrefix}}', '_'))) ?? {}
      setCompare({
        imported: { ...changedImported, createTime: undefined, updateTime: undefined, description: undefined },
        current: { ...existing, createTime: undefined, updateTime: undefined, description: undefined }
      })
      handleToggleCompare()
    },
    [handleToggleCompare, importFlows, existingFlows, replace]
  )

  const onViewHandlerClick = useCallback(
    event => {
      const name = event.currentTarget.id
      const imported = importFlows.handlers.find(a => a.name === name) ?? {}
      var imp = JSON.stringify(imported)
      Object.keys(replace).forEach(key => {
        imp = imp.replaceAll(key, replace[key])
      })
      const changedImported = JSON.parse(imp)

      const existing = existingFlows.handlers.find(a => a.name.endsWith(name.replace('{{NamePrefix}}', '_'))) ?? {}
      setCompare({
        imported: { ...changedImported, createTime: undefined, updateTime: undefined, description: undefined },
        current: { ...existing, createTime: undefined, updateTime: undefined, description: undefined }
      })
      handleToggleCompare()
    },
    [handleToggleCompare, importFlows, existingFlows, replace]
  )


  const handleOnNext = useCallback(() => {
    setStep(1)
  }, [setStep])

  const handleStepBack = useCallback(() => setStep(0), [setStep])

  const handleOnImport = useCallback(() => {
    onImport(data, JSON.stringify(replace))
  }, [data, onImport, replace])

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        id='export'
        open={open}
        title={t('Export.Import')}
        onClose={handleOnClose}
        actions={
          step === 1
            ? [
                <Button key='back' color='primary' size='small' onClick={handleStepBack}>
                  {t('Export.Back')}
                </Button>,
                <Button key='export' color='primary' size='small' onClick={handleOnImport}>
                  {t('Export.Import')}
                </Button>
              ]
            : [
                <Button key='export' color='primary' size='small' onClick={handleOnNext}>
                  {t('Export.Next')}
                </Button>
              ]
        }
        content={
          <div>
            {step === 1 && (
              <>

              {t('NavBar.Workflows')}
                <List>
                  {importFlows.flows.map((flow, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton id={flow.name} name={flow.name} onClick={onViewClick}>
                        <ListItemText primary={flow.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                {t('NavBar.EventHandlers')}
                <List>
                  {importFlows.handlers.map((handler, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton id={handler.name} name={handler.name} onClick={onViewHandlerClick}>
                        <ListItemText primary={handler.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <CompareDefinitionDialog
                  open={compareDialog}
                  onToggleDialog={handleToggleCompare}
                  definition={compare.current}
                  currentDefinition={compare.imported}
                />
              </>
            )}
            {step === 0 && (
              <Table className={classes.table}>
                <Thead>
                  <Tr>
                    <Th style={{ width: '50%' }} className={`${classes.tableHeader}`}>
                      {t('Export.Placeholder')}
                    </Th>
                    <Th className={`${classes.tableHeader}`}>{t('Export.Replacement')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(replace).map((key, index) => (
                    <Tr key={index}>
                      <Td style={{ wordBreak: 'break-all' }} className={classes.tableContent}>
                        {key}
                      </Td>
                      <Td className={classes.tableContent}>
                        <TextField
                          fullWidth
                          id={key}
                          name={key}
                          label={t('Export.Replacement')}
                          value={replace[key] ?? emptyString}
                          onChange={handleChange}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </div>
        }
      />
    </>
  )
}

ImportDialog.propTypes = {
  data: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onImport: PropTypes.func
}

export default ImportDialog
