# ThirdEnergy Firebase Watcher Service with Hedera Integration

A TypeScript background service that watches Firebase Realtime Database changes for inverter data, logs, and energy limits, and automatically submits telemetry data to Hedera Consensus Service.

## Features

- 🔄 **Real-time monitoring** of Firebase Realtime Database
- 🔌 **Separate watchers** for inverter, logs, and energy_limit paths
- 📝 **Comprehensive logging** with configurable levels
- 🌐 **Hedera Consensus Service integration** for immutable telemetry logging
- 📊 **Automatic message transformation** from Firebase to Hedera format
- 🏭 **Station-based telemetry** with configurable station ID
- 🔐 **Conditional path watching** (only watches when callbacks are set)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

#### Step 1: Create a Firebase Service Account

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **Service Accounts**
4. Click **"Generate New Private Key"**
5. Download the JSON file and save it as `firebase-service-account.json` in your project root

#### Step 2: Get Your Database URL

1. In Firebase Console, go to **Realtime Database**
2. Copy your database URL (looks like: `https://your-project-default-rtdb.firebaseio.com/`)

#### Step 3: Configure Environment Variables

Update the `.env` file with your Firebase configuration:

```env
# Firebase Configuration
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Service Configuration
NODE_ENV=development
LOG_LEVEL=info
```

### 3. Hedera Setup (Optional)

#### Step 1: Configure Hedera Credentials

Add your Hedera operator credentials to the `.env` file:

```env
# Hedera Configuration
HEDERA_OPERATOR_ID=0.0.6880079
HEDERA_OPERATOR_KEY=bc26b840747e43c058f87d87ca176e069b213df5a56b286f1e97770044bfe1ef
HEDERA_NETWORK=testnet
DEFAULT_STATION_ID=3e.0.0.6864361
DEFAULT_TOPIC_ID=3e.0.0.6864361
```

#### Step 2: Create Hedera Topic (Optional)

If you need to create a new topic:

```bash
npm run create-topic
```

This will create a new Hedera Consensus Service topic and display the topic ID to update in your `.env` file.

### 4. Build and Run

```bash
# Build the project
npm run build

# Run the service
npm start

# Or run in development mode
npm run dev
```

## Project Structure

```
├── src/
│   ├── config/           # Configuration management
│   ├── services/         # Firebase watcher service
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Logger utilities
│   └── index.ts         # Main application entry
├── dist/                # Compiled JavaScript
├── .env                 # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Customizing Callback Functions

The service monitors three Firebase paths and calls specific functions when data changes:

### 1. Inverter Data Changes

Edit the `handleInverterChange` function in `src/index.ts`:

```typescript
function handleInverterChange(data: InverterData): void {
  // Your custom logic here
  if (data.relay === "OFF") {
    // Handle relay OFF event
    sendAlert("Inverter relay is OFF!");
  }

  const powerValue = parseFloat(data.power.replace(" W", ""));
  if (powerValue > 1000) {
    // Handle high power usage
    logHighPowerUsage(powerValue);
  }
}
```

### 2. New Log Entries

Edit the `handleNewLog` function in `src/index.ts`:

```typescript
function handleNewLog(logEntry: LogEntry, logId: string): void {
  // Your custom logic here
  if (logEntry.event.includes("New recharge")) {
    // Handle recharge events
    processRechargeEvent(logEntry);
  }

  if (logEntry.event.includes("limit")) {
    // Handle energy limit events
    handleEnergyLimitAlert(logEntry);
  }
}
```

### 3. Energy Limit Changes

Edit the `handleEnergyLimitChange` function in `src/index.ts`:

```typescript
function handleEnergyLimitChange(limit: number): void {
  // Your custom logic here
  if (limit < 100) {
    // Handle low energy limit
    sendLowEnergyAlert(limit);
  }

  // Update external systems
  updateEnergyLimitInExternalSystem(limit);
}
```

## Data Types

The service uses TypeScript interfaces based on your Firebase data structure:

```typescript
interface InverterData {
  current: string; // "0.032 A"
  energy: string; // "0.000 Wh"
  energy_limit: string; // "0 Wh"
  frequency: string; // "50.00 Hz"
  pf: string; // "0.15"
  power: string; // "1.00 W"
  relay: string; // "ON" | "OFF"
  voltage: string; // "214.50 V"
}

interface LogEntry {
  event: string; // "Data: 0.0Wh used / 0Wh limit"
  time: string; // "2025-09-08 07:02:55"
}
```

## Configuration

### Environment Variables

- `FIREBASE_DATABASE_URL`: Your Firebase Realtime Database URL
- `FIREBASE_SERVICE_ACCOUNT_PATH`: Path to your service account JSON file
- `NODE_ENV`: Environment mode (`development` | `production`)
- `LOG_LEVEL`: Logging level (`debug` | `info` | `warn` | `error`)

### Logging Levels

- **debug**: All messages
- **info**: Info, warnings, and errors
- **warn**: Warnings and errors only
- **error**: Errors only

## Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the compiled service
- `npm run dev`: Run in development mode with ts-node
- `npm run watch`: Watch for changes and recompile
- `npm run clean`: Remove compiled files

## Monitoring Firebase Paths

The service watches these Firebase paths:

- `/inverter` - Inverter status and measurements
- `/logs` - New log entries (using `child_added` listener)
- `/energy_limit` - Energy limit changes

## Error Handling

- Automatic reconnection on Firebase connection loss
- Graceful shutdown on process signals (SIGTERM, SIGINT, SIGQUIT)
- Comprehensive error logging
- Process cleanup on uncaught exceptions

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start the service
pm2 start dist/index.js --name firebase-watcher

# Monitor
pm2 logs firebase-watcher
pm2 monit
```

## Security Notes

- Keep your `firebase-service-account.json` file secure
- Add it to `.gitignore` to avoid committing credentials
- Use environment variables for sensitive configuration
- Ensure your Firebase database has proper security rules

## Troubleshooting

### Common Issues

1. **"Failed to initialize Firebase Admin SDK"**

   - Check if `firebase-service-account.json` exists and is valid
   - Verify the `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env`

2. **"Permission denied" errors**

   - Check Firebase database security rules
   - Ensure service account has proper permissions

3. **Connection timeout**
   - Verify `FIREBASE_DATABASE_URL` is correct
   - Check network connectivity

### Debug Mode

Set `LOG_LEVEL=debug` in `.env` to see detailed logs:

```env
LOG_LEVEL=debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License
