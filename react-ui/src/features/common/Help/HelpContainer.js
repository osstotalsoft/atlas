import React from 'react'
import PropTypes from 'prop-types'
import HelpTitle from './HelpTitle'
import HelpParagraph from './HelpParagraph'
import HelpImportant from './HelpImportant'
import HelpDictionary from './HelpDictionary'
import HelpTable from './HelpTable'
import HelpHyperlink from './HelpHyperlink'
import { Box, Divider, makeStyles } from '@material-ui/core'
import styles from 'assets/jss/components/helperStyle'
import { emptyString } from 'utils/constants'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(styles)

const HelpContainer = ({ helpConfig, hasTranslations }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Box>
      {helpConfig.map((it, index) => {
        const { gutterBottom, highlightStyle, link, dictionaryItems, columns, rows, disableMargin, element } = it
        const text = hasTranslations ? t(it.text) : it.text
        const keyword = hasTranslations ? t(it.keyword) : it.keyword
        const highlight = hasTranslations ? t(it.highlight) : it.highlight

        switch (it.type) {
          case 'title':
            return <HelpTitle key={index} text={text} gutterBottom={gutterBottom} highlight={highlight} highlightStyle={highlightStyle} />
          case 'paragraph':
            return (
              <HelpParagraph key={index} text={text} gutterBottom={gutterBottom} highlight={highlight} highlightStyle={highlightStyle} />
            )
          case 'hyperlink':
            return <HelpHyperlink key={index} text={text} keyword={keyword} link={link} gutterBottom={gutterBottom} />
          case 'node':
            return element
          case 'important':
            return <HelpImportant key={index} text={text} gutterBottom={gutterBottom} />
          case 'dictionary':
            return <HelpDictionary key={index} dictionaryItems={dictionaryItems} hasTranslations={hasTranslations} />
          case 'table':
            return <HelpTable key={index} columns={columns} rows={rows} hasTranslations={hasTranslations} />
          case 'divider':
            return <Divider key={index} light className={disableMargin ? emptyString : classes.marginBottom} />
          default:
            return null
        }
      })}
    </Box>
  )
}

HelpContainer.propTypes = {
  hasTranslations: PropTypes.bool,
  helpConfig: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['title', 'paragraph', 'hyperlink', 'important', 'node', 'dictionary', 'table', 'divider']).isRequired,
      text: PropTypes.string,
      highlight: PropTypes.string,
      highlightStyle: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOf(['bold', 'italic', 'yellow', 'red'])), PropTypes.string]),
      gutterBottom: PropTypes.bool,
      disableMargin: PropTypes.bool,
      element: PropTypes.node,
      dictionaryItems: PropTypes.arrayOf(
        PropTypes.shape({
          term: PropTypes.string.isRequired,
          def: PropTypes.string
        })
      ),
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          field: PropTypes.string.isRequired,
          headerName: PropTypes.string.isRequired
        })
      ),
      rows: PropTypes.arrayOf(PropTypes.object)
    })
  ).isRequired
}

export default HelpContainer
