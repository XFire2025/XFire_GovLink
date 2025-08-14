#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import { Function, Runtime, Code, FunctionUrl, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin, HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

class GovLinkStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create S3 bucket for static assets
    const assetsBucket = new Bucket(this, 'GovLinkAssets', {
      accessControl: BucketAccessControl.PRIVATE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create Lambda function for server-side rendering
    const serverFunction = new Function(this, 'GovLinkServerFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromAsset('./.open-next/server-functions/default'),
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      environment: {
        BUCKET_NAME: assetsBucket.bucketName,
      },
    });

    // Create Function URL for the Lambda
    const functionUrl = new FunctionUrl(this, 'GovLinkFunctionUrl', {
      function: serverFunction,
      authType: FunctionUrlAuthType.NONE,
    });

    // Grant the Lambda function read/write access to the S3 bucket
    assetsBucket.grantReadWrite(serverFunction);

    // Deploy static assets to S3
    new BucketDeployment(this, 'GovLinkAssetsDeployment', {
      sources: [Source.asset('./.open-next/assets')],
      destinationBucket: assetsBucket,
    });

    // Create CloudFront distribution
    const distribution = new Distribution(this, 'GovLinkDistribution', {
      defaultBehavior: {
        origin: new HttpOrigin(cdk.Fn.select(2, cdk.Fn.split('/', functionUrl.url))),
      },
      additionalBehaviors: {
        '/_next/static/*': {
          origin: new S3BucketOrigin(assetsBucket),
        },
        '/static/*': {
          origin: new S3BucketOrigin(assetsBucket),
        },
      },
    });

    // Output the CloudFront URL
    new cdk.CfnOutput(this, 'DistributionUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    // Output the Function URL (for direct access)
    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: functionUrl.url,
      description: 'Lambda Function URL',
    });
  }
}

const app = new cdk.App();

new GovLinkStack(app, 'GovLinkStack', {
  env: {
    region: process.env.AWS_REGION || 'us-east-1',
  },
});
