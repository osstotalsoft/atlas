import Editor from '@monaco-editor/react'
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Divider, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { get, set } from '@totalsoft/rules-algebra-react'
import { useTranslation } from 'react-i18next'
import Help from 'features/common/Help/Help'
import { IconButton } from '@totalsoft/rocket-ui'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import { lambdaHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import beautify from 'js-beautify'
import styles from '../../styles/styles'

const useStyles = makeStyles(styles)

const LambdaNodeInputParameters = ({ inputParametersLens }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const scriptExpression = inputParametersLens?.scriptExpression |> get

  const handleBeautify = useCallback(() => {
    set(inputParametersLens?.scriptExpression, beautify(scriptExpression))
  }, [inputParametersLens?.scriptExpression, scriptExpression])

  return (
    <>
      <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
      <Table className={classes.table} style={{ height: '100%', minHeight: '400px' }}>
        <Thead>
          <Tr>
            <Th className={classes.tableHeader}>
              <Grid container justifyContent='space-between'>
                <Grid item>
                  {t('WorkflowTask.InputParameter.ScriptExpression')}
                  <Help icon={<CustomHelpIcon />} helpConfig={lambdaHelpConfig.SCRIPT_EXPRESSION} hasTranslations={true} />
                </Grid>
                <Grid item>
                  <IconButton size='tiny' variant='text' color='secondary' tooltip={t('General.Buttons.Beautify')} onClick={handleBeautify}>
                    <LocalFloristIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Editor
                theme='vs-light'
                language='javascript'
                autoIndent={true}
                options={{
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  selectOnLineNumbers: true,
                  minimap: {
                    enabled: false
                  }
                }}
                width='100%'
                height='100%'
                value={scriptExpression}
                onChange={inputParametersLens.scriptExpression |> set}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  )
}

LambdaNodeInputParameters.propTypes = {
  inputParametersLens: PropTypes.object.isRequired
}

export default LambdaNodeInputParameters
