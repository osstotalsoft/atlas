import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@totalsoft/rocket-ui'
import HighlightedText from './HighlightedText'

const HelpParagraph = ({ text, gutterBottom, highlight, highlightStyle }) => {
  return (
    <Typography variant='body2' paragraph={gutterBottom}>
      {highlight ? <HighlightedText text={text} highlight={highlight} highlightStyle={highlightStyle} /> : text}
    </Typography>
  )
}

HelpParagraph.defaultProps = {
  gutterBottom: false
}

HelpParagraph.propTypes = {
  text: PropTypes.string.isRequired,
  gutterBottom: PropTypes.bool,
  highlight: PropTypes.string,
  highlightStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOf(['bold', 'italic', 'yellow', 'red'])), PropTypes.string])
}

export default HelpParagraph
