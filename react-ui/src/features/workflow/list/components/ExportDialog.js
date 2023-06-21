import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CustomTextField, DialogDisplay, Button } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { makeStyles, Typography } from '@material-ui/core'
import styles from '../styles/styles'

const useStyles = makeStyles(styles)

const ExportDialog = ({ open, data, onClose }) => {
  const { t } = useTranslation()
  const [namePrefix, setnamePrefix] = useState('')
  const [replace, setReplace] = useState({})
  const classes = useStyles()

  useEffect(() => {
    let toReplace = {}
    const prefixRegex = /.*nats_stream:([a-zA-Z_.]*)\.ch\..*/g
    const natsPrefix = [...data.matchAll(prefixRegex)].map(a => a[1])[0]

    toReplace[natsPrefix] = ''
    /*const uriRegex = /(?<=")https?:\/\/[^"]+/g
    const urls = [...data.matchAll(uriRegex)].map(a => a[0])
    urls.forEach(url => (toReplace[url] = ''))
*/
    setReplace(toReplace)
  }, [data])

  const handleChange = useCallback(
    type => event => {
      setReplace(prev => ({ ...prev, [type]: event.target.value }))
    },
    [setReplace]
  )

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
    const prefixRegex = /.*nats_stream:([a-zA-Z_.]*)\.ch\..*/g
    const natsPrefix = [...data.matchAll(prefixRegex)].map(a => a[1])[0]

    let templateData = data
    if (namePrefix) {
      templateData = templateData.replaceAll(namePrefix, '{{NamePrefix}}')
    }
    if (natsPrefix) {
      templateData = templateData.replaceAll(`${natsPrefix}.`, '{{NatsPrefix}}')
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
      <DialogDisplay
        fullWidth={true}
        maxWidth={'lg'}
        id='export'
        open={open}
        title={
          <>
            <Typography variant='h6'>{t('Export')}</Typography>
          </>
        }
        onClose={handleOnClose}
        actions={[
          <Button key='export' color='primary' size='sm' onClick={handleOnExport}>
            Export
          </Button>
        ]}
        content={
          <div>
            <Table className={classes.table}>
              <Thead>
                <Tr>
                  <Th style={{ width: '50%' }} className={`${classes.tableHeader}`}>
                    Value
                  </Th>
                  <Th className={`${classes.tableHeader}`}>Replacement</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className={classes.tableContent}>Name Prefix</Td>
                  <Td className={classes.tableContent}>
                    <CustomTextField fullWidth label={t('replacement')} value={namePrefix ?? emptyString} onChange={handleNameChange} />
                  </Td>
                </Tr>
                {Object.keys(replace).map((key, index) => (
                  <Tr key={index}>
                    <Td className={classes.tableContent}>{key}</Td>
                    <Td className={classes.tableContent}>
                      <CustomTextField
                        fullWidth
                        label={t('replacement')}
                        value={replace[key] ?? emptyString}
                        onChange={handleChange(key)}
                      />
                    </Td>
                  </Tr>
                ))}
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
