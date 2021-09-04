import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import '../styles/classes.css'
import { Grid, makeStyles } from '@material-ui/core'
import trayItemStyles from '../styles/trayItemStyles'
import { emptyString } from 'utils/constants'
import Help from 'features/common/Help/Help'

const S = {
  Tray: styled.div`
    width: 300px;
    font-family: Helvetica, Arial;
    font-size: 18px;
    padding: 8px;
    margin: 3px 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    overflow-wrap: anywhere;
    background-color: white;
    color: #333;
    box-shadow: -2px 2px #26c6da, -1px 1px #26c6da, -1px 1px #26c6da;
    border: 1px solid #26c6da;
    border-radius: 5px;
    position: relative;
    transition: top ease 0.5s;
    &:hover {
      top: -3px;
    }
  `
}

const useStyles = makeStyles(trayItemStyles)

const TrayWidgetItem = ({ item }) => {
  const classes = useStyles()

  const handleOnDragStart = useCallback(
    event => {
      event.dataTransfer.setData('storm-diagram-node', JSON.stringify(item))
    },
    [item]
  )

  return (
    <S.Tray id={item.name} color={item?.color} draggable={true} onDragStart={handleOnDragStart}>
      <Grid container spacing={1} justifyContent={item.isSystemTask ? 'space-between' : 'flex-start'} alignItems='center'>
        <Grid item>
          <div className={classes[`${item.type}`]}>{item.isSystemTask ? item.name.substring(0, 1).toUpperCase() : emptyString}</div>
        </Grid>
        <Grid item>{item.name}</Grid>
        <Grid item>{item.helpConfig && <Help iconSize='small' helpConfig={item.helpConfig} hasTranslations={true} />}</Grid>
      </Grid>
    </S.Tray>
  )
}

TrayWidgetItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default TrayWidgetItem
