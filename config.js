const environments = {
  production: {
    envName: 'production',
    port: 5000,
  },
  staging: {
    envName: 'staging',
    port: 3000,
  },
};

const nodeEnv = process.env.NODE_ENV.toLowerCase();
const currentEnv = typeof nodeEnv === 'string' ? nodeEnv : '';

const config = environments[currentEnv] || environments.staging;

module.exports = config;
