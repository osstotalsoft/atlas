import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FakeText } from '@totalsoft/rocket-ui'
import BodyWidget from 'features/designer/components/BodyWidget'
import UtilitiesBar from 'features/designer/components/UtilitiesBar'
import TrayWidgetList from 'features/designer/components/TrayWidgetList'
import { WORKFLOW_LIST_QUERY } from 'features/workflow/list/queries/WorkflowListQuery'
import { TASK_LIST_QUERY } from 'features/task/list/queries/TaskListQuery'
import { tasksConfig } from '../../../designer/constants/TasksConfig'
import systemTasks from '../../../designer/constants/TrayConfig'
import { useLazyQuery } from '@apollo/client'
import { nodeConfig } from '../../../designer/constants/NodeConfig'
import ExecuteWorkflowModal from 'features/workflow/common/components/ExecuteWorkflowModal'
import GeneralSettingsDialog from './modals/GeneralSettingsDialog'
import { emptyObject } from 'utils/constants'
import { useTranslation } from 'react-i18next'
import { get, set } from '@totalsoft/change-tracking-react'
import { emptyString } from 'utils/constants'
import { getFileContents } from 'utils/functions'
import { useClientQueryWithErrorHandling, useError } from 'hooks/errorHandling'
import { parseDiagramToJSON } from 'features/designer/builderHandler'
import { saveAs } from 'file-saver'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { drawDiagram } from 'features/designer/drawingHandler'
import { omit } from 'ramda'
import SideMenu from './sideMenu/SideMenu'
import PreviewJsonDialog from './modals/PreviewJsonDialog'
import { defaultFileName } from 'features/workflow/common/constants'
import workflowConfig from 'features/designer/constants/WorkflowConfig'
import { useToast } from '@totalsoft/rocket-ui'

