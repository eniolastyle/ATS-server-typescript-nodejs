#!/bin/bash

set -eux

APP_NAME=$1
VERSION=$2
IMAGE=$3
DEPLOYMENTFILE=$4
NAMESPACE=default
DEPLOYMENTNAME=$APP_NAME-$VERSION

cat $DEPLOYMENTFILE > deployment-$VERSION.yml

sed -i "s|VERSION|$VERSION|g" deployment-$VERSION.yml
sed -i "s|APP_NAME|$APP_NAME|g" deployment-$VERSION.yml
sed -i "s|IMAGE|$IMAGE|g" deployment-$VERSION.yml

# Deploy app
kubectl apply -f deployment-$VERSION.yml -n $NAMESPACE

# Deployment manifest is no longer needed.
rm deployment-$VERSION.yml

# Wait until the Deployment is ready by checking the MinimumReplicasAvailable condition.
READY=$(kubectl get deploy $DEPLOYMENTNAME -n $NAMESPACE -o json | jq '.status.conditions[] | select(.reason == "MinimumReplicasAvailable") | .status' | tr -d '"')
while [[ "$READY" != "True" ]]; do
    READY=$(kubectl get deploy $DEPLOYMENTNAME -n $NAMESPACE -o json | jq '.status.conditions[] | select(.reason == "MinimumReplicasAvailable") | .status' | tr -d '"')
    sleep 5
done    

# If service exists, patch it. If not, create it.
if kubectl get svc -n $NAMESPACE $APP_NAME ; then
    kubectl patch svc -n $NAMESPACE $APP_NAME -p "{\"spec\":{\"selector\": {\"app\": \"${APP_NAME}\", \"version\": \"${VERSION}\"}}}"
    kubectl patch svc -n $NAMESPACE $APP_NAME -p "{\"metadata\":{\"labels\": {\"app\": \"${APP_NAME}\", \"version\": \"${VERSION}\"}}}"
else
    kubectl expose deployment $DEPLOYMENTNAME --type=LoadBalancer --name=$APP_NAME --port=80 --target-port=5000 -n $NAMESPACE
fi

echo "Blue/green deployment of $APP_NAME (version $VERSION) completed successfully."
