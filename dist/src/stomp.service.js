import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Stomp from '@stomp/stompjs';
import { StompConfigService } from './stomp-config.service';
/**
 * Possible states for the STOMP service
 */
export var StompState;
(function (StompState) {
    StompState[StompState["CLOSED"] = 0] = "CLOSED";
    StompState[StompState["TRYING"] = 1] = "TRYING";
    StompState[StompState["CONNECTED"] = 2] = "CONNECTED";
    StompState[StompState["DISCONNECTING"] = 3] = "DISCONNECTING";
})(StompState || (StompState = {}));
/**
 * Angular2 STOMP Service using @stomp/stomp.js
 *
 * @description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into an observable.
 */
var StompService = (function () {
    /**
     * Constructor
     *
     * See README and samples for configuration examples
     */
    function StompService(_configService) {
        var _this = this;
        this._configService = _configService;
        /**
         * Internal array to hold locallly queued messages when STOMP broker is not connected.
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
        /** Callback run on successfully connecting to server */
        this.on_connect = function () {
            _this.debug('Connected');
            // Indicate our connected state to observers
            _this.state.next(StompState.CONNECTED);
        };
        /** Handle errors from stomp.js */
        this.on_error = function (error) {
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
        this.state = new BehaviorSubject(StompState.CLOSED);
        this.connectObservable = this.state
            .filter(function (currentState) {
            return currentState === StompState.CONNECTED;
        });
        // Setup sending queuedMessages
        this.connectObservable.subscribe(function () {
            _this.sendQueuedMessages();
        });
        // Get configuration from config service...
        this._configService.get().subscribe(function (config) {
            // ... then pass it to (and connect) STOMP:
            _this.configure(config);
            _this.try_connect();
        });
    }
    /** Set up configuration */
    StompService.prototype.configure = function (config) {
        this.config = config;
        // Attempt connection, passing in a callback
        this.client = Stomp.client(this.config.url);
        // Configure client heart-beating
        this.client.heartbeat.incoming = this.config.heartbeat_in;
        this.client.heartbeat.outgoing = this.config.heartbeat_out;
        // Auto reconnect
        this.client.reconnect_delay = this.config.reconnect_delay;
        // Set function to debug print messages
        this.client.debug = this.config.debug || this.config.debug == null ? this.debug : function () { };
    };
    /**
     * Perform connection to STOMP broker
     */
    StompService.prototype.try_connect = function () {
        // Attempt connection, passing in a callback
        this.client.connect(this.config.headers, this.on_connect, this.on_error);
        this.debug('Connecting...');
        this.state.next(StompState.TRYING);
    };
    /**
     * Disconnect the connection to the STOMP broker and clean up,
     * not sure how this method will get called, if ever.
     * Call this method only if you know what you are doing.
     */
    StompService.prototype.disconnect = function () {
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
     * @returns {boolean}
     */
    StompService.prototype.connected = function () {
        return this.state.getValue() === StompState.CONNECTED;
    };
    /**
     * Send a message to a named destination. The message must be string.
     *
     * The message will get locally queued if the STOMP broker is not connected. Attempt
     * will be made to publish queued messages as soon as the broker gets connected.
     *
     * @param queueName
     * @param message
     * @param headers
     */
    StompService.prototype.publish = function (queueName, message, headers) {
        if (headers === void 0) { headers = {}; }
        if (this.connected()) {
            this.client.send(queueName, headers, message);
        }
        else {
            this.debug("Not connected, queueing " + message);
            this.queuedMessages.push({ queueName: queueName, message: message, headers: headers });
        }
    };
    /** Send queued messages */
    StompService.prototype.sendQueuedMessages = function () {
        var queuedMessages = this.queuedMessages;
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
     * @param queueName
     * @param headers
     * @returns {Observable<Stomp.Message>}
     */
    StompService.prototype.subscribe = function (queueName, headers) {
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
        var coldObservable = Observable.create(function (messages) {
            /*
             * These variables will be used as part of the closure and work their magic during unsubscribe
             */
            var stompSubscription;
            var stompConnectedSubscription;
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
    return StompService;
}());
export { StompService };
StompService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
StompService.ctorParameters = function () { return [
    { type: StompConfigService, },
]; };
//# sourceMappingURL=stomp.service.js.map