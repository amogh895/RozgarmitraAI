import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  dbPath: process.env.DB_PATH || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // IBM watsonx.ai — loaded lazily so app starts even without credentials
  watsonx: {
    apiKey: process.env.WATSONX_API_KEY || '',
    projectId: process.env.WATSONX_PROJECT_ID || '',
    serviceUrl: process.env.WATSONX_SERVICE_URL || 'https://us-south.ml.cloud.ibm.com',
    modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-3-3-8b-instruct',
    iamTokenUrl: 'https://iam.cloud.ibm.com/identity/token',
  },

  isProduction(): boolean {
    return this.nodeEnv === 'production';
  },

  hasWatsonxCredentials(): boolean {
    return !!(this.watsonx.apiKey && this.watsonx.projectId);
  },
};
