import React from 'react'
import { ERROR_LOG_QUERY } from '../queries/ErrorLogListQuery'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useRouteMatch } from 'react-router'
import { useTranslation } from 'react-i18next'
import ErrorLogItem from './ErrorLogItem'
import IconCard from '@bit/totalsoft_oss.react-mui.icon-card'
import { Info } from '@material-ui/icons'
import LoadingFakeText from '@bit/totalsoft_oss.react-mui.fake-text'

const ErrorLogContainer = () => {
  const match = useRouteMatch()
  const { t } = useTranslation()

  const { loading, data } = useQueryWithErrorHandling(ERROR_LOG_QUERY, {
    variables: {
      logId: match?.params?.id
    }
  })

  if (loading) return <LoadingFakeText lines={10} />

  return <IconCard icon={Info} title={t('Log.Log', { id: data?.log?.id })} content={<ErrorLogItem log={data?.log} />} />
}

export default ErrorLogContainer
