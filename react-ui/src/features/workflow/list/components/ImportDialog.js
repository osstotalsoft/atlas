import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CustomTextField, DialogDisplay, Button } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { makeStyles } from '@material-ui/core'
import styles from '../styles/styles'

const useStyles = makeStyles(styles)

const ImportDialog = ({ open, data, onClose, onImport }) => {
  const { t } = useTranslation()
  const [replace, setReplace] = useState({})
  const classes = useStyles()

  useEffect(() => {
    let toReplace = {}
    //const prefixRegex = /({{NatsPrefix}})/g
    //const natsPrefix = [...data.matchAll(prefixRegex)].map(a => a[1])[0]
    toReplace['{{NatsPrefix}}'] = ''
    const nameRegex = /({{NamePrefix}})/
    const namePrefix = data.match(nameRegex)
    if (namePrefix[0]) {
      toReplace[namePrefix[0]] = ''
    }

    const uriRegex = /(?<=")https?:\/\/[^"]+/g
    const urls = [...data.matchAll(uriRegex)].map(a => a[0])
    urls.forEach(url => (toReplace[url] = url))

    setReplace(toReplace)
  }, [data])

  const handleChange = useCallback(
    type => event => {
      setReplace(prev => ({ ...prev, [type]: event.target.value }))
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

  const handleOnImport = useCallback(() => {
    /*let tempData = data
    Object.keys(replace).forEach(key => {
      tempData = tempData.replaceAll(key, replace[key])
    })*/

    onImport(data, JSON.stringify(replace))
  }, [data, onImport, replace])

  return (
    <>
      <DialogDisplay
        fullWidth={true}
        maxWidth={'lg'}
        id='export'
        open={open}
        title={t('Import')}
        onClose={handleOnClose}
        actions={[
          <Button key='export' color='primary' size='sm' onClick={handleOnImport}>
            Import
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
                {Object.keys(replace).map((key, index) => (
                  <Tr key={index}>
                    <Td style={{ wordBreak: 'break-all' }} className={classes.tableContent}>
                      {key}
                    </Td>
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

ImportDialog.propTypes = {
  data: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onImport: PropTypes.func
}

export default ImportDialog
