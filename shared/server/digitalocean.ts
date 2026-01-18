export type WebAppHealthData = {
  name: string;
  cpuUsagePercent: string;
  memoryUsagePercent: string;
  state: "UNKNOWN" | "HEALTHY" | "UNHEALTHY";
};

export type DatabaseInfoData = {
  status: string;
  name: string;
  maxSize: number;
  actualSize: number;
  ratio: string;
};

export type SpaceInfoData = {
  totalBytes: number;
  totalMB: string;
  totalGB: number;
  percentUsage: string;
};
