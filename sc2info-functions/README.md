# Azure Functions

## Installation

```powershell
$STORAGE_ACCOUNT_NAME = 'sharedklgoyistorage'
$AZURE_FUNCTIONS_ACCOUNT_NAME = 'sc2-info-functions'
```

### Fetch Settings to store Configuration

```powershell
func azure storage fetch-connection-string $STORAGE_ACCOUNT_NAME
func azure functionapp fetch $AZURE_FUNCTIONS_ACCOUNT_NAME
```

### Fun Functions Locally (Does not work?)

```powershell
func start
```

### Deploy Functions

```powershell
func azure functionapp publish $AZURE_FUNCTIONS_ACCOUNT_NAME
```

### List Deployed Functions (With Keys)

```powershell
func azure functionapp list-functions $AZURE_FUNCTIONS_ACCOUNT_NAME --show-keys
```

## Blob Trigger

https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=typescript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4#return-output

### Binding Expressions

- [{rand-guid}](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns#create-guids)
- [{DateTime}](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-expressions-patterns#current-time)

### Dynamic Output Name with Node

https://github.com/Azure/azure-functions-host/issues/85

## Durable Functions

https://learn.microsoft.com/en-us/azure/azure-functions/durable/quickstart-ts-vscode?pivots=nodejs-model-v4

- Orchestrator function
    - describes a workflow that orchestrates other functions.
- Activity function
    - called by the orchestrator function, performs work, and optionally returns a value.
- Client function
    - a regular Azure Function that starts an orchestrator function. This example uses an HTTP triggered function.
