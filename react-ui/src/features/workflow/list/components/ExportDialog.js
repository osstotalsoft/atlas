import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { TextField, Dialog, Button } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { makeStyles } from '@mui/styles'
import styles from '../styles/styles'

const useStyles = makeStyles(styles)

const ExportDialog = ({ open, data, onClose }) => {
  const { t } = useTranslation()
  const [namePrefix, setnamePrefix] = useState('')
  const classes = useStyles()

  const handleNameChange = useCallback(
    event => {
      setnamePrefix(event.target.value)
    },
    [setnamePrefix]
  )

  const handleOnClose = useCallback(
    event => {
      if (event.type === 'mouseup') return
      onClose()
    },
    [onClose]
  )

  const handleOnExport = useCallback(() => {
    const natsPrefix = data.match(/nats_stream:([A-Za-z.]+)ch\./)
    let templateData = data
    if (namePrefix) {
      templateData = templateData.replaceAll(namePrefix, '{{NamePrefix}}')
    }
    if (natsPrefix && natsPrefix[1]) {
      templateData = templateData.replaceAll(`${natsPrefix[1]}`, '{{NatsPrefix}}')
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
          </div>
        }
      />
    </>
  )
}

ExportDialog.propTypes = {
  data: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool
}

export default ExportDialog
