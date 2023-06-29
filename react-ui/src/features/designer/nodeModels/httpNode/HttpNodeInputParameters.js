import React, { useCallback } from 'react'
import { Grid, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { get, set } from '@totalsoft/rules-algebra-react'
import { useTranslation } from 'react-i18next'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import HttpNodeHeaderList from './HttpNodeHeaderList'
import HttpNodeBody from './HttpNodeBody'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { commonTaskDefHelpConfig, httpHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'
import Help from 'features/common/Help/Help'

const HttpNodeInputParameters = ({ httpRequestLens }) => {
  const { t } = useTranslation()

  const handleToggleChange = useCallback(
    value => {
      set(httpRequestLens?.asyncComplete, value)
    },
    [httpRequestLens?.asyncComplete]
  )

  return (
    <Grid item container xs={12} spacing={2}>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.Uri')}
            value={httpRequestLens?.uri |> get}
            onChange={httpRequestLens.uri |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.URI} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.Method')}
            value={httpRequestLens?.method |> get}
            onChange={httpRequestLens.method |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.METHOD} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.Accept')}
            value={httpRequestLens?.accept |> get}
            onChange={httpRequestLens.accept |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.ACCEPT} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.ContentType')}
            value={httpRequestLens?.contentType |> get}
            onChange={httpRequestLens.contentType |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.CONTENT_TYPE} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.VipAddress')}
            value={httpRequestLens?.vipAddress |> get}
            onChange={httpRequestLens.vipAddress |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.VIP_ADDRESS} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center'>
        <Grid item xs={4} container justifyContent='space-between'>
          <Typography component='div'>{t('WorkflowTask.Http.AsyncComplete')}</Typography>
        </Grid>
        <Grid item xs={7}>
          <SwitchWithInternalState
            checked={httpRequestLens?.asyncComplete |> get}
            onChange={handleToggleChange}
            labelOff={t('General.Buttons.False')}
            labelOn={t('General.Buttons.True')}
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={commonTaskDefHelpConfig.ASYNC_COMPLETE} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.OauthConsumerKey')}
            value={httpRequestLens?.oauthConsumerKey |> get}
            onChange={httpRequestLens.oauthConsumerKey |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.CONSUMER_KEY} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.OauthConsumerSecret')}
            value={httpRequestLens?.oauthConsumerSecret |> get}
            onChange={httpRequestLens.oauthConsumerSecret |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.CONSUMER_SECRET} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.ConnectionTimeOut')}
            isNumeric
            value={httpRequestLens?.connectionTimeOut |> get}
            onChange={httpRequestLens.connectionTimeOut |> set}
            debounceBy={100}
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.CONNECTION_TIMEOUT} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Http.ReadTimeOut')}
            isNumeric
            value={httpRequestLens?.readTimeOut |> get}
            onChange={httpRequestLens.readTimeOut |> set}
            debounceBy={100}
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.READ_TIMEOUT} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='flex-start' spacing={1}>
        <Grid item xs={11}>
          <HttpNodeHeaderList httpRequestLens={httpRequestLens} />
        </Grid>
        <Grid item xs={1} style={{ marginTop: '12px' }}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.HEADERS} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} container alignItems='flex-start' spacing={1}>
        <Grid item xs={11}>
          <HttpNodeBody httpRequestLens={httpRequestLens} />
        </Grid>
        <Grid item xs={1} style={{ marginTop: '12px' }}>
          <Help icon={<CustomHelpIcon />} helpConfig={httpHelpConfig.BODY} hasTranslations={true} />
        </Grid>
      </Grid>
    </Grid>
  )
}

HttpNodeInputParameters.propTypes = {
  httpRequestLens: PropTypes.object.isRequired
}

export default HttpNodeInputParameters
