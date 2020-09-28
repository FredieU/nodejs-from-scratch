const environments = {
  production: {
    envName: 'production',
    httpPort: 5000,
    httpsPort: 5001,
  },
  staging: {
    envName: 'staging',
    httpPort: 3000,
    httpsPort: 3001,
  },
};

const { NODE_ENV } = process.env;
const currentEnv = typeof NODE_ENV === 'string' ? NODE_ENV.toLowerCase() : '';

const config = environments[currentEnv] || environments.staging;

module.exports = config;
