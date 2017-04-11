/**
 * Represents a configuration object for the
 * STOMPService to connect to, pub, and sub.
 */
export interface StompConfig {
  // Which server?
  host: string;
  port: number;
  path: string;
  ssl: boolean;

  // What credentials?
  user: string;
  pass: string;

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in?: number;
  heartbeat_out?: number;

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  reconnect_delay: number;

  // Enable client debugging?
  debug: boolean;
}
