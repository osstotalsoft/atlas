import React from 'react'
import { useInView } from 'react-intersection-observer'
import PropTypes from 'prop-types'
import styles from 'assets/jss/components/infiniteScrollStyle'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(styles)

const VirtualScrollChild = ({ height, children }) => {
  const classes = useStyles()
  const [ref, inView] = useInView()

  return (
    <div style={{ height: `${height}px` }} className={classes.child} ref={ref}>
      {inView ? children : null}
    </div>
  )
}

VirtualScrollChild.propTypes = {
  height: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}

export default VirtualScrollChild
