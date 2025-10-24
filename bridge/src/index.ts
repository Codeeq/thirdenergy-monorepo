import FirebaseWatcherService from './services/FirebaseWatcherService';
import HederaService from './services/HederaService';
import { Logger } from './utils/logger';
import { config } from './config';
import { InverterData, LogEntry } from './types';

const logger = new Logger(config.logLevel);
const watcherService = new FirebaseWatcherService();
const hederaService = new HederaService();
let currentEnergyLimit = 0; // Track current energy limit for Hedera messages

// Custom callback functions - Update these with your logic
async function handleInverterChange(data: InverterData): Promise<void> {
  try {
    console.log('🔌 Inverter data changed:', {
      power: data.power,
      voltage: data.voltage,
      relay: data.relay,
      energy: data.energy,
      current: data.current,
      frequency: data.frequency,
      pf: data.pf,
      energy_limit: data.energy_limit
    });
    
    // Submit to Hedera Consensus Service
    try {
      await hederaService.submitInverterData(data, currentEnergyLimit);
      logger.debug('✅ Inverter data submitted to Hedera successfully');
    } catch (hederaError) {
      logger.error('❌ Failed to submit to Hedera (will retry on next change)', hederaError as Error);
      // Don't throw - continue with other processing
    }
    
    // Example: Check if relay status changed
    if (data.relay === 'OFF') {
      console.log('⚠️  ALERT: Inverter relay is OFF!');
    }
    
    // Example: Check power threshold
    const powerValue = parseFloat(data.power.replace(' W', ''));
    if (powerValue > 1000) {
      console.log('⚡ HIGH POWER USAGE:', powerValue, 'W');
    }
  } catch (error) {
    logger.error('Error in handleInverterChange', error as Error);
  }
}

function handleNewLog(logEntry: LogEntry, logId: string): void {
  // TODO: Replace this with your custom logic
  console.log('📝 New log entry:', {
    id: logId,
    event: logEntry.event,
    time: logEntry.time
  });
  
  // Example: Check for specific events
  if (logEntry.event.includes('New recharge')) {
    console.log('🔋 RECHARGE EVENT DETECTED:', logEntry.event);
  }
  
  if (logEntry.event.includes('limit')) {
    console.log('⚠️  ENERGY LIMIT EVENT:', logEntry.event);
  }
}

function handleEnergyLimitChange(limit: number): void {
  // Update the tracked energy limit for Hedera messages
  currentEnergyLimit = limit;
  
  console.log('⚡ Energy limit updated:', limit, 'Wh');
  
  // Example: Alert if limit is low
  if (limit < 100) {
    console.log('🔴 LOW ENERGY LIMIT WARNING:', limit, 'Wh');
  }
}

// Graceful shutdown handler
async function gracefulShutdown(): Promise<void> {
  logger.info('Received shutdown signal...');
  try {
    await Promise.all([
      watcherService.shutdown(),
      hederaService.shutdown()
    ]);
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error as Error);
    process.exit(1);
  }
}

// Setup process signal handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('SIGQUIT', gracefulShutdown);

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  gracefulShutdown();
});

// Main function
async function main(): Promise<void> {
  try {
    logger.info('🚀 Starting Firebase Watcher Service with Hedera Integration...');
    
    // Initialize both services
    await Promise.all([
      watcherService.initialize(),
      hederaService.initialize()
    ]);
    
    // Set custom callback functions
    watcherService.setInverterCallback(handleInverterChange);
    watcherService.setLogsCallback(handleNewLog);
    watcherService.setEnergyLimitCallback(handleEnergyLimitChange);
    
    // Start watching Firebase
    watcherService.startWatching();
    
    logger.info('✅ Firebase Watcher Service is running and monitoring...');
    logger.info('🔍 Watching: /inverter, /logs, /energy_limit');
    logger.info(`🌐 Hedera Network: ${config.hederaConfig.network}`);
    logger.info(`📋 Default Topic ID: ${config.hederaConfig.defaultTopicId}`);
    logger.info(`🏭 Station ID: ${config.hederaConfig.defaultStationId}`);
    logger.info('⏹️  Press Ctrl+C to stop');
    
    // Keep the process running
    process.stdin.resume();
    
  } catch (error) {
    logger.error('Failed to start Firebase Watcher Service', error as Error);
    process.exit(1);
  }
}

// Start the service
main().catch((error) => {
  logger.error('Fatal error in main function', error as Error);
  process.exit(1);
});
