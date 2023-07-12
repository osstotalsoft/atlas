import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@totalsoft/rocket-ui'

const HelpHyperlink = ({ text, keyword, link }) => {
  const keywordPosition = text ? text?.search(keyword) : -1

  if (keywordPosition === -1) return <Typography>{text}</Typography>

  return (
    <Typography>
      {text.substring(0, keywordPosition)}
      <a href={link} target='_blank' rel='noreferrer noopener'>
        {keyword}
      </a>
      {text.substring(keywordPosition + keyword?.length)}
    </Typography>
  )
}

HelpHyperlink.propTypes = {
  text: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
}

export default HelpHyperlink
