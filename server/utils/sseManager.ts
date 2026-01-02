import { eq } from "drizzle-orm";
import { EventEmitter } from "events";
import { EventSource } from "eventsource";

import { postgres } from "../db";
import { config as configTable,GPUStatus } from "../db/user/schema";

class SSEManager extends EventEmitter {
  private eventSource: undefined | EventSource = undefined;
  private connected = false;
  private connecting = false;
  private retryCount = 0;
  private maxRetries = 5;
  private retryTimeout: NodeJS.Timeout | null = null;
  private sseUrl: string;

  constructor(sseUrl: string) {
    super();
    this.sseUrl = sseUrl;
  }

  async connect() {
    if (this.connecting || this.connected) {
      return { success: false, message: "Already connected or connecting" };
    }

    this.connecting = true;

    try {
      if (this.eventSource) {
        this.eventSource.close();
      }

      this.eventSource = new EventSource(this.sseUrl);

      this.eventSource.onopen = () => {
        console.log("Backend SSE Connected");
        this.connected = true;
        this.connecting = false;
        this.retryCount = 0;
        this.emit("status", { connected: true, error: null });
      };

      this.eventSource.onerror = (error: any) => {
        console.error("Backend SSE Error:", error);
        this.connected = false;
        this.connecting = false;

        this.emit("status", {
          connected: false,
          error: "Connection failed",
          retryCount: this.retryCount,
        });

        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
          console.log(
            `Retrying in ${delay}ms... (${this.retryCount}/${this.maxRetries})`
          );

          this.retryTimeout = setTimeout(() => {
            this.connect();
          }, delay);
        } else {
          this.emit("status", {
            connected: false,
            error: "Max retries reached",
            retryCount: this.retryCount,
          });
        }
      };

      this.eventSource.addEventListener("event_status", (event: MessageEvent) =>
        this.emit("processing-job-status", event)
      );

      return { success: true, message: "Connecting..." };
    } catch (error) {
      console.error("Failed to create EventSource:", error);
      this.connecting = false;
      this.emit("status", {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return { success: false, message: "Connection failed" };
    }
  }

  disconnect() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }

    this.connected = false;
    this.connecting = false;
    this.retryCount = 0;
    this.emit("status", { connected: false, error: null });

    return { success: true, message: "Disconnected" };
  }

  getStatus() {
    return {
      connected: this.connected,
      connecting: this.connecting,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
    };
  }

  resetRetries() {
    this.retryCount = 0;
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }
}

let sseManager: Maybe<SSEManager> = undefined;

export const getSSEManager = async () => {
  const conf = useRuntimeConfig();
  const { gpuId, inferenceAuthToken } = conf;

  const [res] = await postgres
    .select({ ip: configTable.ip, status: configTable.status })
    .from(configTable)
    .where(eq(configTable.id, gpuId));

  if (res.ip === "" && res.status !== GPUStatus.RUNNING) {
    throw new Error("SSE not running");
  } else if (!sseManager) {
    const URL = `http://${res.ip}/events/sse/status?token=${inferenceAuthToken}`;
    sseManager = new SSEManager(URL);
  }
  return sseManager;
};
