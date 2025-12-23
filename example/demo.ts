import { RemoteLogger } from "../src/index.js";

const logger = new RemoteLogger({
  packageName: "com.demo.app",
  password: "secure-password-123",
  isNewAccount: true, // Auto-create if not exists
  tableName: "logs",
  bufferSize: 1,
});

// Override console
logger.overrideConsole();

console.log("Hello from Remote Logger Demo!");
console.warn("This is a warning message", { code: 123 });
console.error("Something went wrong!", { error: "Unknown failed" });
console.log("Complex object", {
  user: { id: 1, name: "Test" },
  action: "login",
});

setTimeout(() => {
  console.log("Async log after 2 seconds");
}, 2000);
