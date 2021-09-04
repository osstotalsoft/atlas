import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import DeleteButton from '@bit/totalsoft_oss.react-mui.delete-button'
import { get, set } from '@totalsoft/rules-algebra-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { useTranslation } from 'react-i18next'

function InputParameterItem({ valueLens, param, onRemove }) {
  const { t } = useTranslation()

  return (
    <Grid item container xs={12} md={6} spacing={2}>
      <Grid item xs={10}>
        <CustomTextField
          fullWidth
          label={param}
          value={valueLens |> get}
          onChange={valueLens |> set |> onTextBoxChange}
          debounceBy={100}
          variant='outlined'
        />
      </Grid>
      <Grid item xs={2}>
        <DeleteButton key='addButton' color={'themeNoBackground'} title={t('General.Buttons.Delete')} onClick={onRemove} />
      </Grid>
    </Grid>
  )
}

InputParameterItem.propTypes = {
  valueLens: PropTypes.object.isRequired,
  param: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default InputParameterItem
