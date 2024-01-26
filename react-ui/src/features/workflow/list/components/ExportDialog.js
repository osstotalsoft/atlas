import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TextField, Dialog, Button, Typography } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { makeStyles } from '@mui/styles'
import styles from '../styles/styles'

const useStyles = makeStyles(styles)

const ExportDialog = ({ open, data, onClose, tenantCode }) => {
  const { t } = useTranslation()
  const [namePrefix, setNamePrefix] = useState(tenantCode ? tenantCode + '_' : '')
  const [errors, setErrors] = useState([])
  const classes = useStyles()

  useEffect(() => {
    setErrors(
      JSON.parse(data).flows.filter(flow => flow.tasks.some(a => a.asyncComplete === true && !a.description?.includes('asyncHandler')))
    )
  }, [data])

  const handleNameChange = useCallback(
    value => {
      setNamePrefix(value)
    },
    [setNamePrefix]
  )

  const handleOnClose = useCallback(
    event => {
      if (event.type === 'mouseup') return
      onClose()
    },
    [onClose]
  )

  const handleOnExport = useCallback(() => {
    const natsPrefix = data.match(/nats_stream:([A-Za-z.]{0,100})ch\./)
    let templateData = data
    const dataObj = JSON.parse(data)
    dataObj.flows.forEach(element => {
      const newName = element.name.replace(namePrefix, '{{NamePrefix}}')
      templateData = templateData.replaceAll(element.name, newName)

      const subflows = [...data.matchAll(/subWorkflowParam":{"name":"([a-zA-Z0-9_-]*)"/g)]
      subflows.forEach(subflow => {
        const newName = subflow[1].replace(namePrefix, '{{NamePrefix}}')
        templateData = templateData.replaceAll(subflow[1], newName)
      })
    })

    dataObj.handlers.forEach(element => {
      const newName = element.name.replace(namePrefix, '{{NamePrefix}}')
      templateData = templateData.replaceAll(element.name, newName)
    })
    /*if (namePrefix) {
      templateData = templateData.replaceAll(namePrefix, '{{NamePrefix}}')
    }*/
    if (natsPrefix) {
      if (natsPrefix[0]) {
        templateData = templateData.replaceAll(`${natsPrefix[0]}`, 'nats_stream:{{NatsPrefix}}ch.')
      }
    }

    const blob = new Blob([templateData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'flows.json'
    link.href = url
    link.click()
  }, [namePrefix, data])

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        id='export'
        open={open}
        title={t('Export.Export')}
        onClose={handleOnClose}
        actions={[
          <Button key='export' color='primary' size='small' onClick={handleOnExport}>
            {t('Export.Download')}
          </Button>
        ]}
        content={
          <div>
            <Table className={classes.table}>
              <Thead>
                <Tr>
                  <Th style={{ width: '50%' }} className={`${classes.tableHeader}`}>
                    {t('Export.Value')}
                  </Th>
                  <Th className={`${classes.tableHeader}`}>{t('Export.Replacement')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className={classes.tableContent}>{t('Export.NamePrefix')}</Td>
                  <Td className={classes.tableContent}>
                    <TextField fullWidth label={t('Export.Replacement')} value={namePrefix ?? emptyString} onChange={handleNameChange} />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
            <Typography variant='subtitle1' align='center'>
              {t('Export.MissingAsyncHandlers')}
            </Typography>
            <List style={{ color: 'orange' }}>
              <ListItem key='head'>
                <ListItemText style={{ color: 'black' }}>{t('Export.WorkflowName')}</ListItemText>
                <List>
                  <ListItem key='subhead'>
                    <ListItemText style={{ color: 'black', textAlign: 'right' }}>{t('Export.TaskReferenceName')}</ListItemText>
                  </ListItem>
                </List>
              </ListItem>
              <Divider key='divider' />
              {errors.map((flow, index) => (
                <div key={index}>
                  <ListItem key={index}>
                    <ListItemText>{flow.name}</ListItemText>
                    <List>
                      {flow.tasks
                        .filter(a => a.asyncComplete === true && !a.description?.includes('asyncHandler'))
                        .map((task, index) => (
                          <ListItem key={index}>
                            <ListItemText style={{ textAlign: 'right' }}>{task.taskReferenceName}</ListItemText>
                          </ListItem>
                        ))}
                    </List>
                  </ListItem>
                  <Divider key={`divider_${index}`} />
                </div>
              ))}
            </List>
          </div>
        }
      />
    </>
  )
}

ExportDialog.propTypes = {
  data: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  tenantCode: PropTypes.string
}

export default ExportDialog
