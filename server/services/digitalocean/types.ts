export interface AppHealth {
  components: Component[];
  status: string;
}

interface Component {
  name: string;
  cpu_usage_percent: number;
  memory_usage_percent: number;
  replicas_desired: number;
  replicas_ready: number;
  state: string;
}

export interface Database {
  id: string;
  name: string;
  engine: string;
  version: string;
  semantic_version: string;
  connection: Connection;
  private_connection: PrivateConnection;
  metrics_endpoints: MetricsEndpoint[];
  users: User[];
  db_names: string[];
  num_nodes: number;
  region: string;
  status: string;
  created_at: string;
  maintenance_window: MaintenanceWindow;
  size: string;
  tags: undefined;
  private_network_uuid: string;
  project_id: string;
  read_only: boolean;
  version_end_of_life: string;
  version_end_of_availability: string;
  storage_size_mib: number;
  autoscale: Autoscale;
}

interface Connection {
  protocol: string;
  uri: string;
  database: string;
  host: string;
  port: number;
  user: string;
  ssl: boolean;
}

interface PrivateConnection {
  protocol: string;
  uri: string;
  database: string;
  host: string;
  port: number;
  user: string;
  ssl: boolean;
}

interface MetricsEndpoint {
  host: string;
  port: number;
}

interface User {
  name: string;
  role: string;
}

interface MaintenanceWindow {
  day: string;
  hour: string;
  pending: boolean;
}

interface Autoscale {
  storage: Storage;
}

interface Storage {
  enabled: boolean;
  threshold_percent: number;
  increment_gib: number;
}

export interface DropletResponse {
  droplet: Droplet;
  links: Links;
}

interface Droplet {
  id: number;
  name: string;
  memory: number;
  vcpus: number;
  disk: number;
  disk_info: DiskInfo[];
  locked: boolean;
  status: string;
  kernel: string;
  created_at: string;
  features: string[];
  backup_ids: string[];
  next_backup_window: string;
  snapshot_ids: string[];
  image: Image;
  volume_ids: string[];
  size: Size2;
  size_slug: string;
  networks: Networks;
  region: Region;
  tags: string[];
}

interface DiskInfo {
  type: string;
  size: Size;
}

interface Size {
  amount: number;
  unit: string;
}

interface Image {
  id: number;
  name: string;
  distribution: string;
  slug: string;
  public: boolean;
  regions: string[];
  created_at: string;
  type: string;
  min_disk_size: number;
  size_gigabytes: number;
  description: string;
  tags: string[];
  status: string;
  error_message: string;
}

interface Size2 {
  slug: string;
  memory: number;
  vcpus: number;
  disk: number;
  transfer: number;
  price_monthly: number;
  price_hourly: number;
  regions: string[];
  available: boolean;
  description: string;
}

interface Networks {
  v4: V4[];
  v6: string[];
}

interface V4 {
  ip_address: string;
  netmask: string;
  gateway: string;
  type: string;
}

interface Region {
  name: string;
  slug: string;
  features: string[];
  available: boolean;
  sizes: string[];
}

interface Links {
  actions: Action[];
}

interface Action {
  id: number;
  rel: string;
  href: string;
}