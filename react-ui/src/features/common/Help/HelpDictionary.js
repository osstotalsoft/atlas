import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@totalsoft/rocket-ui'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import styles from 'assets/jss/components/helperStyle'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(styles)

const HelpDictionary = ({ dictionaryItems, hasTranslations }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Box>
      {dictionaryItems?.map((it, index) => (
        <React.Fragment key={index}>
          <Typography variant='body2' className={classes.primaryText}>
            {hasTranslations ? t(it.term) : it.term}
          </Typography>
          {it.def && (
            <Typography variant='caption' className={classes.secondaryText}>
              {hasTranslations ? t(it.def) : it.def}
            </Typography>
          )}
        </React.Fragment>
      ))}
    </Box>
  )
}

HelpDictionary.propTypes = {
  hasTranslations: PropTypes.bool,
  dictionaryItems: PropTypes.arrayOf(
    PropTypes.shape({
      term: PropTypes.string.isRequired,
      def: PropTypes.string
    })
  ).isRequired
}

export default HelpDictionary
