/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { StompConfig } from './stomp.config';
import { StompRService } from './stomp-r.service';
/**
 * Angular2 STOMP Service using \@stomp/stomp.js
 *
 * \@description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 *
 * If you want to manually configure and initialize the service
 * please use StompRService
 */
export class StompService extends StompRService {
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     * @param {?} config
     */
    constructor(config) {
        super();
        this.config = config;
        this.initAndConnect();
    }
}
StompService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
StompService.ctorParameters = () => [
    { type: StompConfig, },
];
function StompService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    StompService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    StompService.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvbXAuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzdG9tcC9uZzItc3RvbXBqcy8iLCJzb3VyY2VzIjpbInNyYy9zdG9tcC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU3QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFlbEQsTUFBTSxtQkFBb0IsU0FBUSxhQUFhOzs7Ozs7O2dCQU8xQixNQUFtQjtRQUNwQyxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7OztZQVp6QixVQUFVOzs7O1lBaEJGLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFN0b21wQ29uZmlnIH0gZnJvbSAnLi9zdG9tcC5jb25maWcnO1xuXG5pbXBvcnQgeyBTdG9tcFJTZXJ2aWNlIH0gZnJvbSAnLi9zdG9tcC1yLnNlcnZpY2UnO1xuXG4vKipcbiAqIEFuZ3VsYXIyIFNUT01QIFNlcnZpY2UgdXNpbmcgQHN0b21wL3N0b21wLmpzXG4gKlxuICogQGRlc2NyaXB0aW9uIFRoaXMgc2VydmljZSBoYW5kbGVzIHN1YnNjcmliaW5nIHRvIGFcbiAqIG1lc3NhZ2UgcXVldWUgdXNpbmcgdGhlIHN0b21wLmpzIGxpYnJhcnksIGFuZCByZXR1cm5zXG4gKiB2YWx1ZXMgdmlhIHRoZSBFUzYgT2JzZXJ2YWJsZSBzcGVjaWZpY2F0aW9uIGZvclxuICogYXN5bmNocm9ub3VzIHZhbHVlIHN0cmVhbWluZyBieSB3aXJpbmcgdGhlIFNUT01QXG4gKiBtZXNzYWdlcyBpbnRvIGFuIG9ic2VydmFibGUuXG4gKlxuICogSWYgeW91IHdhbnQgdG8gbWFudWFsbHkgY29uZmlndXJlIGFuZCBpbml0aWFsaXplIHRoZSBzZXJ2aWNlXG4gKiBwbGVhc2UgdXNlIFN0b21wUlNlcnZpY2VcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN0b21wU2VydmljZSBleHRlbmRzIFN0b21wUlNlcnZpY2Uge1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvclxuICAgKlxuICAgKiBTZWUgUkVBRE1FIGFuZCBzYW1wbGVzIGZvciBjb25maWd1cmF0aW9uIGV4YW1wbGVzXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IoY29uZmlnOiBTdG9tcENvbmZpZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmluaXRBbmRDb25uZWN0KCk7XG4gIH1cbn1cbiJdfQ==