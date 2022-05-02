import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid, Paper } from '@material-ui/core'
import ReactJson from 'react-json-view'
import omitDeep from 'omit-deep-lodash'
import { removeEmpty } from 'utils/functions'

const JsonViewer = ({ workflow }) => {
  const localWf = { ...omitDeep(workflow, ['__typename']) }

  const deepFormatDates = theObject => {
    for (var prop in theObject) {
      if (prop.endsWith('Time')) {
        const date = new Date(theObject[prop])
        theObject[prop] = date.toLocaleString('en-GB', { timeZone: 'UTC' })
      }
      if (theObject[prop] instanceof Object || theObject[prop] instanceof Array) deepFormatDates(theObject[prop])
    }
    return theObject
  }

  const handleCopy = useCallback(copy => {
    navigator.clipboard.writeText(JSON.stringify(copy.src, null, '\t'))
  }, [])

  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper>
          <ReactJson
            src={localWf |> removeEmpty |> deepFormatDates}
            name={false}
            displayDataTypes={false}
            enableClipboard={handleCopy}
            style={{ wordBreak: 'break-word' }}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

JsonViewer.propTypes = {
  workflow: PropTypes.object.isRequired
}

export default JsonViewer
