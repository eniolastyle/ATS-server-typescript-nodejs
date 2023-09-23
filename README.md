# Blue-Green Deployment to Kubernetes Demo

This repository serves as a demonstration of implementing blue-green deployment to Kubernetes using continuous integration and continuous deployment (CI/CD) pipelines. The goal is to showcase a workflow that automates the deployment process, including building the application, pushing the image to Google Artifact Registry, and deploying the application to a Google Kubernetes Engine (GKE) cluster.

![bg](https://github.com/eniolastyle/ATS-server-typescript-nodejs/assets/58726365/45a7b6df-56e1-42db-b5d0-4ef4e0de612d)

Image Credits: https://www.ianlewis.org/

## What is Blue-Green Deployment

A blue-green deployment is a software release strategy and deployment methodology used in the world of DevOps and continuous delivery to minimize downtime and reduce the risk associated with deploying new versions of an application.

## Requirements

Before you get started, ensure you have the following prerequisites:

- **Google Cloud Platform (GCP) Account and Project**: You'll need a GCP account and a project to host your GKE cluster.

- **GKE Cluster, Artifact Registry Repository, and Service Account**: You should have a GKE cluster set up, an Artifact Registry repository configured, and a Service Account with appropriate permissions. You can use the [Terraform provisioning repository](https://github.com/eniolastyle/ATS-GKE-Terraform) to provision these requirements automatically.

## How It Works

This repository automates the blue-green deployment process using GitHub Actions. Here's how it works:

1. **Push to the `main` Branch**: When you push changes to the `main` branch, a GitHub Actions workflow is triggered.

2. **Build the Application**: The workflow builds the application and prepares it for deployment.

3. **Push to Artifact Registry**: The application image is pushed to Google Artifact Registry, making it accessible for deployment.

4. **Deploy to GKE**: The `./scripts/deploy.sh` script is executed with four parameters:
   - `APP_NAME`: The name of your application.
   - `VERSION`: The version/tag of the application image.
   - `IMAGE`: The location of the application image in Artifact Registry.
   - `DEPLOYMENTFILE`: The path to the Kubernetes deployment manifest template (`./k8s/deploy.tmpl`).

5. **Blue-Green Deployment on GKE**: The script uses the Kubernetes deployment manifest template to create a green deployment on the GKE cluster. It waits until the deployment is successful and all pods are ready.

6. **Service Switch**: If a service exists, the script patches it to switch to the new (green) version of the app. If not, it creates the service.

7. **Cleanup**: Finally, the script deletes old (blue) deployments to ensure a clean environment.

## Deployment Steps

To deploy your application using this repository, follow these steps:

1. **Clone or Fork the Repository**: Clone or fork this repository to your GitHub account or your local machine.

2. **Provide Environment Secrets**: Configure the necessary environment secrets for the GitHub Actions workflow. These secrets typically include credentials and configuration for GCP, GKE, and Artifact Registry.

3. **Make Changes and Push**: Customize the application as needed and commit your changes to the `main` branch. Pushing your changes will trigger the GitHub Actions workflow, and you should see your application deployed with blue-green deployment on your GKE cluster.

Feel free to explore and modify this repository to suit your specific requirements. Happy deploying! 🚀
