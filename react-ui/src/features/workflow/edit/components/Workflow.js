import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import LoadingFakeText from '@bit/totalsoft_oss.react-mui.fake-text'
import BodyWidget from 'features/designer/components/BodyWidget'
import UtilitiesBar from 'features/designer/components/UtilitiesBar'
import TrayWidgetList from 'features/designer/components/TrayWidgetList'
import { WORKFLOW_LIST_QUERY } from 'features/workflow/list/queries/WorkflowListQuery'
import { TASK_LIST_QUERY } from 'features/task/list/queries/TaskListQuery'
import { queryLimit } from 'features/common/constants'
import { tasksConfig } from '../../../designer/constants/TasksConfig'
import systemTasks from '../../../designer/constants/TrayConfig'
import { useLazyQuery } from '@apollo/client'
import { nodeConfig } from '../../../designer/constants/NodeConfig'
import ExecuteWorkflowModal from 'features/workflow/modals/ExecuteWorkflowModal'
import GeneralSettingsDialog from './modals/GeneralSettingsDialog'
import { emptyObject } from 'utils/constants'
import { useStateLens } from '@totalsoft/react-state-lens'
import { useTranslation } from 'react-i18next'
import { cloneSelection } from 'features/workflow/common/functions'
import { get, set } from '@totalsoft/change-tracking-react'
import { emptyString } from 'utils/constants'
import { getFileContents } from 'utils/functions'
import { useError } from 'hooks/errorHandling'
import { parseDiagramToJSON } from 'features/designer/builderHandler'
import { saveAs } from 'file-saver'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { drawDiagram } from 'features/designer/drawingHandler'
import { omit } from 'ramda'

const Workflow = ({ loading, isNew, resetWorkflow, isDirty, workflowLens, engine, setIsDirty }) => {
  const { t } = useTranslation()
  const showError = useError()

  const { oidcUser } = useReactOidc()

  const [activeTask, setActiveTask] = useState(tasksConfig.SYSTEM_TASKS)
  const [trayItems, setTrayItems] = useState()
  const [initialSettings, setInitialSettings] = useState()

  const [execDialog, setExecDialog] = useState(false)
  const [settingsDialog, setSettingsDialog] = useState(false)

  const inputLens = useStateLens(emptyObject)
  const workflow = workflowLens |> get

  const [runWfQuery, { called: wfCalled, loading: loadingWf, data: wfData }] = useLazyQuery(WORKFLOW_LIST_QUERY, {
    variables: { limit: queryLimit }
  })
  const [runTskQuery, { called: tskCalled, loading: loadingTsk, data: tskData }] = useLazyQuery(TASK_LIST_QUERY, {
    variables: { limit: queryLimit }
  })

  useEffect(() => {
    switch (activeTask) {
      case tasksConfig.SYSTEM_TASKS:
        setTrayItems(systemTasks)
        break
      case tasksConfig.WORKFLOWS:
        {
          if (!wfCalled) runWfQuery()
          if (wfCalled && loadingWf) return <LoadingFakeText lines={3} />
          const wflList = wfData?.getAll
          const trayList = wflList?.map(wfl => ({
            type: nodeConfig.SUB_WORKFLOW.type,
            name: wfl.name,
            color: nodeConfig.SUB_WORKFLOW.color,
            isSystemTask: false,
            workflow: wfl
          }))
          setTrayItems(trayList)
        }
        break
      case tasksConfig.TASKS: {
        if (!tskCalled) runTskQuery()
        if (tskCalled && loadingTsk) return <LoadingFakeText lines={3} />
        const tskList = tskData?.getTaskDefs
        const trayList = tskList?.map(wfl => ({
          type: nodeConfig.TASK.type,
          name: wfl.name,
          color: nodeConfig.TASK.color,
          isSystemTask: false,
          workflow: wfl
        }))
        setTrayItems(trayList)
        break
      }
      default:
        break
    }
  }, [activeTask, loadingTsk, loadingWf, runTskQuery, runWfQuery, tskCalled, tskData?.getTaskDefs, wfCalled, wfData?.getAll])

  const toggleExecDialog = useCallback(() => {
    setExecDialog(current => !current)
  }, [])

  const toggleSettingsDialog = useCallback(() => {
    setSettingsDialog(current => !current)
  }, [])

  const handleDelete = useCallback(() => {
    const selectedEntities = engine.getModel().getSelectedEntities()
    if (selectedEntities.length > 0) {
      const confirm = window.confirm(t('Designer.DeleteConfirmation'))

      if (confirm) {
        selectedEntities.map(model => model.remove())
        engine.repaintCanvas()
      }
    }
  }, [engine, t])

  const handleClone = useCallback(() => {
    cloneSelection(engine, engine.model.getSelectedEntities())
  }, [engine])

  const handleShowSettings = useCallback(() => {
    setInitialSettings(workflow)
    toggleSettingsDialog()
  }, [toggleSettingsDialog, workflow])

  const handleCancelSettings = useCallback(() => {
    toggleSettingsDialog()
    set(workflowLens, initialSettings)
  }, [initialSettings, toggleSettingsDialog, workflowLens])

  const handleImport = useCallback(
    async file => {
      try {
        const content = await getFileContents(file)
        const wf = JSON.parse(content) |> omit(['name', 'createdBy', 'updatedBy'])
        drawDiagram(wf, engine)

        resetWorkflow({ ...wf, createdBy: oidcUser.profile.name, ownerEmail: oidcUser.profile.preferred_username })
      } catch (err) {
        showError(err)
      }
    },
    [engine, oidcUser.profile.name, oidcUser.profile.preferred_username, resetWorkflow, showError]
  )

  const handleExport = useCallback(() => {
    try {
      const jsonObject = parseDiagramToJSON(engine)
      const { name, description, timeoutSeconds, workflowStatusListenerEnabled, createdBy } = workflow
      const finalObject = { ...jsonObject, name, description, timeoutSeconds, workflowStatusListenerEnabled, createdBy }
      const fileContent = JSON.stringify(finalObject, null, 2)
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
      const fileName = workflow?.name ? `${workflow?.name}` : 'data'
      saveAs(blob, `${fileName}.json`)
    } catch (err) {
      showError(err)
    }
  }, [engine, showError, workflow])

  if (loading) {
    return <LoadingFakeText lines={3} />
  }

  return (
    <>
      <UtilitiesBar
        isNew={isNew}
        isDirty={isDirty}
        onImport={handleImport}
        onExport={handleExport}
        onExecute={toggleExecDialog}
        onShowSettings={handleShowSettings}
        onClone={handleClone}
        onDelete={handleDelete}
      />
      <TrayWidgetList trayItems={trayItems} activeTask={activeTask} setActiveTask={setActiveTask} />
      <BodyWidget workflow={workflow} engine={engine} setIsDirty={setIsDirty} />
      <ExecuteWorkflowModal
        open={execDialog}
        toggleExecDialog={toggleExecDialog}
        name={workflow?.name || emptyString}
        inputLens={inputLens}
      />
      <GeneralSettingsDialog
        open={settingsDialog}
        onClose={handleCancelSettings}
        onYes={toggleSettingsDialog}
        workflowLens={workflowLens}
      />
    </>
  )
}

Workflow.propTypes = {
  loading: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  resetWorkflow: PropTypes.func.isRequired,
  isNew: PropTypes.bool.isRequired,
  engine: PropTypes.object.isRequired,
  workflowLens: PropTypes.object.isRequired,
  setIsDirty: PropTypes.func.isRequired
}

export default Workflow
