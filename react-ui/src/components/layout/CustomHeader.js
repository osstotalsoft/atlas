import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Grid, Box } from '@mui/material'
import { BackToButton, IconButton, Typography } from '@totalsoft/rocket-ui'
import HelpButton from '../../features/common/components/HelpButton'

const CustomHeader = ({ headerText, secondaryHeaderText, path, onSave, disableSaving, saving, onGetHelp }) => {
  const { t } = useTranslation()

  return (
    <Grid container justifyContent='flex-start' alignItems='center'>
      <Grid item xs={6} sm={9} lg={6} container justifyContent='flex-start'>
        <Box width='100%' display='flex' overflow='auto'>
          <Box>
            <Typography variant='subtitle1'>{headerText || emptyString}</Typography>
          </Box>
          <Box marginLeft='10px' alignSelf='center' whiteSpace='nowrap'>
            {secondaryHeaderText && <Typography variant='caption'>{`( ${secondaryHeaderText} )`}</Typography>}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3} lg={6} container justifyContent='flex-end' spacing={1}>
        <Grid item>{path && <BackToButton title={t('Tooltips.BackToList')} path={path} />}</Grid>
        <Grid item>{onGetHelp && <HelpButton onClick={onGetHelp} />}</Grid>
        <Grid item>
          {onSave && (
            <IconButton
              type='save'
              title={saving ? t('General.Saving') : t('General.Buttons.Save')}
              onClick={onSave}
              disabled={saving || disableSaving}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

CustomHeader.propTypes = {
  headerText: PropTypes.string,
  secondaryHeaderText: PropTypes.string,
  path: PropTypes.string,
  onSave: PropTypes.func,
  disableSaving: PropTypes.bool,
  saving: PropTypes.bool,
  onGetHelp: PropTypes.func
}
export default CustomHeader
