#!/bin/bash
RESOURCE_GROUP="${RESOURCE_GROUP:-your_default_resource_group}"
APP_NAME="${APP_NAME:-your_default_app_name}"
LOCATION="${LOCATION:-EastAsia}"
APP_PLAN="${APP_PLAN:-your_default_app_plan}"

az group create --name $RESOURCE_GROUP --location $LOCATION
az appservice plan create --name $APP_PLAN --resource-group $RESOURCE_GROUP --sku B1 --is-linux
az webapp create --resource-group $RESOURCE_GROUP --plan $APP_PLAN --name $APP_NAME --runtime "node|14-lts"
az webapp config set --resource-group $RESOURCE_GROUP --name $APP_NAME --always-on true
az webapp deployment source config --name $APP_NAME --resource-group $RESOURCE_GROUP --repo-url your_repo_url --branch master
