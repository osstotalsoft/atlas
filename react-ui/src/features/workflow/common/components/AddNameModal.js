import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Grid } from '@material-ui/core'
import { CustomTextField } from '@bit/totalsoft_oss.react-mui.kit.core'
import { buildValidator } from '../validator'
import { useDirtyFieldValidation, isValid, getErrors } from '@totalsoft/pure-validations-react'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { WORKFLOW_LIST_QUERY } from '../../list/queries/WorkflowListQuery'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { isDirty } from '@totalsoft/change-tracking'
import { get, set } from '@totalsoft/rules-algebra-react'

const AddNameModal = ({ nameLens, versionLens, dirtyInfo }) => {
  const { t } = useTranslation()
  const { data } = useQueryWithErrorHandling(WORKFLOW_LIST_QUERY)
  const nameValidator = useMemo(() => buildValidator(data?.getWorkflowList), [data?.getWorkflowList])

  const [validation, validate] = useDirtyFieldValidation(nameValidator)

  useEffect(() => {
    if (isDirty(dirtyInfo)) {
      validate({ name: nameLens |> get, version: versionLens |> get })
    }
  }, [validate, dirtyInfo, nameLens, versionLens])

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={6}>
        <CustomTextField
          fullWidth
          label={t('Workflow.Name')}
          value={nameLens |> get || emptyString}
          onChange={nameLens |> set |> onTextBoxChange}
          debounceBy={100}
          error={!isValid(validation)}
          helperText={getErrors(validation)}
        />
      </Grid>
      <Grid item xs={6} sm={6}>
        <CustomTextField
          fullWidth
          isNumeric
          label={t('Workflow.Version')}
          value={versionLens |> get}
          onChange={versionLens |> set}
          error={!isValid(validation)}
          helperText={getErrors(validation)}
          inputProps={{
            decimalScale: 0,
            thousandSeparator: true,
            allowNegative: false
          }}
        />
      </Grid>
    </Grid>
  )
}

AddNameModal.propTypes = {
  nameLens: PropTypes.object.isRequired,
  versionLens: PropTypes.object.isRequired,
  dirtyInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
}

export default AddNameModal
