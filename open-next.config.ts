const config = {
  default: {
    // Override the default lambda function configuration
    override: {
      wrapper: 'aws-lambda-streaming',
      converter: 'aws-apigw-v2',
      // Increase memory for better performance
      memory: 1024,
      // Set timeout (max 15 minutes for Lambda)
      timeout: 30,
    },
  },
  buildCommand: 'npm run build',
  appPath: './',
  // Configure for AWS deployment
  deployment: {
    // Use CloudFormation for infrastructure
    type: 'aws',
  },
  // Configure edge functions if needed
  edge: {
    // Override edge function configuration
    override: {
      memory: 128,
      timeout: 30,
    },
  },
  // Configure middleware
  middleware: {
    override: {
      memory: 128,
      timeout: 30,
    },
  },
  // Configure image optimization
  imageOptimization: {
    override: {
      memory: 1024,
      timeout: 30,
    },
  },
};

export default config;
