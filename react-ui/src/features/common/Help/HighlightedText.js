import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import styles from 'assets/jss/components/helperStyle'
import { makeStyles } from '@mui/styles'
import cx from 'classnames'

const useStyles = makeStyles(styles)

const HighlightedText = ({ text, highlight, highlightStyle }) => {
  const classes = useStyles()

  const highlightClasses = Array.isArray(highlightStyle)
    ? highlightStyle.map(s =>
        cx({
          [classes[s]]: s
        })
      )
    : [
        cx({
          [classes[highlightStyle]]: highlightStyle
        })
      ]

  const keywordPosition = text ? text?.indexOf(highlight) : -1
  if (keywordPosition === -1) return <Typography>{text}</Typography>

  return (
    <Typography>
      {text.substring(0, keywordPosition)}
      <span className={highlightClasses.join(' ')}>{highlight}</span>
      {text.substring(keywordPosition + highlight?.length)}
    </Typography>
  )
}

HighlightedText.defaultProps = {
  highlightStyle: 'bold'
}

HighlightedText.propTypes = {
  text: PropTypes.string.isRequired,
  highlight: PropTypes.string,
  highlightStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOf(['bold', 'italic', 'yellow', 'red'])), PropTypes.string]),
  customClass: PropTypes.string
}

export default HighlightedText
