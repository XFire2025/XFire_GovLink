#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { OpenNextStack } from '@opennextjs/aws';

const app = new cdk.App();

new OpenNextStack(app, 'GovLinkStack', {
  openNextPath: './.open-next',
  env: {
    region: process.env.AWS_REGION || 'us-east-1',
  },
});
