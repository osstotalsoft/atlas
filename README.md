![Image alt text](react-ui/src/assets/img/LogoAtlas.png)

## About project
Atlas is a graphical interface, built on top of the Netflix's [Conductor](https://netflix.github.io/conductor/), used to create, modify and manage workflows in a very intuitive way enabling customers to create automated processes without having advanced technical knowledge.

:green_book: Here you can find the full [documentation](https://totalsoft.gitbook.io/atlas-workflow-designer/getting-started/aboutproject)

Watch the movie : https://youtu.be/Qnj5EiOjK-I

## Creating a new workflow
To create a new workflow, click on the Add button, configure your desired tasks sequentiality, fill in the general
information, set the workflow name and then save it.

> **Note**: Workflow name is required and must be unique. Keep in mind that the name cannot be changed later compared to the general parameters which are optional and can be changed at any time.

![Image alt text](react-ui/src/assets/img/Readme/CreateWorkflow.gif)
 
## Adding tasks
To add a new task on the canvas, find the task that meets your requirements between System Tasks, Custom Tasks, and Workflows in the left menu and add it to the workflow using drag and drop. To connect the tasks, drag a line from the out port of one task and drop it to the input port of the other task.  
![Image alt text](react-ui/src/assets/img/Readme/AddingTasks.gif) 

## Configuring task parameters

To edit or add task parameters, double-click on the task and navigate through the tabs until you fill in all the desired input elements

> Input parameters can be declared as: `${workflow.input.lambdaValue}`<br>
> Variable provided by the other task: `${<taskRefName>.output.result}`<br>

## Lambda
Lambda task, helps users to execute ad hoc logic at Workflow runtime using Javascript evaluation engine.
![Image alt text](react-ui/src/assets/img/Readme/LambdaTask.gif)

## Decision
Decision task works by evaluating either a single parameter or an entire expression. After evaluating the returning value, the workflow will follow the corresponding decision case.
First of all, define the parameters which the decision process should take into consideration and then write the logic. Please follow the example below:
![Image alt text](react-ui/src/assets/img/Readme/DecisionTask.gif)

## Fork and JOIN
The 'Fork' function is used to schedule a parallel set of tasks. A Join task is needed to wait for the completion of all the tasks spawned by fork task and aggregate the outputs in a single Json object.

> A Join Task **MUST** follow a Fork Task<br>

![Image alt text](react-ui/src/assets/img/Readme/ForkJoinTask.JPG)

## Http
An Http task is used to make calls to another microservice over HTTP. There can be used all the methods like GET, PUT, POST, DELETE and there can be configured custom headers depending on the type of the call.
![Image alt text](react-ui/src/assets/img/Readme/HttpTask.gif)

## Terminate
This task can terminate a workflow with a given status and modify it's output with a given parameter. It can act as a "return statement" for conditions where you simply want to terminate the workflow.
![Image alt text](react-ui/src/assets/img/Readme/TerminateTask.gif)

## Docker
Run 
> docker compose up -d
to start conductor-server with in memory database

## Schellar integration
https://github.com/flaviostutz/schellar

Run 
> docker compose --profile scheduler up -d
to start conductor-server with in memory database and schellar (with mongo db). Configure schellar url in gql .env file (SCHEDULE_URL=http://localhost:3001)
![Image alt text](react-ui/src/assets/img/Readme/TerminateTask.gif)