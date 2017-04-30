import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
/**
 * An injected class which grabs the application
 * config variables (e.g. STOMP credentials)
 * for the user application.
 *
 * You will need to subclass this and pass an instance using Dependency Injection
 * mechanism of Angular. See README and samples for ideas on how to implement.
 *
 * @type StompConfigService
 */
var StompConfigService = (function () {
    /** Constructor */
    function StompConfigService() {
    }
    /** Implement this method in your derived class.
     * See README and samples for ideas on how to implement.
     */
    StompConfigService.prototype.get = function () {
        return Observable.of({});
    };
    return StompConfigService;
}());
export { StompConfigService };
StompConfigService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
StompConfigService.ctorParameters = function () { return []; };
//# sourceMappingURL=stomp-config.service.js.map