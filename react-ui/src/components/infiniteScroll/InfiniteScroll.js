import React from 'react'
import PropTypes from 'prop-types'
import styles from 'assets/jss/components/infiniteScrollStyle'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(styles)

const InfiniteScroll = ({ listItems }) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {listItems}
      <div className={classes.paddingBottom} />
    </div>
  )
}

InfiniteScroll.propTypes = {
  listItems: PropTypes.array
}

export default InfiniteScroll
