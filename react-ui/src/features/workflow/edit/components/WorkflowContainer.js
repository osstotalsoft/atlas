import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Prompt, useHistory, useRouteMatch } from 'react-router'
import { useHeader } from 'providers/AreasProvider'
import { useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { CustomDialog, useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import Workflow from './Workflow'
import Tour from './tour/Tour'
import EditTaskModal from './workflowTask/EditTaskModal'
import AddNameModal from './modals/AddNameModal'
import CustomHeader from 'components/layout/CustomHeader'
import { emptyObject } from 'utils/constants'
import { parseDiagramToJSON, updateNodeWithDecisionCases } from 'features/designer/builderHandler'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { keys, includes, map, prop, reject, isNil } from 'ramda'
import { closest } from 'utils/functions'
import { isPropertyDirty } from '@totalsoft/change-tracking'
import { get, set } from '@totalsoft/react-state-lens'
import { getApplicationEngine } from 'features/designer/components/Application'
import { queryLimit } from 'features/common/constants'
import { cloneSelection, updateCacheDetail, updateCacheList } from 'features/workflow/common/functions'
import { useMutation } from '@apollo/client'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { WORKFLOW_QUERY } from '../queries/WorkflowQuery'
import { SAVE_WORKFLOW_MUTATION } from '../mutations/SaveWorkflowMutation'
import { WORKFLOW_LIST_QUERY } from 'features/workflow/list/queries/WorkflowListQuery'
import { UPDATE_WORKFLOW_MUTATION } from '../mutations/UpdateWorkflowMutation'
import { SidebarContext } from 'providers/SidebarProvider'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { defaultConfig } from '../constants/workflowConfig'
import { ClipboardContext } from 'providers/ClipboardProvider'
import { drawDiagram } from 'features/designer/drawingHandler'
import { demoWf } from './tour/demoWorkflow'

const WorkflowContainer = () => {
  const { t } = useTranslation()
  const addToast = useToast()
  const showError = useError()
  const match = useRouteMatch()
  const history = useHistory()
  const { oidcUser } = useReactOidc()

  const [, setHeader] = useHeader(<CustomHeader />)
  const [, setDrawerOpen] = useContext(SidebarContext)
  const [clipBoard, setClipBoard] = useContext(ClipboardContext)
  const [localPayload, setLocalPayload] = useState()

  const [isDirty, setIsDirty] = useState(false)

  const name = match.params.name
  const isNew = match.params.new === 'new'

  const [engine] = useState(getApplicationEngine())

  const [inputsLens, inputsDirtyInfo, resetInputs] = useChangeTrackingLens()
  const inputs = inputsLens |> get

  const workflowTasks = engine.model.getNodes() |> map(prop('inputs')) |> reject(isNil)

  const [workflowLens, dirtyInfo, resetWorkflow] = useChangeTrackingLens(defaultConfig)
  const workflow = workflowLens |> get
  const [model, stashModel] = useState()

  const [taskDialog, showTaskDialog] = useState(false)
  const [nameDialog, showNameDialog] = useState(false)
  const [tourDialog, showTourDialog] = useState(false)
  const [startTourDialog, showStartTourDialog] = useState(false)

  const toggleNameDialog = useCallback(() => showNameDialog(current => !current), [])
  const toggleTourDialog = useCallback(() => showTourDialog(current => !current), [])
  const toggleStartTourDialog = useCallback(() => showStartTourDialog(current => !current), [])

  const { loading } = useQueryWithErrorHandling(WORKFLOW_QUERY, {
    variables: { name, skip: isNew },
    onCompleted: data => {
      resetWorkflow(data?.getWorkflow)
    }
  })

  const clientQuery = useClientQueryWithErrorHandling()

  const updateCacheAfterEdit = async cache => {
    try {
      updateCacheDetail(cache, { name, skip: isNew }, { ...workflow, updatedBy: oidcUser.profile.name, ownerEmail: workflow?.ownerEmail })
      const existingWorkflows = cache.readQuery({
        query: WORKFLOW_LIST_QUERY,
        variables: { limit: queryLimit }
      })
      const { data } = await clientQuery(WORKFLOW_QUERY, {
        variables: { name: workflow?.name, skip: false }
      })
      const newCollection = [data?.getWorkflow, ...existingWorkflows?.getAll.filter(w => w.name !== name)]
      updateCacheList(cache, { limit: queryLimit }, newCollection)
    } catch (error) {
      console.log(error)
    }
  }

  const updateCacheAfterAdd = async cache => {
    try {
      const existingWorkflows = cache.readQuery({
        query: WORKFLOW_LIST_QUERY,
        variables: { limit: queryLimit }
      })
      const { data } = await clientQuery(WORKFLOW_QUERY, {
        variables: { name: workflow?.name, skip: false }
      })
      const newCollection = [...existingWorkflows?.getAll, data?.getWorkflow]
      updateCacheList(cache, { limit: queryLimit }, newCollection)
    } catch (error) {
      console.log(error)
    }
  }

  const [saveWorkflow, { loading: saving }] = useMutation(SAVE_WORKFLOW_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      toggleNameDialog()
      setIsDirty(false)
      if (isNew) history.push(`/workflows/${workflow?.name}`)
    },
    onError: error => showError(error),
    update: updateCacheAfterAdd
  })

  const [updateWorkflow] = useMutation(UPDATE_WORKFLOW_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      setIsDirty(false)
    },
    onError: error => showError(error),
    update: updateCacheAfterEdit
  })

  const handleSave = useCallback(() => {
    try {
      const jsonObject = parseDiagramToJSON(engine)
      const input = {
        ...jsonObject,
        name: workflow?.name,
        description: workflow?.description,
        timeoutSeconds: workflow?.timeoutSeconds,
        workflowStatusListenerEnabled: workflow?.workflowStatusListenerEnabled,
        createdBy: workflow?.createdBy,
        ownerEmail: workflow?.ownerEmail || oidcUser.profile.preferred_username
      }

      set(workflowLens, input)
      isNew
        ? saveWorkflow({
            variables: {
              input: { ...input, createdBy: oidcUser.profile.name }
            }
          })
        : updateWorkflow({
            variables: {
              input: { ...input, updatedBy: oidcUser.profile.name }
            }
          })
    } catch (e) {
      showError(e)
    }
  }, [
    engine,
    isNew,
    oidcUser.profile.name,
    oidcUser.profile.preferred_username,
    saveWorkflow,
    showError,
    updateWorkflow,
    workflow?.createdBy,
    workflow?.description,
    workflow?.name,
    workflow?.ownerEmail,
    workflow?.timeoutSeconds,
    workflow?.workflowStatusListenerEnabled,
    workflowLens
  ])

  const handleTaskDialogCancel = useCallback(() => {
    showTaskDialog(false)
  }, [])

  const handleDoubleClick = useCallback(
    event => {
      const element = closest(event.target, '.node[data-nodeid]')
      const node = engine.model.getNode(element?.getAttribute('data-nodeid'))
      const noEditList = [nodeConfig.START.type, nodeConfig.END.type, nodeConfig.FORK_JOIN.type, nodeConfig.JOIN.type]
      if (node && !includes(node?.type, noEditList)) {
        node.setSelected(false)
        resetInputs({ id: node?.options?.id, inputs: node?.inputs })
        showTaskDialog(true)
      }
    },
    [engine.model, resetInputs]
  )

  const handleSaveTask = useCallback(() => {
    let node = engine.model.getNode(inputs?.id)
    node.inputs = inputs?.inputs
    node.options.name = inputs?.inputs?.name
    if (inputs?.inputs.type === nodeConfig.DECISION.type && isPropertyDirty('inputs.decisionCases', inputsDirtyInfo)) {
      const decisionCases = keys(inputs?.inputs?.decisionCases)
      updateNodeWithDecisionCases(node, decisionCases)
    }
    if (inputs?.inputs?.type === nodeConfig.EVENT.type) {
      try {
        if (localPayload) {
          const payload = JSON.parse(localPayload)
          node.inputs.inputParameters = { ...node.inputs.inputParameters, payload }
        }
      } catch (e) {
        showError(e)
        return
      }
    }
    setIsDirty(true)
    showTaskDialog(false)
  }, [engine.model, inputs?.id, inputs?.inputs, inputsDirtyInfo, localPayload, showError])

  const handleCopyPaste = useCallback(
    event => {
      var key = event.which || event.keyCode // keyCode detection
      var ctrl = event.ctrlKey ? event.ctrlKey : key === 17 ? true : false // ctrl detection
      const selectedItems = engine.model.getSelectedEntities()

      //Ctrl + C
      if (selectedItems?.length > 0 && key == 67 && ctrl) {
        setClipBoard(selectedItems)
      }
      //Ctrl + V
      if (key == 86 && ctrl) {
        cloneSelection(engine, clipBoard)
      }
    },
    [clipBoard, engine, setClipBoard]
  )

  const handlePayloadChange = useCallback(value => {
    setLocalPayload(value)
  }, [])

  const handleStartTour = useCallback(() => {
    if (startTourDialog) toggleStartTourDialog()
    stashModel(engine.getModel())
    drawDiagram(demoWf, engine)
    toggleTourDialog()
  }, [engine, startTourDialog, toggleStartTourDialog, toggleTourDialog])

  const handleCloseTour = useCallback(() => {
    engine.setModel(null)
    model && engine.setModel(model)
    toggleTourDialog()
    stashModel(null)
  }, [engine, model, toggleTourDialog])

  useEffect(() => {
    let startTourDialogDisplayed = localStorage.getItem('startTourDialogDisplayed')
    if (!startTourDialogDisplayed) {
      showStartTourDialog(true)
      localStorage.setItem('startTourDialogDisplayed', true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('dblclick', handleDoubleClick)
    document.body.addEventListener('keydown', handleCopyPaste, false)

    // cleanup this component
    return () => {
      window.removeEventListener('dblclick', handleDoubleClick)
      document.body.removeEventListener('keydown', handleCopyPaste, false)
    }
  }, [handleCopyPaste, handleDoubleClick, workflowLens])

  useEffect(() => {
    setDrawerOpen(false)
    return () => setDrawerOpen(true)
  })

  useEffect(() => {
    setHeader(
      <CustomHeader
        headerText={name}
        path='/workflows'
        onSave={isNew ? toggleNameDialog : handleSave}
        saving={saving}
        onGetHelp={handleStartTour}
      />
    )
  }, [handleSave, handleStartTour, isNew, name, saving, setHeader, toggleNameDialog])

  return (
    <>
      <Prompt when={isDirty} message={t('LeavingWithoutSaving')} />
      <Workflow
        workflowLens={workflowLens}
        resetWorkflow={resetWorkflow}
        isNew={isNew}
        engine={engine}
        loading={loading}
        isDirty={isDirty}
        setIsDirty={setIsDirty}
      />
      <CustomDialog
        id='editTask'
        open={taskDialog}
        onClose={handleTaskDialogCancel}
        disableBackdropClick
        maxWidth='lg'
        content={
          <EditTaskModal
            inputsLens={inputsLens || emptyObject}
            dirtyInfo={inputsDirtyInfo}
            workflowTasks={workflowTasks}
            onSave={handleSaveTask}
            onCancel={handleTaskDialogCancel}
            onPayloadChange={handlePayloadChange}
          />
        }
      />
      <CustomDialog
        id='addName'
        open={nameDialog}
        title={t('Workflow.AddName')}
        disableBackdropClick
        maxWidth='sm'
        content={
          <AddNameModal workflowLens={workflowLens} dirtyInfo={dirtyInfo} onCancel={toggleNameDialog} onSave={handleSave} saving={saving} />
        }
      />
      <CustomDialog
        id='startTour'
        maxWidth='xs'
        open={startTourDialog}
        title={t('Designer.StartTour')}
        showActions
        onClose={toggleStartTourDialog}
        onYes={handleStartTour}
        textDialogYes={t('Dialog.Yes')}
        textDialogNo={t('Dialog.No')}
      />
      <Tour isOpen={tourDialog} onRequestClose={handleCloseTour} />
    </>
  )
}

export default WorkflowContainer
