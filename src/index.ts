export interface RemoteLoggerConfig {
  packageName: string;
  password?: string;
  isNewAccount?: boolean;
  tableName?: string; 
  bufferSize?: number;
  flushInterval?: number;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  meta?: any;
  timestamp: string;
}

export class RemoteLogger {
  private packageName: string;
  private password?: string;
  private isNewAccount: boolean;
  private ingestUrl: string;
  private token: string | null = null;
  private buffer: LogEntry[] = [];
  private bufferSize: number;
  private flushInterval: number;
  private flushTimer: NodeJS.Timeout | null = null;
  private _disabled: boolean = false;

  constructor(config: RemoteLoggerConfig) {
    this.packageName = config.packageName;
    this.password = config.password;
    this.isNewAccount = config.isNewAccount || false;
    this.ingestUrl = 'https://remote-logger-dashboard.vercel.app'; 
    this.bufferSize = config.bufferSize || 10;
    this.flushInterval = config.flushInterval || 5000;

    // Trigger initial auth
    this.connect();
  }

  private async connect() {
    if (!this.password) return; // Cannot auth without password

    try {
        const res = await fetch(`${this.ingestUrl}/api/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                packageName: this.packageName,
                password: this.password,
                isNewAccount: this.isNewAccount
            })
        });

        if (!res.ok) {
            const data = await res.json();
            console.warn(`[RemoteLogger] Auth failed: ${data.error}`);
            this._disabled = true;
            return;
        }

        const data = await res.json();
        this.token = data.token;
        // console.log('[RemoteLogger] Connected & Authenticated');
    } catch (e) {
        console.error('[RemoteLogger] Connection error:', e);
        this._disabled = true;
    }
  }

  public log(level: LogLevel, message: string, meta?: any) {
    if (this._disabled) return;

    const entry: LogEntry = {
      level,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };

    this.buffer.push(entry);

    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    } else if (!this.flushTimer) {
        // @ts-ignore
      this.flushTimer = setTimeout(() => this.flush(), this.flushInterval);
    }
  }

  public info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  public warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  public error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  public debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }

  public overrideConsole() {
      const originalLog = console.log;
      const originalWarn = console.warn;
      const originalError = console.error;
      const originalDebug = console.debug;

      console.log = (...args) => {
        this.info(args.map(a => String(a)).join(' '), args.length > 1 ? args : undefined);
        originalLog.apply(console, args);
      }
      console.warn = (...args) => {
        this.warn(args.map(a => String(a)).join(' '), args.length > 1 ? args : undefined);
        originalWarn.apply(console, args);
      }
      console.error = (...args) => {
         this.error(args.map(a => String(a)).join(' '), args.length > 1 ? args : undefined);
         originalError.apply(console, args);
      }
      console.debug = (...args) => {
         this.debug(args.map(a => String(a)).join(' '), args.length > 1 ? args : undefined);
         originalDebug.apply(console, args);
      }
  }

  private async flush() {
    if (this._disabled || this.buffer.length === 0) return;
    
    // If not authenticated yet, wait/retry logic could be added here, 
    // but for simplicity we'll just try if we have a password, or drop if no auth
    if (!this.token && this.password) {
        // Maybe still connecting?
        // simple retry logic: skip this flush, wait for next tick
        return; 
    }

    const logsToSend = [...this.buffer];
    this.buffer = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    try {
        const res = await fetch(`${this.ingestUrl}/api/log`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            body: JSON.stringify({ logs: logsToSend })
        });

        if (!res.ok) {
            // If 401, maybe token expired? re-auth?
            if (res.status === 401) {
                this.token = null; 
                this.connect(); // Try reconnect
            }
            console.warn(`[RemoteLogger] Failed to send logs: ${res.statusText}`);
        }
    } catch (error) {
       console.error('[RemoteLogger] Network error sending logs', error);
         // Optionally put logs back in buffer?
    }
  }
}
