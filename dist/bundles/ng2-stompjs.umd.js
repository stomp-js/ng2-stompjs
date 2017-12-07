(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/BehaviorSubject'), require('rxjs/Observable'), require('rxjs/Subject'), require('rxjs/add/operator/filter'), require('rxjs/add/operator/share'), require('@stomp/stompjs/index')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/BehaviorSubject', 'rxjs/Observable', 'rxjs/Subject', 'rxjs/add/operator/filter', 'rxjs/add/operator/share', '@stomp/stompjs/index'], factory) :
	(factory((global['ng2-stompjs'] = {}),global.ng.core,global.Rx,global.Rx,global.Rx,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global['']['/node_modules/@stomp/stompjs/index'].js));
}(this, (function (exports,core,BehaviorSubject,Observable,Subject,filter,share,index) { 'use strict';

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var StompState = {};
StompState.CLOSED = 0;
StompState.TRYING = 1;
StompState.CONNECTED = 2;
StompState.DISCONNECTING = 3;
StompState[StompState.CLOSED] = "CLOSED";
StompState[StompState.TRYING] = "TRYING";
StompState[StompState.CONNECTED] = "CONNECTED";
StompState[StompState.DISCONNECTING] = "DISCONNECTING";
/**
 * Angular2 STOMP Raw Service using \@stomp/stomp.js
 *
 * \@description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 *
 * If you will like to pass the configuration as a dependency,
 * please use StompService class.
 */
var StompRService = (function () {
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     */
    function StompRService() {
        var _this = this;
        /**
         * Internal array to hold locally queued messages when STOMP broker is not connected.
         */
        this.queuedMessages = [];
        /**
         * Callback Functions
         *
         * Note the method signature: () => preserves lexical scope
         * if we need to use this.x inside the function
         */
        this.debug = function (args) {
            console.log(new Date(), args);
        };
        /**
         * Callback run on successfully connecting to server
         */
        this.on_connect = function (frame) {
            _this.debug('Connected');
            _this._serverHeadersBehaviourSubject.next(frame.headers);
            // Indicate our connected state to observers
            _this.state.next(StompState.CONNECTED);
        };
        /**
         * Handle errors from stomp.js
         */
        this.on_error = function (error) {
            // Trigger the error subject
            _this.errorSubject.next(error);
            if (typeof error === 'object') {
                error = error.body;
            }
            _this.debug("Error: " + error);
            // Check for dropped connection and try reconnecting
            if (!_this.client.connected) {
                // Reset state indicator
                _this.state.next(StompState.CLOSED);
            }
        };
        this.state = new BehaviorSubject.BehaviorSubject(StompState.CLOSED);
        this.connectObservable = this.state
            .filter(function (currentState) {
            return currentState === StompState.CONNECTED;
        });
        // Setup sending queuedMessages
        this.connectObservable.subscribe(function () {
            _this.sendQueuedMessages();
        });
        this._serverHeadersBehaviourSubject = new BehaviorSubject.BehaviorSubject(null);
        this.serverHeadersObservable = this._serverHeadersBehaviourSubject
            .filter(function (headers) {
            return headers !== null;
        });
        this.errorSubject = new Subject.Subject();
    }
    Object.defineProperty(StompRService.prototype, "config", {
        /**
         * Set configuration
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._config = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize STOMP Client
     * @return {?}
     */
    StompRService.prototype.initStompClient = function () {
        // disconnect if connected
        this.disconnect();
        // url takes precedence over socketFn
        if (typeof (this._config.url) === 'string') {
            this.client = index.client(this._config.url);
        }
        else {
            this.client = index.over(this._config.url);
        }
        // Configure client heart-beating
        this.client.heartbeat.incoming = this._config.heartbeat_in;
        this.client.heartbeat.outgoing = this._config.heartbeat_out;
        // Auto reconnect
        this.client.reconnect_delay = this._config.reconnect_delay;
        if (!this._config.debug) {
            this.debug = function () { };
        }
        // Set function to debug print messages
        this.client.debug = this.debug;
    };
    /**
     * Perform connection to STOMP broker
     * @return {?}
     */
    StompRService.prototype.initAndConnect = function () {
        this.initStompClient();
        if (!this._config.headers) {
            this._config.headers = {};
        }
        // Attempt connection, passing in a callback
        this.client.connect(this._config.headers, this.on_connect, this.on_error);
        this.debug('Connecting...');
        this.state.next(StompState.TRYING);
    };
    /**
     * Disconnect the connection to the STOMP broker and clean up,
     * not sure how this method will get called, if ever.
     * Call this method only if you know what you are doing.
     * @return {?}
     */
    StompRService.prototype.disconnect = function () {
        var _this = this;
        // Disconnect if connected. Callback will set CLOSED state
        if (this.client && this.client.connected) {
            // Notify observers that we are disconnecting!
            this.state.next(StompState.DISCONNECTING);
            this.client.disconnect(function () { return _this.state.next(StompState.CLOSED); });
        }
    };
    /**
     * The current connection status with the STOMP broker
     * @return {?}
     */
    StompRService.prototype.connected = function () {
        return this.state.getValue() === StompState.CONNECTED;
    };
    /**
     * Send a message to a named destination. The message must be string.
     *
     * The message will get locally queued if the STOMP broker is not connected. Attempt
     * will be made to publish queued messages as soon as the broker gets connected.
     *
     * @param {?} queueName
     * @param {?} message
     * @param {?=} headers
     * @return {?}
     */
    StompRService.prototype.publish = function (queueName, message, headers) {
        if (headers === void 0) { headers = {}; }
        if (this.connected()) {
            this.client.send(queueName, headers, message);
        }
        else {
            this.debug("Not connected, queueing " + message);
            this.queuedMessages.push({ queueName: /** @type {?} */ (queueName), message: /** @type {?} */ (message), headers: headers });
        }
    };
    /**
     * Send queued messages
     * @return {?}
     */
    StompRService.prototype.sendQueuedMessages = function () {
        var /** @type {?} */ queuedMessages = this.queuedMessages;
        this.queuedMessages = [];
        this.debug("Will try sending queued messages " + queuedMessages);
        for (var _i = 0, queuedMessages_1 = queuedMessages; _i < queuedMessages_1.length; _i++) {
            var queuedMessage = queuedMessages_1[_i];
            this.debug("Attempting to send " + queuedMessage);
            this.publish(queuedMessage.queueName, queuedMessage.message, queuedMessage.headers);
        }
    };
    /**
     * Subscribe to server message queues
     *
     * This method can safely be called even when STOMP broker is not connected. Further
     * if the underlying STOMP connection drops and reconnects, it will resubscribe transparently.
     *
     * If a header field 'ack' is not explicitly passed, 'ack' will be set to 'auto'. If you
     * do not understand what it means, please leave it as is.
     *
     * Please note, however, while working with temporary queues, where the subscription request
     * creates the
     * underlying queue, during reconnect it might miss messages. This issue is not specific
     * to this library but the way STOMP brokers are designed to work.
     *
     * @param {?} queueName
     * @param {?=} headers
     * @return {?}
     */
    StompRService.prototype.subscribe = function (queueName, headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
        /* Well the logic is complicated but works beautifully. RxJS is indeed wonderful.
         *
         * We need to activate the underlying subscription immediately if Stomp is connected. If not it should
         * subscribe when it gets next connected. Further it should re establish the subscription whenever Stomp
         * successfully reconnects.
         *
         * Actual implementation is simple, we filter the BehaviourSubject 'state' so that we can trigger whenever Stomp is
         * connected. Since 'state' is a BehaviourSubject, if Stomp is already connected, it will immediately trigger.
         *
         * The observable that we return to caller remains same across all reconnects, so no special handling needed at
         * the message subscriber.
         */
        this.debug("Request to subscribe " + queueName);
        // By default auto acknowledgement of messages
        if (!headers['ack']) {
            headers['ack'] = 'auto';
        }
        var /** @type {?} */ coldObservable = Observable.Observable.create(function (messages) {
            /*
             * These variables will be used as part of the closure and work their magic during unsubscribe
             */
            var /** @type {?} */ stompSubscription;
            var /** @type {?} */ stompConnectedSubscription;
            stompConnectedSubscription = _this.connectObservable
                .subscribe(function () {
                _this.debug("Will subscribe to " + queueName);
                stompSubscription = _this.client.subscribe(queueName, function (message) {
                    messages.next(message);
                }, headers);
            });
            return function () {
                _this.debug("Stop watching connection state (for " + queueName + ")");
                stompConnectedSubscription.unsubscribe();
                if (_this.state.getValue() === StompState.CONNECTED) {
                    _this.debug("Will unsubscribe from " + queueName + " at Stomp");
                    stompSubscription.unsubscribe();
                }
                else {
                    _this.debug("Stomp not connected, no need to unsubscribe from " + queueName + " at Stomp");
                }
            };
        });
        /**
         * Important - convert it to hot Observable - otherwise, if the user code subscribes
         * to this observable twice, it will subscribe twice to Stomp broker. (This was happening in the current example).
         * A long but good explanatory article at https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339
         */
        return coldObservable.share();
    };
    return StompRService;
}());
StompRService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
StompRService.ctorParameters = function () { return []; };
/**
 * Represents a configuration object for the
 * STOMPService to connect to.
 */
var StompConfig = (function () {
    function StompConfig() {
    }
    return StompConfig;
}());
StompConfig.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
StompConfig.ctorParameters = function () { return []; };
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
var StompService = (function (_super) {
    __extends(StompService, _super);
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     * @param {?} config
     */
    function StompService(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.initAndConnect();
        return _this;
    }
    return StompService;
}(StompRService));
StompService.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
StompService.ctorParameters = function () { return [
    { type: StompConfig, },
]; };

exports.StompRService = StompRService;
exports.StompService = StompService;
exports.StompState = StompState;
exports.StompConfig = StompConfig;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng2-stompjs.umd.js.map
