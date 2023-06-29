import React from 'react'
import grey from '@mui/material/colors/grey'
import PropTypes from 'prop-types'
import { Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'

const styles = {
  wrapper: {
    width: '100%'
  },
  fake: {
    backgroundColor: grey[200],
    height: 10,
    margin: 20,
    '&:nth-child(2n)': {
      marginRight: '20%'
    }
  },
  fakeTextPaper: {
    padding: '10px'
  }
}

const useStyles = makeStyles(styles)

const LoadingFakeText = ({ lines = 4, onPaper = false, ...props }) => {
  const classes = useStyles()
  const fakeText = (
    <div className={classes.wrapper} {...props}>
      {[...Array(lines)].map((e, i) => (
        <div className={classes.fake} key={i}></div>
      ))}
    </div>
  )

  if (onPaper) {
    return <Paper className={classes.fakeTextPaper}>{fakeText}</Paper>
  }

  return fakeText
}

LoadingFakeText.propTypes = {
  /**
   * The number of lines appearing.
   */
  lines: PropTypes.number,
  /**
   * If true, the fake text will be drawn on a Paper.
   */
  onPaper: PropTypes.bool
}

export default LoadingFakeText
