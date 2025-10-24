import * as admin from 'firebase-admin';
import { Logger } from '../utils/logger';
import { config } from '../config';
import {
  InverterData,
  LogEntry,
  InverterChangeCallback,
  LogsChangeCallback,
  EnergyLimitChangeCallback
} from '../types';

export class FirebaseWatcherService {
  private db!: admin.database.Database;
  private logger: Logger;
  private watchers: admin.database.Reference[] = [];
  private isInitialized = false;

  // Callback functions - can be updated by user later
  private onInverterChange: InverterChangeCallback;
  private onLogsChange: LogsChangeCallback;
  private onEnergyLimitChange: EnergyLimitChangeCallback;

  constructor() {
    this.logger = new Logger(config.logLevel);
    
    // Default callback functions (user can override these)
    this.onInverterChange = this.defaultInverterCallback.bind(this);
    this.onLogsChange = this.defaultLogsCallback.bind(this);
    this.onEnergyLimitChange = this.defaultEnergyLimitCallback.bind(this);
  }

  // Initialize Firebase Admin SDK
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        this.logger.warn('Firebase service already initialized');
        return;
      }

      // Resolve the service account path
      const path = require('path');
      const serviceAccountPath = path.isAbsolute(config.firebaseConfig.serviceAccountPath) 
        ? config.firebaseConfig.serviceAccountPath
        : path.resolve(process.cwd(), config.firebaseConfig.serviceAccountPath);

      this.logger.debug(`Loading service account from: ${serviceAccountPath}`);

      // Check if file exists
      const fs = require('fs');
      if (!fs.existsSync(serviceAccountPath)) {
        throw new Error(`Firebase service account file not found at: ${serviceAccountPath}`);
      }

      // Initialize Firebase Admin
      const serviceAccount = require(serviceAccountPath);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: config.firebaseConfig.databaseURL
      });

      this.db = admin.database();
      this.isInitialized = true;
      
      this.logger.info('Firebase Admin SDK initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error as Error);
      throw error;
    }
  }

  // Start watching Firebase paths (only watch if callbacks are set)
  startWatching(): void {
    if (!this.isInitialized) {
      throw new Error('Service must be initialized before starting watchers');
    }

    this.logger.info('Starting Firebase watchers...');
    
    // Only start watchers if callbacks are set (not default callbacks)
    if (this.onInverterChange !== this.defaultInverterCallback) {
      this.watchInverter();
    } else {
      this.logger.debug('Inverter watcher skipped - no custom callback set');
    }

    if (this.onLogsChange !== this.defaultLogsCallback) {
      this.watchLogs();
    } else {
      this.logger.debug('Logs watcher skipped - no custom callback set');
    }

    if (this.onEnergyLimitChange !== this.defaultEnergyLimitCallback) {
      this.watchEnergyLimit();
    } else {
      this.logger.debug('Energy limit watcher skipped - no custom callback set');
    }

    this.logger.info('Firebase watchers started (conditional on callbacks)');
  }

  // Watch inverter data changes
  private watchInverter(): void {
    const inverterRef = this.db.ref('/inverter');
    
    inverterRef.on('value', (snapshot) => {
      try {
        const data = snapshot.val() as InverterData;
        if (data) {
          this.logger.debug('Inverter data changed');
          this.onInverterChange(data);
        }
      } catch (error) {
        this.logger.error('Error processing inverter data change', error as Error);
      }
    });


    this.watchers.push(inverterRef);
    this.logger.info('Inverter watcher started');
  }

  // Watch for new log entries
  private watchLogs(): void {
    const logsRef = this.db.ref('/logs');
    
    // Listen for child_added to catch new logs
    logsRef.on('child_added', (snapshot) => {
      try {
        const logId = snapshot.key;
        const logData = snapshot.val() as LogEntry;
        
        if (logId && logData) {
          this.logger.debug(`New log entry added: ${logId}`);
          this.onLogsChange(logData, logId);
        }
      } catch (error) {
        this.logger.error('Error processing new log entry', error as Error);
      }
    });


    this.watchers.push(logsRef);
    this.logger.info('Logs watcher started');
  }

  // Watch energy limit changes
  private watchEnergyLimit(): void {
    const energyLimitRef = this.db.ref('/energy_limit');
    
    energyLimitRef.on('value', (snapshot) => {
      try {
        const limit = snapshot.val() as number;
        if (typeof limit === 'number') {
          this.logger.debug('Energy limit changed');
          this.onEnergyLimitChange(limit);
        }
      } catch (error) {
        this.logger.error('Error processing energy limit change', error as Error);
      }
    });


    this.watchers.push(energyLimitRef);
    this.logger.info('Energy limit watcher started');
  }

  // Default callback functions (user can override these)
  private defaultInverterCallback(data: InverterData): void {
    this.logger.info(`Inverter update - Power: ${data.power}, Relay: ${data.relay}, Voltage: ${data.voltage}`);
    // TODO: User can replace this function with custom logic
  }

  private defaultLogsCallback(newLog: LogEntry, logId: string): void {
    this.logger.info(`New log [${logId}]: ${newLog.event} at ${newLog.time}`);
    // TODO: User can replace this function with custom logic
  }

  private defaultEnergyLimitCallback(limit: number): void {
    this.logger.info(`Energy limit updated to: ${limit} Wh`);
    // TODO: User can replace this function with custom logic
  }

  // Methods to set custom callback functions
  setInverterCallback(callback: InverterChangeCallback): void {
    this.onInverterChange = callback;
    this.logger.info('Custom inverter callback set');
  }

  setLogsCallback(callback: LogsChangeCallback): void {
    this.onLogsChange = callback;
    this.logger.info('Custom logs callback set');
  }

  setEnergyLimitCallback(callback: EnergyLimitChangeCallback): void {
    this.onEnergyLimitChange = callback;
    this.logger.info('Custom energy limit callback set');
  }

  // Stop all watchers and cleanup
  async stop(): Promise<void> {
    this.logger.info('Stopping Firebase watchers...');

    // Remove all listeners
    this.watchers.forEach(ref => {
      ref.off();
    });
    
    this.watchers = [];

    // Delete the Firebase app
    if (admin.apps.length > 0) {
      await admin.app().delete();
    }

    this.isInitialized = false;
    this.logger.info('Firebase watchers stopped and cleaned up');
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down Firebase Watcher Service...');
    await this.stop();
    this.logger.info('Firebase Watcher Service shutdown complete');
  }
}

export default FirebaseWatcherService;
