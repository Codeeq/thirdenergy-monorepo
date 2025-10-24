import * as dotenv from 'dotenv';
import { ServiceConfig } from '../types';

// Load environment variables
dotenv.config();

export const config: ServiceConfig = {
  firebaseConfig: {
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://your-project-default-rtdb.firebaseio.com/',
    serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json',
  },
  hederaConfig: {
    operatorId: process.env.HEDERA_OPERATOR_ID || '0.0.6880079',
    operatorKey: process.env.HEDERA_OPERATOR_KEY || '',
    network: (process.env.HEDERA_NETWORK as 'testnet' | 'mainnet') || 'testnet',
    defaultStationId: process.env.DEFAULT_STATION_ID || '3e.0.0.6864361',
    defaultTopicId: process.env.DEFAULT_TOPIC_ID || '3e.0.0.6864361',
  },
  logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production') || 'development',
};

export default config;
