#!/usr/bin/env ts-node

import { HederaService } from '../src/services/HederaService';
import { Logger } from '../src/utils/logger';
import { config } from '../src/config';

async function createDefaultTopic() {
  const logger = new Logger(config.logLevel);
  const hederaService = new HederaService();

  try {
    logger.info('🚀 Starting topic creation script...');
    
    // Initialize Hedera service
    await hederaService.initialize();
    
    // Create the default topic
    const topicId = await hederaService.createTopic(config.hederaConfig.defaultStationId);
    
    logger.info(`✅ Default topic created successfully!`);
    logger.info(`📋 Topic ID: ${topicId.toString()}`);
    logger.info(`🏭 Station ID: ${config.hederaConfig.defaultStationId}`);
    logger.info(`🌐 Network: ${config.hederaConfig.network}`);
    
    // Update environment variable suggestion
    logger.info('\n📝 Update your .env file with the new topic ID:');
    logger.info(`DEFAULT_TOPIC_ID=${topicId.toString()}`);
    
  } catch (error) {
    logger.error('❌ Failed to create topic', error as Error);
    process.exit(1);
  } finally {
    // Cleanup
    await hederaService.shutdown();
    logger.info('🔒 Topic creation script completed');
  }
}

// Run the script
createDefaultTopic().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
