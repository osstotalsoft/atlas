# 🐧 Development setup

Even if you would like to adapt the application to your needs or you'd like to contribute to Atlas, here are the steps to follow in order to make the application up and running:

First of all, prepare your development environment and ensure you have installed the following useful prerequisites:

* Visual Studio Code: [https://code.visualstudio.com/download](https://code.visualstudio.com/download)
* Git: [https://git-scm.com/download/win](https://git-scm.com/download/win)
* Git Extensions: [https://github.com/gitextensions/gitextensions/releases](https://github.com/gitextensions/gitextensions/releases)
* Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)****

<details>

<summary>React application configuration  </summary>

**Step 1:**  Go to .env configuration file from react-ui folder and set the following variables with your own values:

* REACT\_APP\_IDENTITY\_CLIENT\_ID_:_ This should be the public identifier of Atlas
* REACT\_APP\_IDENTITY\_SCOPE: The list of scopes requested that will be present in the JWT token
* REACT\_APP\_IDENTITY\_AUTHORITY: The url to your Identity Server
* REACT\_APP\_GQL: By default, the GQL Server runs on port 5000, but if that port will be changed, the new value must be configured here so the front-end application can communicate with the server side
* REACT\_APP\_USE\_NBB\_MESSAGE: If you use the [.Net Building Blocks](https://github.com/osstotalsoft/nbb) for your messaging communication, which comes with its specific message structure, you would have to set this value to `true`, otherwise it will be `false.`

**Step 2:** Run the following commands to start the project

```powershell
yarn install
yarn start
```

**Step 3**: Check the application at: [http://localhost:3000](http://localhost:3000)

</details>

<details>

<summary>Graph-QL Server configuration</summary>

**Step 1:** Go to .env configuration file from gql-bff folder and set the following variables with your own values:

* REACT\_APP\_IDENTITY\_AUTHORITY: The url to your Identity Server
* IDENTITY\_OPENID\_CONFIGURATION ???
* ELASTIC\_SEARCH\_HOST
* API\_URL
* BASE\_API\_URL
* IS\_MULTITENANT

**Step 2**: Set up the Elastic connection by running the following commands in a PowerShell terminal/command prompt:

```powershell
$env:KUBECONFIG=[insert path to the kubeconfig file for QA]
kubectl port-forward svc/elasticsearch-master [portNumber]:9200 -n elastic
```

**Step 3:** Run the following commands to start the project

```powershell
yarn install
yarn start
```

**Step 4:** Check the Elastic is running at: [http://localhost:9000](http://localhost:9000)

**Step 5:** Check the GQL server is running at: [http://localhost:5000/graphql](http://localhost:5000/graphql)

</details>

### **Congratulations, you're all set!**     :tada: **** :tada::tada:****
