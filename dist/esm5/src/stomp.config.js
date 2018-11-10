/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
/**
 * Part of `\@stomp/ng2-stompjs`.
 *
 * **This class has been deprecated in favor of {\@link InjectableRxStompConfig}.
 * It will be dropped `\@stomp/ng2-stompjs\@8.x.x`.**
 *
 * Represents a configuration object for the
 * STOMPService to connect to.
 */
var StompConfig = /** @class */ (function () {
    function StompConfig() {
    }
    StompConfig.decorators = [
        { type: Injectable }
    ];
    return StompConfig;
}());
export { StompConfig };
function StompConfig_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StompConfig.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StompConfig.ctorParameters;
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
     * @type {?}
     */
    StompConfig.prototype.url;
    /**
     * Headers
     * Typical keys: login: string, passcode: string.
     * host:string will neeed to be passed for virtual hosts in RabbitMQ
     * @type {?}
     */
    StompConfig.prototype.headers;
    /**
     * How often to incoming heartbeat?
     * Interval in milliseconds, set to 0 to disable
     *
     * Typical value 0 - disabled
     * @type {?}
     */
    StompConfig.prototype.heartbeat_in;
    /**
     * How often to outgoing heartbeat?
     * Interval in milliseconds, set to 0 to disable
     *
     * Typical value 20000 - every 20 seconds
     * @type {?}
     */
    StompConfig.prototype.heartbeat_out;
    /**
     * Wait in milliseconds before attempting auto reconnect
     * Set to 0 to disable
     *
     * Typical value 5000 (5 seconds)
     * @type {?}
     */
    StompConfig.prototype.reconnect_delay;
    /**
     * Enable client debugging?
     * @type {?}
     */
    StompConfig.prototype.debug;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAuY29uZmlnLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN0b21wL25nMi1zdG9tcGpzLyIsInNvdXJjZXMiOlsic3JjL3N0b21wLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Z0JBWTFDLFVBQVU7O3NCQVpYOztTQWFhLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdG9tcEhlYWRlcnMgfSBmcm9tICdAc3RvbXAvc3RvbXBqcyc7XG5cbi8qKlxuICogUGFydCBvZiBgQHN0b21wL25nMi1zdG9tcGpzYC5cbiAqXG4gKiAqKlRoaXMgY2xhc3MgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBmYXZvciBvZiB7QGxpbmsgSW5qZWN0YWJsZVJ4U3RvbXBDb25maWd9LlxuICogSXQgd2lsbCBiZSBkcm9wcGVkIGBAc3RvbXAvbmcyLXN0b21wanNAOC54LnhgLioqXG4gKlxuICogUmVwcmVzZW50cyBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB0aGVcbiAqIFNUT01QU2VydmljZSB0byBjb25uZWN0IHRvLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvbXBDb25maWcge1xuICAvKipcbiAgICogU2VydmVyIFVSTCB0byBjb25uZWN0IHRvLiBQbGVhc2UgcmVmZXIgdG8geW91ciBTVE9NUCBicm9rZXIgZG9jdW1lbnRhdGlvbiBmb3IgZGV0YWlscy5cbiAgICpcbiAgICogRXhhbXBsZTogd3M6Ly8xMjcuMC4wLjE6MTU2NzQvd3MgKGZvciBhIFJhYmJpdE1RIGRlZmF1bHQgc2V0dXAgcnVubmluZyBvbiBsb2NhbGhvc3QpXG4gICAqXG4gICAqIEFsdGVybmF0aXZlbHkgdGhpcyBwYXJhbWV0ZXIgY2FuIGJlIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIG9iamVjdCBzaW1pbGFyIHRvIFdlYlNvY2tldFxuICAgKiAodHlwaWNhbGx5IFNvY2tKUyBpbnN0YW5jZSkuXG4gICAqXG4gICAqIEV4YW1wbGU6XG4gICAqXG4gICAqICgpID0+IHtcbiAgICogICByZXR1cm4gbmV3IFNvY2tKUygnaHR0cDovLzEyNy4wLjAuMToxNTY3NC9zdG9tcCcpO1xuICAgKiB9XG4gICAqL1xuICB1cmw6IHN0cmluZyB8ICgoKSA9PiBhbnkpO1xuXG4gIC8qKlxuICAgKiBIZWFkZXJzXG4gICAqIFR5cGljYWwga2V5czogbG9naW46IHN0cmluZywgcGFzc2NvZGU6IHN0cmluZy5cbiAgICogaG9zdDpzdHJpbmcgd2lsbCBuZWVlZCB0byBiZSBwYXNzZWQgZm9yIHZpcnR1YWwgaG9zdHMgaW4gUmFiYml0TVFcbiAgICovXG4gIGhlYWRlcnM6IFN0b21wSGVhZGVycztcblxuICAvKiogSG93IG9mdGVuIHRvIGluY29taW5nIGhlYXJ0YmVhdD9cbiAgICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLCBzZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgMCAtIGRpc2FibGVkXG4gICAqL1xuICBoZWFydGJlYXRfaW46IG51bWJlcjtcblxuICAvKipcbiAgICogSG93IG9mdGVuIHRvIG91dGdvaW5nIGhlYXJ0YmVhdD9cbiAgICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzLCBzZXQgdG8gMCB0byBkaXNhYmxlXG4gICAqXG4gICAqIFR5cGljYWwgdmFsdWUgMjAwMDAgLSBldmVyeSAyMCBzZWNvbmRzXG4gICAqL1xuICBoZWFydGJlYXRfb3V0OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdhaXQgaW4gbWlsbGlzZWNvbmRzIGJlZm9yZSBhdHRlbXB0aW5nIGF1dG8gcmVjb25uZWN0XG4gICAqIFNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSA1MDAwICg1IHNlY29uZHMpXG4gICAqL1xuICByZWNvbm5lY3RfZGVsYXk6IG51bWJlcjtcblxuICAvKiogRW5hYmxlIGNsaWVudCBkZWJ1Z2dpbmc/ICovXG4gIGRlYnVnOiBib29sZWFuO1xufVxuIl19