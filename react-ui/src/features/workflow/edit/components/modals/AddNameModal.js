import React, { useCallback, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Grid, Box } from '@material-ui/core'
import { CustomTextField, Button } from '@bit/totalsoft_oss.react-mui.kit.core'
import { buildValidator } from '../../validator'
import { useDirtyFieldValidation, isValid, getErrors } from '@totalsoft/pure-validations-react'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { WORKFLOW_LIST_QUERY } from '../../../list/queries/WorkflowListQuery'
import { queryLimit } from 'features/common/constants'
import { set, get } from '@totalsoft/change-tracking-react'

const AddNameModal = ({ workflowLens, dirtyInfo, onCancel, onSave, saving }) => {
  const { t } = useTranslation()

  const workflow = workflowLens |> get

  const { data } = useQueryWithErrorHandling(WORKFLOW_LIST_QUERY, { variables: { limit: queryLimit } })
  const nameValidator = useMemo(() => buildValidator(data?.getAll), [data?.getAll])

  const [validation, validate] = useDirtyFieldValidation(nameValidator)

  const handleChange = useCallback(
    propPath => event => {
      set(workflowLens[propPath], event.target.value)
    },
    [workflowLens]
  )

  useEffect(() => {
    validate(workflow, dirtyInfo)
  }, [validate, workflow, dirtyInfo])

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} s={6}>
        <Grid item>
          <CustomTextField
            fullWidth
            label={t('Workflow.Name')}
            value={workflow?.name || emptyString}
            onChange={handleChange('name')}
            debounceBy={100}
            error={!isValid(validation)}
            helperText={getErrors(validation?.name)}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent='flex-end' alignItems='center' spacing={2}>
        <Box mb={1.5}>
          <Button color='primary' size='sm' onClick={onSave} disabled={saving || !isValid(validation)}>
            {saving ? t('General.Buttons.Saving') : t('General.Buttons.Save')}
          </Button>
        </Box>
        <Box mb={1.5}>
          <Button color='primary' size='sm' onClick={onCancel}>
            {t('General.Buttons.Cancel')}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

AddNameModal.propTypes = {
  workflowLens: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  dirtyInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
}

export default AddNameModal
