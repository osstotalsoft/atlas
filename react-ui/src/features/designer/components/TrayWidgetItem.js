import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import '../styles/classes.css'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import trayItemStyles from '../styles/trayItemStyles'
import Help from 'features/common/Help/Help'
import PresentationDiagramButton from 'features/common/components/PresentationDiagramButton'

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
    <S.Tray id={item?.name} color={item?.color} draggable={true} onDragStart={handleOnDragStart}>
      <Grid container spacing={2} justifyContent={'space-between'} alignItems='center'>
        <Grid item xs={2}>
          <div className={classes[`${item?.type}`]}>{item?.name.substring(0, 1).toUpperCase()}</div>
        </Grid>
        <Grid item xs={8}>
          {item?.name}
        </Grid>
        {item?.helpConfig && (
          <Grid item xs={2}>
            <Help iconSize='small' helpConfig={item?.helpConfig} hasTranslations={true} />
          </Grid>
        )}
        {item?.type === 'SUB_WORKFLOW' && (
          <Grid item xs={2}>
            <PresentationDiagramButton subworkflowName={item?.name} subworkflowVersion={item?.version} iconSize={'small'} />
          </Grid>
        )}
      </Grid>
    </S.Tray>
  )
}

TrayWidgetItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default TrayWidgetItem
