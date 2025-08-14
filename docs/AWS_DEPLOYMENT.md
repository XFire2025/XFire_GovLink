# AWS Deployment Guide for GovLink

This guide will help you deploy the GovLink application to AWS using OpenNext.

## Prerequisites

1. **AWS Account** - Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI** - Install from [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
3. **GitHub Repository** with Actions enabled

## Option 1: Automated Setup (Requires AWS CLI)

### Install AWS CLI
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Configure AWS CLI
```bash
aws configure
```

### Run Setup Script
```bash
./scripts/setup-aws.sh
```

## Option 2: Manual Setup (No AWS CLI Required)

### Step 2a: Create IAM User Manually

1. Go to [AWS Console → IAM → Users](https://console.aws.amazon.com/iam/home#/users)
2. Click "Create user"
3. User name: `govlink-github-actions`
4. Select "Programmatic access"
5. Click "Next"

### Step 2b: Attach Permissions

1. Click "Attach policies directly"
2. Create a custom policy with these permissions:
   - `AmazonS3FullAccess`
   - `CloudFormationFullAccess`
   - `AWSLambda_FullAccess`
   - `CloudFrontFullAccess`
   - `AmazonAPIGatewayAdministrator`
   - `IAMFullAccess`
3. Or use the policy from `aws-iam-policy.json`

### Step 2c: Generate Access Keys

1. Go to the user's "Security credentials" tab
2. Click "Create access key"
3. Choose "Application running outside AWS"
4. Save the Access Key ID and Secret Access Key

## Step 3: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and Variables → Actions
3. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | Access key from the setup script |
| `AWS_SECRET_ACCESS_KEY` | Secret key from the setup script |

## Step 4: Configure Environment Variables (Optional)

If your application uses environment variables, add them as GitHub secrets:

```
MONGODB_URI
JWT_SECRET
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASS
```

## Step 5: Deploy

Push your code to the `main` or `CI-CD` branch to trigger deployment:

```bash
git add .
git commit -m "Deploy to AWS"
git push origin main
```

## Architecture Overview

OpenNext will create the following AWS resources:

- **Lambda Functions** - For server-side rendering and API routes
- **CloudFront Distribution** - For global content delivery
- **S3 Buckets** - For static assets and build artifacts
- **API Gateway** - For routing requests
- **CloudFormation Stack** - For infrastructure management

## Monitoring and Troubleshooting

### View Logs
```bash
# View Lambda logs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/

# View CloudFormation events
aws cloudformation describe-stack-events --stack-name your-stack-name
```

### Common Issues

1. **IAM Permissions**: Ensure the deployment user has all required permissions
2. **Region Mismatch**: Verify AWS region consistency across configuration
3. **Build Failures**: Check GitHub Actions logs for build errors

## Updating the Application

To update your deployed application:

1. Make your changes
2. Commit and push to the main branch
3. GitHub Actions will automatically build and deploy

## Cleanup

To remove all AWS resources:

```bash
# List CloudFormation stacks
aws cloudformation list-stacks --query "StackSummaries[?contains(StackName, 'govlink')].StackName"

# Delete the stack
aws cloudformation delete-stack --stack-name your-stack-name
```

## Cost Optimization

- **Lambda**: Pay per request (very cost-effective for typical usage)
- **CloudFront**: Free tier includes 1TB of data transfer
- **S3**: Minimal costs for static asset storage
- **API Gateway**: Pay per API call

Expected monthly cost for moderate traffic: $5-20 USD

## Security Best Practices

1. Rotate access keys regularly
2. Use least-privilege IAM policies
3. Enable CloudTrail for audit logging
4. Set up billing alerts
5. Use environment-specific deployments

## Support

For issues with:
- **OpenNext**: [OpenNext GitHub Repository](https://github.com/serverless-stack/open-next)
- **AWS**: [AWS Support](https://aws.amazon.com/support/)
- **GitHub Actions**: [GitHub Actions Documentation](https://docs.github.com/en/actions)
