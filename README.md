# Qlik Sense Advanced Filter Extension 

This is a QS Filter Extension with advanced features that include Multiple dimensions, Default Selections and Advanced Styling Capabilities. 

## Install qExt
Run `npm install -g qext` to install install the main qext tool globally. (You'll need node.js version 16.18.1).

## Create a new extension
For first time run 'qext --create-extension my-extension --install'
and go to the project directory 'cd my-extension'

## Configure the qExt.config.json file 
Replace/Enter the host and hdrAuthUser properties according to your configuration. Refer the [qExt - Qlik Sense Extension Development Environment : Header Auth Configuration](https://opensrc.axisgroup.com/qext/usage/header-auth.html).
![image](https://github.com/QlikSenseStudios/qs-intuit-advanced-filter/assets/101477932/264364d6-4475-4ed0-aa63-eadcec2eecb8)

## Development
Run `npm run watch-deploy`

## Package
1. Run `npm run build`
2. Install the extension on a Qlik Sense server through the QMC.

## Learn More

1. You can learn more about qExt Scripts in the [qExt - Qlik Sense Extension Development Environment](https://github.com/axisgroup/qExt).
2. You can learn more about Qlik Sense Visualization Extensions in the [Getting started building visualization extensions](https://help.qlik.com/en-US/sense-developer/May2023/Subsystems/Extensions/Content/Sense_Extensions/extensions-getting-started.htm).
   
