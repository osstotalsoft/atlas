import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import HighlightedText from './HighlightedText'

const HelpTitle = ({ text, gutterBottom, highlight, highlightStyle }) => {
  return (
    <Typography variant='subtitle1' gutterBottom={gutterBottom}>
      {highlight ? <HighlightedText text={text} highlight={highlight} highlightStyle={highlightStyle} /> : text}
    </Typography>
  )
}

HelpTitle.defaultProps = {
  gutterBottom: true
}

HelpTitle.propTypes = {
  text: PropTypes.string.isRequired,
  gutterBottom: PropTypes.bool,
  highlight: PropTypes.string,
  highlightStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOf(['bold', 'italic', 'yellow', 'red'])), PropTypes.string])
}

export default HelpTitle
