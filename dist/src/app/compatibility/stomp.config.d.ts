import { StompHeaders } from '@stomp/stompjs';
/**
 * Part of `@stomp/ng2-stompjs`.
 *
 * **This class has been deprecated in favor of {@link InjectableRxStompConfig}.
 * It will be dropped `@stomp/ng2-stompjs@8.x.x`.**
 *
 * Represents a configuration object for the
 * STOMPService to connect to.
 *
 * This name conflicts with a class of the same name in @stomp/stompjs, excluding this from the documentation.
 *
 * @internal
 */
export declare class StompConfig {
    /**
     * Server URL to connect to. Please refer to your STOMP broker documentation for details.
     *
     * Example: ws://127.0.0.1:15674/ws (for a RabbitMQ default setup running on localhost)
     *
     * Alternatively this parameter can be a function that returns an object similar to WebSocket
     * (typically SockJS instance).
     *
     * Example:
     *
     * () => {
     *   return new SockJS('http://127.0.0.1:15674/stomp');
     * }
     */
    url: string | (() => any);
    /**
     * Headers
     * Typical keys: login: string, passcode: string.
     * host:string will neeed to be passed for virtual hosts in RabbitMQ
     */
    headers: StompHeaders;
    /** How often to incoming heartbeat?
     * Interval in milliseconds, set to 0 to disable
     *
     * Typical value 0 - disabled
     */
    heartbeat_in: number;
    /**
     * How often to outgoing heartbeat?
     * Interval in milliseconds, set to 0 to disable
     *
     * Typical value 20000 - every 20 seconds
     */
    heartbeat_out: number;
    /**
     * Wait in milliseconds before attempting auto reconnect
     * Set to 0 to disable
     *
     * Typical value 5000 (5 seconds)
     */
    reconnect_delay: number;
    /** Enable client debugging? */
    debug: boolean;
}
