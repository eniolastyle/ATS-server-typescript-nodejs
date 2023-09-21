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
# rm deployment-$VERSION.yml

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

# Delete old deployments with different versions
OLD_DEPLOYMENTS=$(kubectl get deployments -n $NAMESPACE -l app=$APP_NAME -o jsonpath='{.items[?(@.metadata.labels.version!="'$VERSION'")].metadata.name}' 2>/dev/null || true)
# Get the old image from the current deployment
OLD_IMAGE=$(kubectl get deployment $DEPLOYMENTNAME -n $NAMESPACE -o json | jq -r '.spec.template.spec.containers[0].image' 2>/dev/null || true)


echo "Deleting old deployment of $OLD_DEPLOYMENTS."
for DEPLOYMENT in $OLD_DEPLOYMENTS; do
    kubectl delete deployment $DEPLOYMENT -n $NAMESPACE
done

# Create a blue manifest for ugent rollback
OLD_VERSION=$(echo "$OLD_DEPLOYMENTS" | head -n 1)
mv deployment-$VERSION.yml blue-deployment-$OLD_VERSION.yml

sed -i "s|$VERSION|$OLD_VERSION|g" blue-deployment-$OLD_VERSION.yml
sed -i "s|$IMAGE|$OLD_IMAGE|g" blue-deployment-$OLD_VERSION.yml

rm -f ./k8s/blue-deployment-*.yml || true
cp blue-deployment-$OLD_VERSION.yml ./k8s/


echo "Blue/green deployment of $APP_NAME (version $VERSION) completed successfully."
