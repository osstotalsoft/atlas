# Development setup

Even if you would like to adapt the application to your needs or you'd like to contribute to Atlas, here are the steps to follow in order to make the application up and running:

**First of all, prepare your development environment and ensure you have installed the following prerequisites:**

* Visual Studio Code: [https://code.visualstudio.com/download](https://code.visualstudio.com/download)
* Git: [https://git-scm.com/download/win](https://git-scm.com/download/win)
* Git Extensions: [https://github.com/gitextensions/gitextensions/releases](https://github.com/gitextensions/gitextensions/releases)
* Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)****

### **React application configuration**&#x20;

**Step 1:**  Go to .env configuration file from react-ui folder and set following variable with your own values:

* REACT\_APP\_IDENTITY\_CLIENT\_ID_:_ This should be the public identifier of Atlas
* REACT\_APP\_IDENTITY\_SCOPE: The list of scopes requested that will be present in the JWT token
* &#x20;REACT\_APP\_IDENTITY\_AUTHORITY: The url to your Identity Server
* REACT\_APP\_GQL: By default, the GQL Server runs on port 5000, but if that port will be changed, the new value must be configured here so the front-end application can communicate with the server side&#x20;
* REACT\_APP\_USE\_NBB\_MESSAGE: If you use the [.Net Building Blocks](https://github.com/osstotalsoft/nbb) for your messaging communication, which comes with its specific message structure, you would have to set this value to `true`, otherwise it will be `false.`

**Step 2:** Run the following commands to start the project

<mark style="color:purple;">`yarn install`</mark>

<mark style="color:purple;">`yarn start`</mark>

**Step 3**: Check the application at: [http://localhost:3000](http://localhost:3000)

****

### **Graph-QL Server configuration**

**Step 1:** Go to .env configuration file from gql-bff folder and set following variable with your own values:

* REACT\_APP\_IDENTITY\_AUTHORITY: The url to your Identity Server
* IDENTITY\_OPENID\_CONFIGURATION ???
* ELASTIC\_SEARCH\_HOST
* API\_URL
* BASE\_API\_URL
* IS\_MULTITENANT
