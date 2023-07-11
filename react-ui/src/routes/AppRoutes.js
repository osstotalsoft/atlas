/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import CustomRoute from '../components/routing/CustomRoute'

import WorkflowListContainer from 'features/workflow/list/components/WorkflowListContainer'
import TaskListContainer from 'features/task/list/components/TasksListContainer'
import TaskContainer from 'features/task/edit/components/TaskContainer'
import ExecutionListContainer from 'features/execution/list/components/ExecutionListContainer'
import ExecutionDetailsContainer from 'features/execution/list/components/executionDetails/ExecutionDetailsContainer'
import { Forbidden, NotFound } from '@totalsoft/rocket-ui'
import ErrorLogContainer from 'features/errorLogs/components/ErrorLogContainer'
import EventHandlerListContainer from 'features/eventHandler/list/components/EventHandlerListContainer'
import EventHandlerContainer from 'features/eventHandler/edit/components/EventHandlerContainer'
import WorkflowContainer from 'features/workflow/edit/components/WorkflowContainer'
import ScheduleListContainer from 'features/schedule/list/components/ScheduleListContainer'
import ScheduleContainer from 'features/schedule/edit/components/ScheduleContainer'

export default function AppRoutes() {
  return (
    <Routes>
      <Route exact path='/workflows' element={<CustomRoute isPrivate={true} component={WorkflowListContainer} />} />
      <Route exact path='/workflows/:new' element={<CustomRoute fullWidth isPrivate={true} component={WorkflowContainer} />} />
      <Route exact path='/workflows/:name/:version' element={<CustomRoute fullWidth isPrivate={true} component={WorkflowContainer} />} />

      <Route exact path='/executions' element={<CustomRoute isPrivate={true} component={ExecutionListContainer} />} />
      <Route exact path='/executions/:workflowId' element={<CustomRoute isPrivate={true} component={ExecutionDetailsContainer} />} />

      <Route exact path='/eventHandlers' element={<CustomRoute isPrivate={true} component={EventHandlerListContainer} />} />
      <Route exact path='/eventHandlers/:new' element={<CustomRoute isPrivate={true} component={EventHandlerContainer} />} />
      <Route exact path='/eventHandlers/:event/:name' element={<CustomRoute isPrivate={true} component={EventHandlerContainer} />} />

      <Route exact path='/tasks' element={<CustomRoute isPrivate={true} component={TaskListContainer} />} />
      <Route exact path='/tasks/:new' element={<CustomRoute isPrivate={true} component={TaskContainer} />} />
      <Route exact path='/tasks/:name' element={<CustomRoute isPrivate={true} component={TaskContainer} />} />

      <Route exact path='/schedule' element={<CustomRoute isPrivate={true} component={ScheduleListContainer} />} />
      <Route exact path='/schedule/:new' element={<CustomRoute isPrivate={true} component={ScheduleContainer} />} />
      <Route exact path='/schedule/:name' element={<CustomRoute isPrivate={true} component={ScheduleContainer} />} />
      <Route
        isPrivate={true}
        exact
        path='/logs/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})'
        component={ErrorLogContainer}
      />
      <Route exact path='/forbidden' component={Forbidden} />
      <Route path='/' element={<Navigate replace to='/workflows' />} />
      <Route render={() => <NotFound title='PageNotFound'></NotFound>} />
    </Routes>
  )
}
