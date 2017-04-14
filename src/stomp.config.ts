/**
 * Represents a configuration object for the
 * STOMPService to connect to, pub, and sub.
 */
export interface StompConfig {
  // Which server?
  // Example: ws://127.0.0.1:15674/ws
  url: string;

  // Virtual Host
  virtualHost: string;

  // What credentials?
  // Example: guest/guest
  user: string;
  pass: string;

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  heartbeat_in: number; // Typical value 0 - disabled
  heartbeat_out: number; // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 5000 (5 seconds)
  reconnect_delay: number;

  // Enable client debugging?
  debug: boolean;
}
