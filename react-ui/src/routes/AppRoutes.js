/* eslint-disable react/jsx-no-bind */
import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import CustomRoute from '../components/routing/CustomRoute'

import WorkflowListContainer from 'features/workflow/list/components/WorkflowListContainer'
import TaskListContainer from 'features/task/list/components/TasksListContainer'
import TaskContainer from 'features/task/edit/components/TaskContainer'
import ExecutionListContainer from 'features/execution/list/components/ExecutionListContainer'
import ExecutionDetailsContainer from 'features/execution/list/components/executionDetails/ExecutionDetailsContainer'
import { Forbidden, NotFound } from '@bit/totalsoft_oss.react-mui.kit.core'
import ErrorLogContainer from 'features/errorLogs/components/ErrorLogContainer'
import EventHandlerListContainer from 'features/eventHandler/list/components/EventHandlerListContainer'
import EventHandlerContainer from 'features/eventHandler/edit/components/EventHandlerContainer'
import WorkflowContainer from 'features/workflow/edit/components/WorkflowContainer'
import SchellarListContainer from 'features/schellar/list/components/SchellarListContainer'
import ScheduleContainer from 'features/schellar/edit/components/ScheduleContainer'

export default function AppRoutes() {
  return (
    <Switch>
      <CustomRoute isPrivate={true} exact path='/workflows' component={WorkflowListContainer} />
      <CustomRoute isPrivate={true} exact path='/workflows/:new(new)' component={WorkflowContainer} fullWidth={true} />
      <CustomRoute isPrivate={true} exact path='/workflows/:name/:version' component={WorkflowContainer} fullWidth={true} />
      <CustomRoute isPrivate={true} exact path='/executions' component={ExecutionListContainer} />
      <CustomRoute isPrivate={true} exact path='/executions/:workflowId' component={ExecutionDetailsContainer} />
      <CustomRoute isPrivate={true} exact path='/eventHandlers' component={EventHandlerListContainer} />
      <CustomRoute isPrivate={true} exact path='/eventHandlers/:new(new)' component={EventHandlerContainer} />
      <CustomRoute isPrivate={true} exact path='/eventHandlers/:event/:name' component={EventHandlerContainer} />
      <CustomRoute isPrivate={true} exact path='/tasks' component={TaskListContainer} />
      <CustomRoute isPrivate={true} exact path='/tasks/:new(new)' component={TaskContainer} />
      <CustomRoute isPrivate={true} exact path='/tasks/:name' component={TaskContainer} />
      <CustomRoute isPrivate={true} exact path='/schedule' component={SchellarListContainer} />
      <CustomRoute isPrivate={true} exact path='/schedule/:new(new)' component={ScheduleContainer} />
      <CustomRoute isPrivate={true} exact path='/schedule/:name' component={ScheduleContainer} />
      <CustomRoute
        isPrivate={true}
        exact
        path='/logs/:id([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})'
        component={ErrorLogContainer}
      />
      <Redirect exact from='/' to='/workflows' />
      <Route exact path='/forbidden' component={Forbidden} />
      <Route render={() => <NotFound title='PageNotFound'></NotFound>} />
    </Switch>
  )
}
