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
      <Route exact path='/workflows' element={<CustomRoute isPrivate={false} component={WorkflowListContainer} />} />
      <Route exact path='/workflows/:new' element={<CustomRoute fullWidth isPrivate={false} component={WorkflowContainer} />} />
      <Route exact path='/workflows/:name/:version' element={<CustomRoute fullWidth isPrivate={false} component={WorkflowContainer} />} />

      <Route exact path='/executions' element={<CustomRoute isPrivate={false} component={ExecutionListContainer} />} />
      <Route exact path='/executions/:workflowId' element={<CustomRoute isPrivate={false} component={ExecutionDetailsContainer} />} />

      <Route exact path='/eventHandlers' element={<CustomRoute isPrivate={false} component={EventHandlerListContainer} />} />
      <Route exact path='/eventHandlers/:new' element={<CustomRoute isPrivate={false} component={EventHandlerContainer} />} />
      <Route exact path='/eventHandlers/:event/:name' element={<CustomRoute isPrivate={false} component={EventHandlerContainer} />} />

      <Route exact path='/tasks' element={<CustomRoute isPrivate={false} component={TaskListContainer} />} />
      <Route exact path='/tasks/:new' element={<CustomRoute isPrivate={false} component={TaskContainer} />} />
      <Route exact path='/tasks/:name' element={<CustomRoute isPrivate={false} component={TaskContainer} />} />

      <Route exact path='/schedule' element={<CustomRoute isPrivate={false} component={ScheduleListContainer} />} />
      <Route exact path='/schedule/:new' element={<CustomRoute isPrivate={false} component={ScheduleContainer} />} />
      <Route exact path='/schedule/:name' element={<CustomRoute isPrivate={false} component={ScheduleContainer} />} />
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
