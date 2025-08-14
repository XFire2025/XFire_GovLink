# Quick AWS Credentials Setup

## Step 1: Sign into AWS Console
Go to: https://console.aws.amazon.com/

## Step 2: Create IAM User
1. Navigate to IAM → Users
2. Click "Create user"
3. Username: `govlink-github-actions`
4. Check "Provide user access to the AWS Management Console" (optional)
5. Click "Next"

## Step 3: Set Permissions
1. Select "Attach policies directly"
2. Search and select these policies:
   - AdministratorAccess (for simplicity, or use custom policy from aws-iam-policy.json)
3. Click "Next" → "Create user"

## Step 4: Create Access Keys
1. Click on the created user
2. Go to "Security credentials" tab
3. Click "Create access key"
4. Select "Command Line Interface (CLI)"
5. Click "Next" → "Create access key"
6. **SAVE THESE CREDENTIALS:**
   - Access Key ID: (starts with AKIA...)
   - Secret Access Key: (long random string)

## Step 5: Configure AWS CLI
Run: `aws configure`
Enter:
- Access Key ID: (from step 4)
- Secret Access Key: (from step 4)
- Region: us-east-1
- Output format: json
