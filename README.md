# Remote Logger

[![npm version](https://img.shields.io/npm/v/@remote-logger/logger?style=for-the-badge)](https://www.npmjs.com/package/@remote-logger/logger)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

A powerful remote logging library for Node.js applications that sends logs to a centralized dashboard for real-time monitoring and analysis.

## ✨ Features

- **Real-time Log Streaming**: Send logs to a remote dashboard in real-time
- **Console Override**: Automatically capture `console.log`, `console.warn`, `console.error`, and `console.debug`
- **Buffered Logging**: Efficient batching with configurable buffer size and flush intervals
- **Authentication**: Secure token-based authentication for your logs
- **TypeScript Support**: Fully typed with TypeScript definitions
- **Custom Log Levels**: Support for `info`, `warn`, `error`, and `debug` levels
- **Metadata Support**: Attach arbitrary metadata to log entries
- **Dashboard Integration**: View logs on [Remote Logger Dashboard](https://remote-logger-dashboard.vercel.app/)

## 📦 Installation

```bash
npm install @remote-logger/logger
```

Or using yarn:

```bash
yarn add @remote-logger/logger
```

Or using pnpm:

```bash
pnpm add @remote-logger/logger
```

## 🚀 Quick Start

```typescript
import { RemoteLogger } from "@remote-logger/logger";

// Initialize the logger
const logger = new RemoteLogger({
  packageName: "com.your-app.name",
  password: "your-secure-password",
  isNewAccount: true, // Set to false if account already exists
  bufferSize: 10, // Number of logs to buffer before sending
  flushInterval: 5000, // Flush interval in milliseconds
});

// Override console methods to automatically send logs
logger.overrideConsole();

// Now all console calls will be sent to the remote dashboard
console.log("Hello from Remote Logger!");
console.warn("This is a warning", { code: 123 });
console.error("Something went wrong!", { error: "Unknown" });
```

## 📖 API Documentation

### `RemoteLogger` Class

#### Constructor

```typescript
new RemoteLogger(config: RemoteLoggerConfig)
```

**Configuration Options:**

| Parameter       | Type      | Default      | Description                                              |
| --------------- | --------- | ------------ | -------------------------------------------------------- |
| `packageName`   | `string`  | **Required** | Unique identifier for your application/package           |
| `password`      | `string`  | Optional     | Password for authentication (required for sending logs)  |
| `isNewAccount`  | `boolean` | `false`      | Set to `true` to auto-create account if it doesn't exist |
| `tableName`     | `string`  | `'logs'`     | Name of the table to store logs in                       |
| `bufferSize`    | `number`  | `10`         | Number of logs to buffer before sending                  |
| `flushInterval` | `number`  | `5000`       | Time in ms to wait before flushing buffer                |

#### Methods

##### `log(level: LogLevel, message: string, meta?: any)`

Send a log with specified level.

##### `info(message: string, meta?: any)`

Send an info level log.

##### `warn(message: string, meta?: any)`

Send a warning level log.

##### `error(message: string, meta?: any)`

Send an error level log.

##### `debug(message: string, meta?: any)`

Send a debug level log.

##### `overrideConsole()`

Override global console methods (`log`, `warn`, `error`, `debug`) to automatically send logs to the remote dashboard.

### Types

```typescript
type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  meta?: any;
  timestamp: string;
}

interface RemoteLoggerConfig {
  packageName: string;
  password?: string;
  isNewAccount?: boolean;
  tableName?: string;
  bufferSize?: number;
  flushInterval?: number;
}
```

## 🖥️ Dashboard

View your logs in real-time on the [Remote Logger Dashboard](https://remote-logger-dashboard.vercel.app/).

### Dashboard Features:

- **Real-time Log Streaming**: See logs as they arrive
- **Filter by Level**: Filter logs by info, warn, error, or debug
- **Search Functionality**: Search through log messages and metadata
- **Time-based Filtering**: View logs from specific time ranges
- **Package Management**: Manage multiple packages/accounts

### Getting Dashboard Credentials:

1. Visit [Remote Logger Dashboard](https://remote-logger-dashboard.vercel.app/)
2. Create a new account using your `packageName` and `password`
3. Or use existing credentials if `isNewAccount` is set to `false`

## 🔧 Advanced Usage

### Manual Logging (Without Console Override)

```typescript
const logger = new RemoteLogger({
  packageName: "com.demo.app",
  password: "secure-password",
});

// Manual logging
logger.info("User logged in", { userId: 123, username: "john_doe" });
logger.warn("High memory usage detected", { memory: "85%", threshold: "80%" });
logger.error("Database connection failed", {
  error: "Connection timeout",
  retryCount: 3,
});
logger.debug("Processing request", {
  requestId: "abc-123",
  endpoint: "/api/users",
});
```

### Custom Buffer Configuration

```typescript
// Send logs immediately (no buffering)
const immediateLogger = new RemoteLogger({
  packageName: "com.critical.app",
  password: "secure-password",
  bufferSize: 1, // Send each log immediately
});

// Larger buffer for high-volume applications
const bufferedLogger = new RemoteLogger({
  packageName: "com.high-volume.app",
  password: "secure-password",
  bufferSize: 100, // Buffer 100 logs before sending
  flushInterval: 10000, // Flush every 10 seconds
});
```

## 🏗️ Building from Source

```bash
# Clone the repository
git clone https://github.com/SolankiYogesh/remote-logger.git
cd logger

# Install dependencies
npm install

# Build the package
npm run build

# Run the example
cd example
node demo.js
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup

```bash
# Install dependencies
npm install

# Build in watch mode (if available)
npm run build:watch

# Run tests (if available)
npm test
```

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Dashboard**: [https://remote-logger-dashboard.vercel.app/](https://remote-logger-dashboard.vercel.app/)
- **npm Package**: [https://www.npmjs.com/package/@remote-logger/logger](https://www.npmjs.com/package/@remote-logger/logger)
- **GitHub Repository**: [https://github.com/SolankiYogesh/remote-logger](https://github.com/SolankiYogesh/remote-logger)

## 🆘 Support

For issues, questions, or feature requests:

1. Check the [GitHub Issues](https://github.com/SolankiYogesh/remote-logger/issues)
2. Create a new issue if your problem isn't already reported

---

Made with ❤️ by the Remote Logger Team
