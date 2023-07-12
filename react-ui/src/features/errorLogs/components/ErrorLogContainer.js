import React from 'react'
import { ERROR_LOG_QUERY } from '../queries/ErrorLogListQuery'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useResolvedPath } from 'react-router'
import { useTranslation } from 'react-i18next'
import ErrorLogItem from './ErrorLogItem'
import { Card, FakeText } from '@totalsoft/rocket-ui'
import { Info } from '@mui/icons-material'

const ErrorLogContainer = () => {
  const match = useResolvedPath("").pathname;
  const { t } = useTranslation()

  const { loading, data } = useQueryWithErrorHandling(ERROR_LOG_QUERY, {
    variables: {
      logId: match?.params?.id
    }
  })

  if (loading) return <FakeText lines={10} />

  return <Card icon={Info} title={t('Log.Log', { id: data?.log?.id })} content={<ErrorLogItem log={data?.log} />} />
}

export default ErrorLogContainer