const Workflow = ({ loading, isNew, resetWorkflow, isDirty, workflowLens, diagram, setIsDirty }) => {
  const { t } = useTranslation()
  const showError = useError()
  const addToast = useToast()

  const { oidcUser } = useReactOidc()
  const clientQuery = useClientQueryWithErrorHandling()

  const [activeTask, setActiveTask] = useState(tasksConfig.SYSTEM_TASKS)
  const [trayItems, setTrayItems] = useState()
  const [initialSettings, setInitialSettings] = useState()

  const [execDialog, setExecDialog] = useState(false)
  const [settingsDialog, setSettingsDialog] = useState(false)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [currentWorkflow, setCurrentWorkflow] = useState(null)

  const workflow = workflowLens |> get
  const { engine } = diagram

  const [runWfQuery, { called: wfCalled, loading: loadingWf, data: wfData }] = useLazyQuery(WORKFLOW_LIST_QUERY)
  const [runTskQuery, { called: tskCalled, loading: loadingTsk, data: tskData }] = useLazyQuery(TASK_LIST_QUERY)

  useEffect(() => {
    switch (activeTask) {
      case tasksConfig.SYSTEM_TASKS:
        setTrayItems(systemTasks)
        break
      case tasksConfig.WORKFLOWS:
        {
          if (!wfCalled) runWfQuery()
          if (wfCalled && loadingWf) return () => {}
          const wflList = wfData?.getWorkflowList
          const trayList = wflList?.map(wfl => ({
            type: nodeConfig.SUB_WORKFLOW.type,
            name: wfl.name,
            version: wfl.version,
            color: nodeConfig.SUB_WORKFLOW.color,
            isSystemTask: false,
            workflow: wfl
          }))
          setTrayItems(trayList)
        }
        break
      case tasksConfig.TASKS: {
        if (!tskCalled) runTskQuery()
        if (tskCalled && loadingTsk) return () => {}
        const tskList = tskData?.getTaskDefinitionList
        const trayList = tskList?.map(wfl => ({
          type: nodeConfig.TASK.type,
          name: wfl.name,
          version: wfl.version,
          color: nodeConfig.TASK.color,
          isSystemTask: false,
          workflow: wfl,
          inputKeys: wfl.inputKeys
        }))
        setTrayItems(trayList)
        break
      }
      default:
        break
    }
  }, [
    activeTask,
    loadingTsk,
    loadingWf,
    runTskQuery,
    runWfQuery,
    tskCalled,
    tskData?.getTaskDefinitionList,
    wfCalled,
    wfData?.getWorkflowList
  ])

  const toggleExecDialog = useCallback(() => {
    setExecDialog(current => !current)
  }, [])

  const toggleSettingsDialog = useCallback(() => {
    setSettingsDialog(current => !current)
  }, [])

  const togglePreviewDialog = useCallback(() => {
    const { name, description, timeoutSeconds, workflowStatusListenerEnabled, createdBy, version } = workflow
    setCurrentWorkflow({ ...parseDiagramToJSON(engine), name, description, timeoutSeconds, workflowStatusListenerEnabled, createdBy, version })
    setPreviewDialog(current => !current)
  }, [engine, workflow])

  const handleDelete = useCallback(() => {
    const selectedEntities = engine.getModel().getSelectedEntities()
    if (selectedEntities.length > 0) {
      const confirm = window.confirm(t('Designer.DeleteConfirmation'))
      if (confirm) {
        diagram.deleteSelected()
      }
    }
  }, [diagram, engine, t])

  const handleShowSettings = useCallback(() => {
    setInitialSettings(workflow)
    toggleSettingsDialog()
  }, [toggleSettingsDialog, workflow])

  const handleCancelSettings = useCallback(() => {
    toggleSettingsDialog()
    set(workflowLens, initialSettings)
  }, [initialSettings, toggleSettingsDialog, workflowLens])

  const warningIfTaskComponentMissing = useCallback(
    async importedWorkflow => {
      const { data: wkfDataList } = await clientQuery(WORKFLOW_LIST_QUERY)
      const { data: taskDataList } = await clientQuery(TASK_LIST_QUERY)

      const subWorkflows = importedWorkflow?.tasks?.filter(tsk => tsk?.type === nodeConfig.SUB_WORKFLOW.type)
      const tasks = importedWorkflow?.tasks?.filter(tsk => tsk?.type === nodeConfig.TASK.type)

      const missingSubWorkflows = subWorkflows
        ?.filter(
          swf =>
            !wkfDataList?.getWorkflowList?.find(
              wf => wf?.name === swf?.subWorkflowParam?.name && wf?.version === swf?.subWorkflowParam?.version
            )
        )
        .map(s => s.name)
        .join(', ')

      const missingTasks = tasks
        ?.filter(mTsk => !taskDataList?.getTaskDefinitionList?.find(tsk => tsk?.name === mTsk?.name))
        .map(t => t.name)
        .join(', ')

      missingSubWorkflows && addToast(t('Workflow.MissingWorkflows', { missingSubWorkflows }), 'warning', 5000)
      missingTasks && addToast(t('Task.MissingTasks', { missingTasks }), 'warning', 5000)
    },
    [addToast, clientQuery, t]
  )

  const handleImport = useCallback(
    async file => {
      try {
        if (file) {
          const content = await getFileContents(file)
          const wf = JSON.parse(content) |> omit(['name', 'createdBy', 'updatedBy', 'createTime', 'updateTime'])
          drawDiagram(wf, engine)

          resetWorkflow({
            ...wf,
            description: wf?.description,
            createdBy: oidcUser?.profile.name,
            ownerEmail: oidcUser?.profile.preferred_username
          })

          warningIfTaskComponentMissing(wf)
        }
      } catch (err) {
        showError(new Error('Invalid Json format. ' + err))
      }
    },
    [engine, oidcUser?.profile.name, oidcUser?.profile.preferred_username, resetWorkflow, showError, warningIfTaskComponentMissing]
  )

  const handleExport = useCallback(() => {
    try {
      const jsonObject = parseDiagramToJSON(engine)
      const { name, description, timeoutSeconds, workflowStatusListenerEnabled, createdBy, version } = workflow
      const finalObject = { ...jsonObject, name, description, timeoutSeconds, workflowStatusListenerEnabled, createdBy, version }
      const fileContent = JSON.stringify(finalObject, null, 2)
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' })
      const fileName = workflow?.name ? `${workflow?.name}` : defaultFileName
      saveAs(blob, `${fileName}.json`)
    } catch (err) {
      showError(err)
    }
  }, [engine, showError, workflow])

  const handleUndo = useCallback(() => diagram.undo(), [diagram])
  const handleRedo = useCallback(() => diagram.redo(), [diagram])

  if (loading) {
    return <FakeText lines={3} />
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
        onPreviewJson={togglePreviewDialog}
        onDelete={handleDelete}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      <TrayWidgetList trayItems={trayItems} activeTask={activeTask} setActiveTask={setActiveTask} />
      <BodyWidget canvasClass={'dataflow-canvas-fullscreen'} workflow={workflow} engine={engine} setIsDirty={setIsDirty} locked={false} />
      <SideMenu workflow={workflow}></SideMenu>
      <ExecuteWorkflowModal
        open={execDialog}
        toggleExecDialog={toggleExecDialog}
        name={workflow?.name || emptyString}
        version={workflow?.version ?? workflowConfig.version}
      />
      <GeneralSettingsDialog
        open={settingsDialog}
        onClose={handleCancelSettings}
        onYes={toggleSettingsDialog}
        workflowLens={workflowLens}
      />
      <PreviewJsonDialog open={previewDialog} onClose={togglePreviewDialog} workflow={currentWorkflow || emptyObject} />
    </>
  )
}

Workflow.propTypes = {
  loading: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  resetWorkflow: PropTypes.func.isRequired,
  isNew: PropTypes.bool.isRequired,
  diagram: PropTypes.object.isRequired,
  workflowLens: PropTypes.object.isRequired,
  setIsDirty: PropTypes.func.isRequired
}

export default Workflow
