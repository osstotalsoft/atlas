import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Paper } from '@material-ui/core'
import ReactJson from 'react-json-view'
import omitDeep from 'omit-deep-lodash'
import { removeEmpty } from 'utils/functions'

const ExecutionJSON = ({ workflow }) => {
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

  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper>
          <ReactJson
            src={localWf |> removeEmpty |> deepFormatDates}
            name={false}
            displayDataTypes={false}
            enableClipboard={false}
            style={{ wordBreak: 'break-word' }}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

ExecutionJSON.propTypes = {
  workflow: PropTypes.object.isRequired
}

export default ExecutionJSON
