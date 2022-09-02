![Image alt text](src/assets/img/LogoAtlas.png)

##About project
Atlas is a graphical interface, built on top of the Netflix's [Conductor](https://netflix.github.io/conductor/), used to create, modify and manage workflows in a very intuitive way enabling customers to create automated processes without having advanced technical knowledge.

## Prerequisites:

• Visual Studio Code: https://code.visualstudio.com/download<br>
• Git: https://git-scm.com/download/win <br>
• Git Extensions: https://github.com/gitextensions/gitextensions/releases <br>
• Node.js: https://nodejs.org/en/download/<br>
• Before starting, we recommend to take a look at the [Conductor documentation](https://netflix.github.io/conductor/configuration/taskdef/) as an introduction to Tasks, Workflows, Definitions and some other related concepts.

## Start project in development:

Clone repositories from:<br/>
• [https://dev.azure.com/totalsoft/LSNG_CONDUCTOR/\_git/Atlas](https://dev.azure.com/totalsoft/LSNG_CONDUCTOR/_git/Atlas) (Frontend)</br>
• [https://dev.azure.com/totalsoft/LSNG_CONDUCTOR/\_git/Atlas-gql-mesh](https://dev.azure.com/totalsoft/LSNG_CONDUCTOR/_git/Atlas-gql-mesh) (Gql-Mesh)

Set up Elastic by running the following commands in a Powershell terminal/command prompt:

    $env:KUBECONFIG=[insert path to the kubeconfig file for QA]
    kubectl port-forward svc/elasticsearch-master [portNumber]:9200 -n elastic

## Starting the project

Depending on the event message structure you are using, go to `.env` file and set the `REACT_APP_USE_NBB_MESSAGE` parameter accordingly: If you are using [.Net Building Blocks library](https://github.com/osstotalsoft/nbb), set the parameter to `true`, else set it to `false`. In the first case, the message would have the NBB event message structure like Payload and Headers, otherwise, the message would be transmitted as it is configured through the interface.

Run the following commands to start the projects:

#### `yarn`

#### `yarn start`

This will start up the apps on: <br>
• [http://localhost:3000](http://localhost:3000) - React app <br>
• [http://localhost:5000/graphql](http://localhost:5000/graphql) - GQL-Mesh <br>
• [http://localhost:9000](http://localhost:9000) - Elastic

## Check out the application from QA:

• [https://leasing-atlas.appservice.online](https://leasing-atlas.appservice.online) (QA)

##Creating new workflow
To create a new workflow, click on the Add button, configure your desired tasks sequentiality, fill in the general
information, set the workflow name and then save it.

> **Note**: Workflow name is required and must be unique. Keep in mind that the name cannot be changed later compared to the general parameters which are optional and can be changed at any time.

![Image alt text](src/assets/img/readme/CreateWorkflow.gif)

##Adding tasks
To add a new task on the canvas, find the task that meets your requirements between System Tasks, Custom Tasks, and Workflows in the left menu and add it to the workflow using drag and drop. To connect the tasks, drag a line from the out port of one task and drop it to the input port of the other task.

![Image alt text](src/assets/img/readme/AddingTasks.gif)

## Configuring task parameters

To edit or add task parameters, double-click on the task and navigate through the tabs until you fill in all the desired input elements

> Input parameters can be declared as: `${workflow.input.lambdaValue}`<br>
> Variable provided by the other task: `${<taskRefName>.output.result}`<br>

##Lambda
Lambda task, helps users to execute ad hoc logic at Workflow runtime using Javascript evaluation engine.
![Image alt text](src/assets/img/readme/LambdaTask.gif)

##Decision
Decision task works by evaluating either a single parameter or an entire expression. After evaluating the returning value, the workflow will follow the corresponding decision case.
First of all, define the parameters which the decision process should take into consideration and then write the logic. Please follow the example below:
![Image alt text](src/assets/img/readme/DecisionTask.gif)

##Fork and JOIN
The 'Fork' function is used to schedule a parallel set of tasks. A Join task is needed to wait for the completion of all the tasks spawned by fork task and aggregate the outputs in a single Json object.

> A Join Task **MUST** follow a Fork Task<br>

![Image alt text](src/assets/img/readme/ForkJoinTask.JPG)

##Http
An Http task is used to make calls to another microservice over HTTP. There can be used all the methods like GET, PUT, POST, DELETE and there can be configured custom headers depending on the type of the call.
![Image alt text](src/assets/img/readme/HttpTask.gif)

##Terminate
This task can terminate a workflow with a given status and modify it's output with a given parameter. It can act as a "return statement" for conditions where you simply want to terminate the workflow.
![Image alt text](src/assets/img/readme/TerminateTask.gif)
