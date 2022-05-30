# High level architecture

The application is composed by a front-end application created with [React](https://reactjs.org/) and backend for front-end application using [graph-ql mesh](https://www.graphql-mesh.com/) technology, serving as a gateway between application and other services.

![](<../.gitbook/assets/download (1).jpeg>)

#### React UI application

The application interface was generated with [this ](https://github.com/osstotalsoft/generator-webapp-rocket)very useful tool for starting ui applications and it was written in JavaScript using React open-source library ecosystem.

One of the main attraction points of this application may be the workflow designer screen which has been created using [React Diagrams](https://github.com/projectstorm/react-diagrams) component.&#x20;

#### Back-End application

The server side component consists of an Apollo Server application on which we have defined the GraphQL schema that specifies all of the types and fields available in our graph. In order to quickly transform the Conductor REST API into a GraphQL Gateway, we chose to use [Graph QL Mesh](https://www.graphql-mesh.com/) which permitted to extend the unified schema with custom types and resolvers which gave us the flexibility to implement all the desired behavior.&#x20;

#### Third party services

Elasticsearch is used by the server as an external database for different functionalities as logs and history.&#x20;

Conductor API is called by the server to benefit of [Conductor ](https://netflix.github.io/conductor/)functionalities which underlies the storage and orchestration of all the workflows. The API gives us the possibility to create and update the resources definitions, execute different actions on the workflows or tasks, and returns the resulting information about the processes activity.

_Note: The application uses **SSO Authentication technology** in order to authenticate using the same ID over several related systems._&#x20;
