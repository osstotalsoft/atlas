import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import ReactTour from 'reactour'
import dragAndDropTask from 'assets/img/tour/dragAndDropTask.gif'
import connectNodes from 'assets/img/tour/connectNodes.gif'
import deleteLink from 'assets/img/tour/deleteLink.gif'
import boxSelection from 'assets/img/tour/boxSelection.gif'
import clickOnHelp from 'assets/img/tour/clickOnHelp.gif'
import generalSettings from 'assets/img/tour/generalSettings.PNG'
import workflowSettings from 'assets/img/tour/workflowSettingsDialog.PNG'
import styles from './styles'
import { makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(styles)

const Tour = ({ isOpen, onRequestClose }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const getBadgeContent = useCallback((curr, tot) => t('Designer.Tour.BadgeContent', { curr, tot }), [t])

  const steps = [
    {
      selector: '',
      content: t('Designer.Tour.Welcome')
    },
    {
      selector: '#SystemTasks',
      content: t('Designer.Tour.SystemTasks')
    },
    {
      selector: '[href="/tasks"]',
      content: t('Designer.Tour.DefineTask')
    },
    { selector: '#Tasks', content: t('Designer.Tour.Tasks') },
    {
      selector: '#Workflows',
      content: t('Designer.Tour.Workflows')
    },
    {
      selector: '.help',
      content: (
        <div>
          <div>{t('Designer.Tour.Help1')}</div>
          <div>{t('Designer.Tour.Help2')}</div>
          <img src={clickOnHelp} />
        </div>
      )
    },
    {
      selector: '#EVENT',
      content: (
        <div>
          <div>{t('Designer.Tour.Event')}</div>
          <img src={dragAndDropTask} />
        </div>
      )
    },
    {
      selector: '.srd-circle-node',
      content: (
        <div>
          <div>{t('Designer.Tour.StartNode')}</div>
          <div>{t('Designer.Tour.ConnectPort')}</div>
          <div>{t('Designer.Tour.LinkUnfocused')}</div>
          <img src={connectNodes} />
        </div>
      )
    },
    {
      selector: '.srd-circle-node',
      content: (
        <div>
          <div>{t('Designer.Tour.DeleteLink')}</div>
          <ul>
            <li>
              <b>SHIFT</b> + click
            </li>
            <li>
              <b>DELETE</b>
            </li>
          </ul>
          <img src={deleteLink} />
        </div>
      )
    },
    {
      selector: '[data-default-node-name="LAMBDA"]',
      content: (
        <div>
          <div>{t('Designer.Tour.TaskSettings')}</div>
          <img src={generalSettings} width='802' height='282' />
        </div>
      )
    },
    {
      selector: '',
      content: (
        <div>
          <div>{t('Designer.Tour.BoxSelection')}</div>
          <img src={boxSelection} />
        </div>
      )
    },
    {
      selector: '#utilities-bar',
      content: (
        <div>
          <div>{t('Designer.Tour.Utilities')}</div>
          <ul>
            <li>{t('Designer.UtilitiesBar.Undo')}</li>
            <li>{t('Designer.UtilitiesBar.Redo')}</li>
            <li>{t('Designer.UtilitiesBar.Import')}</li>
            <li>{t('Designer.UtilitiesBar.Export')}</li>
            <li>{t('Designer.UtilitiesBar.Delete')}</li>
            <li>{t('Designer.UtilitiesBar.Execute')}</li>
          </ul>
        </div>
      )
    },
    {
      selector: '#workflowSettings',
      content: (
        <div>
          <div>{t('Designer.Tour.WorkflowSettings')}</div>
          <img src={workflowSettings} width='602' height='120' />
        </div>
      )
    },
    {
      selector: '[aria-label="Save"]',
      content: t('Designer.Tour.Save')
    }
  ]

  return (
    <ReactTour
      steps={steps}
      isOpen={isOpen}
      disableInteraction
      onRequestClose={onRequestClose}
      badgeContent={getBadgeContent}
      className={classes.container}
    />
  )
}

Tour.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default Tour
