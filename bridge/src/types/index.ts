// Firebase data type definitions based on example.json

export interface InverterData {
  current: string;
  energy: string;
  energy_limit: string;
  frequency: string;
  pf: string;
  power: string;
  relay: string;
  voltage: string;
}

export interface LogEntry {
  event: string;
  time: string;
}

export interface LogsData {
  [key: string]: LogEntry;
}

export interface FirebaseData {
  energy_limit: number;
  inverter: InverterData;
  logs: LogsData;
}

// Hedera message types
export interface HederaMessage {
  v: number;
  station_id: string;
  ts: number; // timestamp
  kind: 'telemetry';
  metrics: {
    v: number;   // voltage
    i: number;   // current
    p: number;   // power
    e_wh: number; // energy
    f: number;   // frequency
    pf: number;  // power_factor
  };
  state: {
    relay: boolean;
    limit_wh: number; // energy_limit
  };
}

// Configuration types
export interface ServiceConfig {
  firebaseConfig: {
    databaseURL: string;
    serviceAccountPath: string;
  };
  hederaConfig: {
    operatorId: string;
    operatorKey: string;
    network: 'testnet' | 'mainnet';
    defaultStationId: string;
    defaultTopicId: string;
  };
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  nodeEnv: 'development' | 'production';
}

// Callback function types
export type InverterChangeCallback = (data: InverterData) => void | Promise<void>;
export type LogsChangeCallback = (newLog: LogEntry, logId: string) => void;
export type EnergyLimitChangeCallback = (limit: number) => void;
