import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { useHeader } from 'providers/AreasProvider'
import { useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { Dialog, useToast } from '@totalsoft/rocket-ui'
import Workflow from './Workflow'
import Tour from './tour/Tour'
import EditTaskModal from './workflowTask/EditTaskModal'
import CustomHeader from 'components/layout/CustomHeader'
import { emptyObject, emptyString } from 'utils/constants'
import { parseDiagramToJSON, decisionCasesToPorts } from 'features/designer/builderHandler'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { keys, includes, map, prop, reject, isNil } from 'ramda'
import { isPropertyDirty } from '@totalsoft/change-tracking'
import { get, set } from '@totalsoft/react-state-lens'
import { getApplicationDiagram } from 'features/designer/diagram/getApplicationDiagram'
import { cloneSelection, parseObjectParameters, updateCacheList, validateEngineWorkflow } from 'features/workflow/common/functions'
import { useMutation } from '@apollo/client'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { WORKFLOW_QUERY } from '../queries/WorkflowQuery'
import { SidebarContext } from 'providers/SidebarProvider'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { defaultConfig } from '../constants/workflowConfig'
import { ClipboardContext } from 'providers/ClipboardProvider'
import { drawDiagram } from 'features/designer/drawingHandler'
import { demoWf } from './tour/demoWorkflow'
import { Toolkit } from '@projectstorm/react-canvas-core'
import AddNameModal from 'features/workflow/common/components/AddNameModal'
import { WORKFLOW_HISTORY_QUERY } from './workflowHistory/queries/WorkflowHistoryQuery'
import { NotFound } from '@totalsoft/rocket-ui'
import workflowConfig from 'features/designer/constants/WorkflowConfig'
import { skipParametersByParsing } from 'features/workflow/common/constants'
import { CREATE_UPDATE_WORKFLOW_MUTATION } from '../mutations/CreateOrUpdateWorkflowMutation'

const WorkflowContainer = () => {
  const { t } = useTranslation()
  const addToast = useToast()
  const showError = useError()
  const { version: paramVersion, new: paramNew, name: paramName } = useParams()
  const history = useNavigate()
  const { oidcUser } = useReactOidc()

  const [, setHeader] = useHeader(<CustomHeader />)
  const [, setDrawerOpen] = useContext(SidebarContext)
  const [clipBoard, setClipBoard] = useContext(ClipboardContext)
  const [localPayload, setLocalPayload] = useState()

  const [isDirty, setIsDirty] = useState(false)
  const isNew = paramNew === 'new'

  const [diagram] = useState(getApplicationDiagram())
  const { engine } = diagram

  const workflowVersion = paramVersion ? parseInt(paramVersion) : workflowConfig.version
  const [versionLens, versionDirtyInfo] = useChangeTrackingLens(workflowVersion)
  const version = versionLens |> get

  const [nameLens, nameDirtyInfo] = useChangeTrackingLens(paramName)
  const name = nameLens |> get

  const [inputsLens, inputsDirtyInfo, resetInputs] = useChangeTrackingLens()
  const inputs = inputsLens |> get

  const workflowTasks = engine.model.getNodes() |> map(prop('inputs')) |> reject(isNil)

  const [workflowLens, , resetWorkflow] = useChangeTrackingLens(defaultConfig)
  const workflow = workflowLens |> get
  const [model, stashModel] = useState()

  const [taskDialog, showTaskDialog] = useState(false)
  const [nameDialog, showNameDialog] = useState(false)
  const [tourDialog, showTourDialog] = useState(false)
  const [startTourDialog, showStartTourDialog] = useState(false)

  const toggleNameDialog = useCallback(() => showNameDialog(current => !current), [])
  const toggleTourDialog = useCallback(() => showTourDialog(current => !current), [])
  const toggleStartTourDialog = useCallback(() => showStartTourDialog(current => !current), [])
  const clientQuery = useClientQueryWithErrorHandling()

  const { loading, data, error } = useQueryWithErrorHandling(WORKFLOW_QUERY, {
    variables: { name, version, skip: isNew }
  })

  const errorStatus = error?.graphQLErrors[0]?.extensions?.response?.status

  useEffect(() => {
    if (data) resetWorkflow(data?.getWorkflow)
  }, [data, resetWorkflow])

  const updateCacheAfterAdd = async cache => {
    try {
      const { data: updatedData } = await clientQuery(WORKFLOW_QUERY, {
        variables: { name, version, skip: false }
      })

      updateCacheList(cache, updatedData?.getWorkflow)
    } catch (err) {
      console.log(err)
    }
  }

  const updateCacheAfterEdit = async () => {
    try {
      await clientQuery(WORKFLOW_QUERY, {
        variables: { name, version, skip: false },
        fetchPolicy: 'network-only'
      })

      await clientQuery(WORKFLOW_HISTORY_QUERY, {
        variables: { workflowName: name, version, skip: false },
        fetchPolicy: 'network-only'
      })
    } catch (err) {
      console.log(err)
    }
  }

  const [createOrUpdateWorkflow, { loading: saving }] = useMutation(CREATE_UPDATE_WORKFLOW_MUTATION, {
    onCompleted: () => {
      addToast(t('General.SavingSucceeded'), 'success')
      if (isNew) toggleNameDialog()
      setIsDirty(false)
      if (isNew) history(`/workflows/${name}/${version}`)
    },
    onError: err => showError(err),
    update: isNew ? updateCacheAfterAdd : updateCacheAfterEdit
  })

  const isValid = useCallback(() => {
    const validationResults = validateEngineWorkflow(engine)
    const errors = validationResults.filter(([isValid]) => !isValid)

    if (errors?.length > 0) {
      errors?.map(([_, message]) => showError(new Error(message)))
      return false
    }
    return true
  }, [engine, showError])

  const handleOpenNameDialog = useCallback(() => {
    if (isValid()) showNameDialog(true)
  }, [isValid])

  const handleSave = useCallback(() => {
    if (isValid()) {
      try {
        const jsonObject = parseDiagramToJSON(engine)
        const input = {
          ...jsonObject,
          name,
          version,
          description: workflow?.description,
          timeoutSeconds: workflow?.timeoutSeconds,
          failureWorkflow: workflow?.failureWorkflow,
          workflowStatusListenerEnabled: workflow?.workflowStatusListenerEnabled,
          createdBy: isNew ? oidcUser?.profile.name : workflow?.createdBy,
          createTime: isNew ? new Date().getTime() : workflow?.createTime,
          ownerEmail: workflow?.ownerEmail || oidcUser?.profile.preferred_username,
          updatedBy: isNew ? emptyString : oidcUser?.profile.name,
          updateTime: isNew ? undefined : new Date().getTime()
        }

        set(workflowLens, input)
        createOrUpdateWorkflow({ variables: { input } })
      } catch (err) {
        showError(err)
      }
    }
  }, [
    createOrUpdateWorkflow,
    engine,
    isNew,
    isValid,
    name,
    oidcUser?.profile.name,
    oidcUser?.profile.preferred_username,
    showError,
    version,
    workflow?.createTime,
    workflow?.createdBy,
    workflow?.description,
    workflow?.failureWorkflow,
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
      var nodeElement = Toolkit.closest(event?.target, '.node[data-nodeid]')
      const node = engine.model.getNode(nodeElement?.getAttribute('data-nodeid'))
      const noEditList = [nodeConfig.START.type, nodeConfig.END.type, nodeConfig.FORK_JOIN.type, nodeConfig.JOIN.type]
      if (node && !includes(node?.type, noEditList)) {
        node.setSelected(false)

        var desc = null
        try {
          desc = JSON.parse(node?.inputs.description)
        } catch {
          console.log('no desc')
        }

        if (desc) {
          resetInputs({
            id: node?.options?.id,
            inputs: { ...node?.inputs, asyncHandler: desc?.asyncHandler, description: desc?.description }
          })
        } else {
          resetInputs({ id: node?.options?.id, inputs: node?.inputs })
        }
        showTaskDialog(true)
      }
    },
    [engine.model, resetInputs]
  )

  const handleSaveTask = useCallback(() => {
    let node = engine.model.getNode(inputs?.id)
    node.inputs = inputs?.inputs
    parseObjectParameters(node.inputs, skipParametersByParsing)

    node.options.name = inputs?.inputs?.name
    if (
      inputs?.inputs.type === nodeConfig.DECISION.type &&
      (isPropertyDirty('inputs.decisionCases', inputsDirtyInfo) || isPropertyDirty('inputs.hasDefaultCase', inputsDirtyInfo))
    ) {
      const cases = keys(inputs?.inputs?.decisionCases)
      decisionCasesToPorts(node, cases)
    }
    if (inputs?.inputs?.type === nodeConfig.EVENT.type) {
      try {
        if (localPayload) {
          const payload = JSON.parse(localPayload)
          node.inputs.inputParameters =
            process.env.REACT_APP_USE_NBB_MESSAGE === 'true' ? { ...node.inputs.inputParameters, Payload: payload } : payload
        }
      } catch (err) {
        showError(err)
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
        onSave={isNew ? handleOpenNameDialog : handleSave}
        saving={saving}
        disableSaving={workflow?.readOnly}
        onGetHelp={handleStartTour}
      />
    )
  }, [handleOpenNameDialog, handleSave, handleStartTour, isNew, name, saving, setHeader, toggleNameDialog, workflow?.readOnly])

  if (errorStatus === 404) return <NotFound title={t('Workflow.WorkflowNotFound')}></NotFound>
  return (
    <>
      {/*<Prompt when={isDirty} message={t('LeavingWithoutSaving')} />*/}
      <Workflow
        workflowLens={workflowLens}
        resetWorkflow={resetWorkflow}
        isNew={isNew}
        diagram={diagram}
        loading={loading}
        isDirty={isDirty}
        setIsDirty={setIsDirty}
      />
      <Dialog
        id='editTask'
        open={taskDialog}
        onClose={handleTaskDialogCancel}
        disableBackdropClick
        maxWidth='lg'
        showX={false}
        content={
          <EditTaskModal
            inputsLens={inputsLens || emptyObject}
            dirtyInfo={inputsDirtyInfo}
            workflowTasks={workflowTasks}
            onSave={handleSaveTask}
            onCancel={handleTaskDialogCancel}
            onPayloadChange={handlePayloadChange}
            readOnly={workflow?.readOnly || false}
          />
        }
      />
      <Dialog
        id='addName'
        open={nameDialog}
        title={t('Workflow.AddName')}
        disableBackdropClick
        maxWidth='sm'
        textDialogYes={t('General.Buttons.Save')}
        textDialogNo={t('General.Buttons.Cancel')}
        onClose={toggleNameDialog}
        onYes={handleSave}
        content={<AddNameModal nameLens={nameLens} versionLens={versionLens} dirtyInfo={nameDirtyInfo || versionDirtyInfo} />}
      />
      <Dialog
        id='startTour'
        maxWidth='xs'
        open={startTourDialog}
        title={t('Designer.StartTour')}
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
