/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
/**
 * Represents a configuration object for the
 * STOMPService to connect to.
 */
export class StompConfig {
}
StompConfig.decorators = [
    { type: Injectable }
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAuY29uZmlnLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN0b21wL25nMi1zdG9tcGpzLyIsInNvdXJjZXMiOlsic3JjL3N0b21wLmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7Ozs7QUFRM0MsTUFBTTs7O1lBREwsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN0b21wSGVhZGVycyB9IGZyb20gJ0BzdG9tcC9zdG9tcGpzJztcbi8qKlxuICogUmVwcmVzZW50cyBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB0aGVcbiAqIFNUT01QU2VydmljZSB0byBjb25uZWN0IHRvLlxuICovXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTdG9tcENvbmZpZyB7XG4gIC8qKlxuICAgKiBTZXJ2ZXIgVVJMIHRvIGNvbm5lY3QgdG8uIFBsZWFzZSByZWZlciB0byB5b3VyIFNUT01QIGJyb2tlciBkb2N1bWVudGF0aW9uIGZvciBkZXRhaWxzLlxuICAgKlxuICAgKiBFeGFtcGxlOiB3czovLzEyNy4wLjAuMToxNTY3NC93cyAoZm9yIGEgUmFiYml0TVEgZGVmYXVsdCBzZXR1cCBydW5uaW5nIG9uIGxvY2FsaG9zdClcbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSB0aGlzIHBhcmFtZXRlciBjYW4gYmUgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gb2JqZWN0IHNpbWlsYXIgdG8gV2ViU29ja2V0XG4gICAqICh0eXBpY2FsbHkgU29ja0pTIGluc3RhbmNlKS5cbiAgICpcbiAgICogRXhhbXBsZTpcbiAgICpcbiAgICogKCkgPT4ge1xuICAgKiAgIHJldHVybiBuZXcgU29ja0pTKCdodHRwOi8vMTI3LjAuMC4xOjE1Njc0L3N0b21wJyk7XG4gICAqIH1cbiAgICovXG4gIHVybDogc3RyaW5nIHwgKCgpID0+IGFueSk7XG5cbiAgLyoqXG4gICAqIEhlYWRlcnNcbiAgICogVHlwaWNhbCBrZXlzOiBsb2dpbjogc3RyaW5nLCBwYXNzY29kZTogc3RyaW5nLlxuICAgKiBob3N0OnN0cmluZyB3aWxsIG5lZWVkIHRvIGJlIHBhc3NlZCBmb3IgdmlydHVhbCBob3N0cyBpbiBSYWJiaXRNUVxuICAgKi9cbiAgaGVhZGVyczogU3RvbXBIZWFkZXJzO1xuXG4gIC8qKiBIb3cgb2Z0ZW4gdG8gaW5jb21pbmcgaGVhcnRiZWF0P1xuICAgKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMsIHNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSAwIC0gZGlzYWJsZWRcbiAgICovXG4gIGhlYXJ0YmVhdF9pbjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBIb3cgb2Z0ZW4gdG8gb3V0Z29pbmcgaGVhcnRiZWF0P1xuICAgKiBJbnRlcnZhbCBpbiBtaWxsaXNlY29uZHMsIHNldCB0byAwIHRvIGRpc2FibGVcbiAgICpcbiAgICogVHlwaWNhbCB2YWx1ZSAyMDAwMCAtIGV2ZXJ5IDIwIHNlY29uZHNcbiAgICovXG4gIGhlYXJ0YmVhdF9vdXQ6IG51bWJlcjtcblxuICAvKipcbiAgICogV2FpdCBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIGF0dGVtcHRpbmcgYXV0byByZWNvbm5lY3RcbiAgICogU2V0IHRvIDAgdG8gZGlzYWJsZVxuICAgKlxuICAgKiBUeXBpY2FsIHZhbHVlIDUwMDAgKDUgc2Vjb25kcylcbiAgICovXG4gIHJlY29ubmVjdF9kZWxheTogbnVtYmVyO1xuXG4gIC8qKiBFbmFibGUgY2xpZW50IGRlYnVnZ2luZz8gKi9cbiAgZGVidWc6IGJvb2xlYW47XG59XG4iXX0=