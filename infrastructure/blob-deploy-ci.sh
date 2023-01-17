#!/usr/bin/env sh
#
# Usage:
#     infrastructure/fe-deploy-ci.sh <environmentname> [<subscription>]
#
#   The environment which should be deployed to must already exist.
#   It can be created with the `infrastucture/fe-create-environment.sh` script.
#
# Example:
#     infrastructure/fe-deploy-ci.sh dev


# Abort on failures
set -e

# Always run from `{scriptlocation}/..`, one level up from `infrastucture`. (frontend root)
cd "$(dirname "$0")/.."

# Input and variables
env=${1:?}
sub=${2:-'mr-creative-tech'}
group_env="rg-mf-demo-${env}"

endpoint="https://stremoteb${env}.z6.web.core.windows.net/"

# Alias for running azure-cli in a container
alias az_cli_container='docker run -t --rm -v "${HOME}/.ssh:/root/.ssh" -v "${HOME}/.azure:/root/.azure" -w "/root/" mcr.microsoft.com/azure-cli:2.34.1'
alias az_cli_container_with_build='docker run -t --rm -v "${HOME}/.ssh:/root/.ssh" -v "${HOME}/.azure:/root/.azure" -v "${PWD}/out:/root/out" -w "/root/" mcr.microsoft.com/azure-cli:2.34.1'


# Print az cli version
az_cli_container az --version

# Login to azure if required
if ! az_cli_container az account show > /dev/null
then
    echo "ABORTING: Azure login must be done before deployment"
    exit 1
fi
az_cli_container az account set --subscription "$sub" > /dev/null
echo "Subscription: $(az_cli_container az account show --query 'name' --output tsv)"
echo "ResourceGroup: $group_env"

# Verify static website enabled
enabled=$(
    az_cli_container az storage blob service-properties show \
        --auth-mode login \
        --account-name "stremoteb$env" \
        --query 'staticWebsite.enabled' \
    | tr -d '\r\n'
)
if [ "$enabled" != 'true' ]
then
    echo "ABORTING: az storage for 'stremoteb$env' is not a static website"
    exit 1
fi

yarn install

yarn build

# Upload
az_cli_container_with_build az storage blob upload-batch \
    --account-name "stremoteb$env"  \
    --auth-mode key \
    --source ./dist \
    --destination '$web' \
    --pattern '*' \
    --output table \
    --overwrite true

# Print success with endpoint
echo
echo "Sucessfully deployed to environment"
echo "> $endpoint"
