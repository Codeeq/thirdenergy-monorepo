import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicId,
  AccountId,
  PrivateKey,
  TransactionResponse,
  TransactionReceipt
} from '@hashgraph/sdk';
import { Logger } from '../utils/logger';
import { config } from '../config';
import { HederaMessage, InverterData } from '../types';

export class HederaService {
  private client!: Client;
  private logger: Logger;
  private isInitialized = false;

  constructor() {
    this.logger = new Logger(config.logLevel);
  }

  // Initialize Hedera client
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        this.logger.warn('Hedera service already initialized');
        return;
      }

      // Validate operator credentials
      if (!config.hederaConfig.operatorId || !config.hederaConfig.operatorKey) {
        throw new Error('Hedera operator credentials not configured');
      }

      // Create client for testnet or mainnet
      this.client = config.hederaConfig.network === 'testnet' 
        ? Client.forTestnet() 
        : Client.forMainnet();

      // Set operator
      const operatorId = AccountId.fromString(config.hederaConfig.operatorId);
      const operatorKey = PrivateKey.fromStringECDSA(config.hederaConfig.operatorKey);
      
      this.client.setOperator(operatorId, operatorKey);

      this.isInitialized = true;
      this.logger.info(`Hedera client initialized for ${config.hederaConfig.network}`);
    } catch (error) {
      this.logger.error('Failed to initialize Hedera client', error as Error);
      throw error;
    }
  }

  // Create a new topic
  async createTopic(memo?: string): Promise<TopicId> {
    try {
      if (!this.isInitialized) {
        throw new Error('Hedera service not initialized');
      }

      this.logger.info('Creating new Hedera topic...');

      const transaction = new TopicCreateTransaction()
        .setTopicMemo(memo || 'ThirdEnergy Station Topic');

      const txResponse: TransactionResponse = await transaction.execute(this.client);
      const receipt: TransactionReceipt = await txResponse.getReceipt(this.client);
      
      const topicId = receipt.topicId!;
      
      this.logger.info(`Topic created successfully: ${topicId.toString()}`);
      return topicId;
    } catch (error) {
      this.logger.error('Failed to create topic', error as Error);
      throw error;
    }
  }

  // Submit message to topic
  async submitMessage(topicId: string | TopicId, message: HederaMessage): Promise<void> {
    try {
      if (!this.isInitialized) {
        throw new Error('Hedera service not initialized');
      }

      // Convert string to TopicId if needed
      const topic = typeof topicId === 'string' ? TopicId.fromString(topicId) : topicId;
      
      // Convert message to JSON string
      const messageJson = JSON.stringify(message);
      
      this.logger.debug(`Submitting message to topic ${topic.toString()}: ${messageJson}`);

      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topic)
        .setMessage(messageJson);

      await transaction.execute(this.client);
      
      this.logger.debug(`Message submitted to topic ${topic.toString()}`);
    } catch (error) {
      this.logger.error('Failed to submit message to topic', error as Error);
      throw error;
    }
  }

  // Transform Firebase inverter data to Hedera message format
  transformInverterData(inverterData: InverterData, energyLimit?: number): HederaMessage {
    // Parse string values to numbers
    const voltage = parseFloat(inverterData.voltage.replace(' V', ''));
    const current = parseFloat(inverterData.current.replace(' A', ''));
    const power = parseFloat(inverterData.power.replace(' W', ''));
    const energy = parseFloat(inverterData.energy.replace(' Wh', ''));
    const frequency = parseFloat(inverterData.frequency.replace(' Hz', ''));
    const powerFactor = parseFloat(inverterData.pf);
    const relayStatus = inverterData.relay === 'ON';
    const limitWh = energyLimit || parseFloat(inverterData.energy_limit.replace(' Wh', ''));

    return {
      v: 1,
      station_id: config.hederaConfig.defaultStationId,
      ts: Math.floor(Date.now() / 1000), // Current timestamp
      kind: 'telemetry',
      metrics: {
        v: voltage,
        i: current,
        p: power,
        e_wh: energy,
        f: frequency,
        pf: powerFactor
      },
      state: {
        relay: relayStatus,
        limit_wh: limitWh
      }
    };
  }

  // Submit inverter data as Hedera message
  async submitInverterData(inverterData: InverterData, energyLimit?: number): Promise<void> {
    try {
      const message = this.transformInverterData(inverterData, energyLimit);
      await this.submitMessage(config.hederaConfig.defaultTopicId, message);
      
      this.logger.info(`Inverter telemetry submitted: Power=${message.metrics.p}W, Relay=${message.state.relay}`);
    } catch (error) {
      this.logger.error('Failed to submit inverter data to Hedera', error as Error);
      throw error;
    }
  }

  // Close the client
  close(): void {
    if (this.client) {
      this.client.close();
      this.isInitialized = false;
      this.logger.info('Hedera client closed');
    }
  }

  // Shutdown
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down Hedera Service...');
    this.close();
    this.logger.info('Hedera Service shutdown complete');
  }
}

export default HederaService;
