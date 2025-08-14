#!/bin/bash

# AWS Setup Script for GovLink Deployment
# This script helps you set up AWS resources for OpenNext deployment

echo "🚀 GovLink AWS Setup Script"
echo "================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

echo "✅ AWS CLI is installed"

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first"
    exit 1
fi

echo "✅ AWS CLI is configured"

# Get current AWS account and region
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)

echo "📋 Current AWS Configuration:"
echo "   Account ID: $ACCOUNT_ID"
echo "   Region: $REGION"

# Create S3 bucket for deployment artifacts (if it doesn't exist)
BUCKET_NAME="govlink-deployment-${ACCOUNT_ID}-${REGION}"
echo ""
echo "🪣 Creating S3 bucket for deployment artifacts..."

if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    if [ "$REGION" = "us-east-1" ]; then
        aws s3 mb s3://$BUCKET_NAME
    else
        aws s3 mb s3://$BUCKET_NAME --region $REGION
    fi
    echo "✅ Created S3 bucket: $BUCKET_NAME"
else
    echo "✅ S3 bucket already exists: $BUCKET_NAME"
fi

# Enable versioning on the bucket
aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Enabled
echo "✅ Enabled versioning on S3 bucket"

# Create IAM user for GitHub Actions (if it doesn't exist)
USER_NAME="govlink-github-actions"
echo ""
echo "👤 Setting up IAM user for GitHub Actions..."

if aws iam get-user --user-name $USER_NAME &> /dev/null; then
    echo "✅ IAM user already exists: $USER_NAME"
else
    aws iam create-user --user-name $USER_NAME
    echo "✅ Created IAM user: $USER_NAME"
fi

# Attach policy to user
POLICY_ARN="arn:aws:iam::${ACCOUNT_ID}:policy/GovLinkDeploymentPolicy"

# Create custom policy if it doesn't exist
if ! aws iam get-policy --policy-arn $POLICY_ARN &> /dev/null; then
    aws iam create-policy \
        --policy-name GovLinkDeploymentPolicy \
        --policy-document file://aws-iam-policy.json
    echo "✅ Created IAM policy: GovLinkDeploymentPolicy"
else
    echo "✅ IAM policy already exists: GovLinkDeploymentPolicy"
fi

# Attach policy to user
aws iam attach-user-policy --user-name $USER_NAME --policy-arn $POLICY_ARN
echo "✅ Attached policy to user"

# Create access keys for the user
echo ""
echo "🔑 Creating access keys for GitHub Actions..."
ACCESS_KEY_OUTPUT=$(aws iam create-access-key --user-name $USER_NAME 2>/dev/null)

if [ $? -eq 0 ]; then
    ACCESS_KEY_ID=$(echo $ACCESS_KEY_OUTPUT | jq -r '.AccessKey.AccessKeyId')
    SECRET_ACCESS_KEY=$(echo $ACCESS_KEY_OUTPUT | jq -r '.AccessKey.SecretAccessKey')
    
    echo "✅ Created access keys successfully!"
    echo ""
    echo "🔐 GitHub Secrets to Add:"
    echo "========================"
    echo "AWS_ACCESS_KEY_ID: $ACCESS_KEY_ID"
    echo "AWS_SECRET_ACCESS_KEY: $SECRET_ACCESS_KEY"
    echo ""
    echo "⚠️  IMPORTANT: Save these credentials securely and add them to your GitHub repository secrets!"
    echo "   Go to: GitHub Repository → Settings → Secrets and Variables → Actions"
else
    echo "⚠️  Access keys may already exist for this user. Check IAM console or delete existing keys first."
fi

echo ""
echo "📝 Next Steps:"
echo "=============="
echo "1. Add the AWS credentials to your GitHub repository secrets"
echo "2. Update the AWS region in your GitHub Actions workflow if needed (currently: us-east-1)"
echo "3. Commit your changes and push to trigger deployment"
echo ""
echo "🎉 AWS setup complete!"
