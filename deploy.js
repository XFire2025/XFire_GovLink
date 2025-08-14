#!/usr/bin/env node
const cdk = require('aws-cdk-lib');
const { OpenNextStack } = require('@opennextjs/aws');

const app = new cdk.App();

new OpenNextStack(app, 'GovLinkStack', {
  openNextPath: './.open-next',
  env: {
    region: process.env.AWS_REGION || 'us-east-1',
  },
});