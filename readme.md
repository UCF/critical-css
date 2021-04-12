# Critical CSS - Azure Functions

This project provides an Azure Function for processing provided HTML and returning the Critical CSS needed to render the above the fold content at various dimensions. The code is specifically designed to work with and be deployed to [Azure Functions](https://azure.microsoft.com/en-us/services/functions/).

## Requirements

* NodeJS 14+
* VSCode (Deployment Configs are built for VSCode)

## Getting Started
1. Ensure VSCode is installed. The project can be modified and deployed without VSCode, but all the following instructions will assume VSCode is being used.
2. Install the Azure Functions:
    - Open a terminal/command prompt
    - If using `nvm`, ensure you're using version 14+ of nodejs: `nvm use 14`
    - Install globally: `npm install -g azure-functions-core-tools@3 --unsafe-perm true`
3. Install recommended extensions:
    - Go to the extensions tab
    - Search for "@recommended"
    - Install the extensions listed under "Workspace Recommendations"
4. Install npm dependencies:
    - Open a new terminal
    - If using `nvm`, ensure you're using version 14+ of nodejs: `nvm use 14`
    - Install local dependencies: `npm install`
5. Setup Azure Functions:
    - Click on the Azure Functions tab
    - Log into Azure account
    - Open local project and browse to the directory of this project
6. If not already created, go to the [Azure Portal](https://portal.azure.com) and create a new Function to deploy to. Alternatively, you can deploy to a new Function by following the prompts in Visual Studio Code when deploying the function.
