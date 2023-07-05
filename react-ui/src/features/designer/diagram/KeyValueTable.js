import React from 'react'
import { makeStyles } from '@mui/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { format, intervalToDuration } from 'date-fns'

const useStyles = makeStyles(_ => ({
  value: {
    flex: 0.7
  },
  label: {
    flex: 0.3,
    minWidth: '100px'
  },
  labelText: {
    fontWeight: 'bold !important'
  }
}))

export function timestampRenderer(date) {
  return !_.isNil(date) && format(new Date(date), 'yyyy-MM-dd HH:mm:ss') // could be string or number.
}

export function durationRenderer(durationMs) {
  const duration = intervalToDuration({ start: 0, end: durationMs })
  if (durationMs > 5000) {
    return `${duration.minutes}m${duration.seconds}s`
  } else {
    return `${durationMs}ms`
  }

  //return !isNaN(durationMs) && (durationMs > 0? formatDuration({seconds: durationMs/1000}): '0.0 seconds');
}

export default function KeyValueTable({ data }) {
  const classes = useStyles()
  return (
    <List>
      {data.map((item, index) => {
        let displayValue = item.value
        switch (item.type) {
          case 'date':
            displayValue = !isNaN(item.value) && item.value > 0 ? timestampRenderer(item.value) : 'N/A'
            break
          case 'duration':
            displayValue = !isNaN(item.value) && item.value > 0 ? durationRenderer(item.value) : 'N/A'
            break
          default:
            displayValue = !_.isNil(item.value) ? item.value : 'N/A'
        }
        return (
          <ListItem key={index} divider alignItems='flex-start'>
            <ListItemText className={classes.label} classes={{ primary: classes.labelText }} primary={item.label} />
            <ListItemText className={classes.value} primary={displayValue} />
          </ListItem>
        )
      })}
    </List>
  )
}

KeyValueTable.propTypes = {
  data: PropTypes.array
}
