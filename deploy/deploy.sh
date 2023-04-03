#!/bin/bash
RESOURCE_GROUP="${RESOURCE_GROUP:-your_default_resource_group}"
APP_NAME="${APP_NAME:-your_default_app_name}"
LOCATION="${LOCATION:-EastAsia}"
APP_PLAN="${APP_PLAN:-your_default_app_plan}"

az group create --name $RESOURCE_GROUP --location $LOCATION
az appservice plan create --name $APP_PLAN --resource-group $RESOURCE_GROUP --sku B1 --is-linux
az functionapp create --resource-group $RESOURCE_GROUP --plan $APP_PLAN --name $APP_NAME --runtime "node|18-lts" --functions-version 4
