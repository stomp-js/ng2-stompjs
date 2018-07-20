import { __values, __extends } from 'tslib';
import { first, filter, share } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { client, over } from '@stomp/stompjs';

var StompState = {
    CLOSED: 0,
    TRYING: 1,
    CONNECTED: 2,
    DISCONNECTING: 3,
};
StompState[StompState.CLOSED] = "CLOSED";
StompState[StompState.TRYING] = "TRYING";
StompState[StompState.CONNECTED] = "CONNECTED";
StompState[StompState.DISCONNECTING] = "DISCONNECTING";
var StompRService = /** @class */ (function () {
    function StompRService() {
        var _this = this;
        this.queuedMessages = [];
        this.debug = function (args) {
            console.log(new Date(), args);
        };
        this.on_connect = function (frame) {
            _this.debug('Connected');
            _this._serverHeadersBehaviourSubject.next(frame.headers);
            _this.state.next(StompState.CONNECTED);
        };
        this.on_error = function (error) {
            _this.errorSubject.next(error);
            if (typeof error === 'object') {
                error = ((error)).body;
            }
            _this.debug("Error: " + error);
            if (!_this.client.connected) {
                _this.state.next(StompState.CLOSED);
            }
        };
        this.state = new BehaviorSubject(StompState.CLOSED);
        this.connectObservable = this.state.pipe(filter(function (currentState) {
            return currentState === StompState.CONNECTED;
        }));
        this.connectObservable.subscribe(function () {
            _this.sendQueuedMessages();
        });
        this._serverHeadersBehaviourSubject = new BehaviorSubject(null);
        this.serverHeadersObservable = this._serverHeadersBehaviourSubject.pipe(filter(function (headers) {
            return headers !== null;
        }));
        this.errorSubject = new Subject();
    }
    Object.defineProperty(StompRService.prototype, "config", {
        set: function (value) {
            this._config = value;
        },
        enumerable: true,
        configurable: true
    });
    StompRService.prototype.initStompClient = function () {
        this.disconnect();
        if (typeof (this._config.url) === 'string') {
            this.client = client(this._config.url);
        }
        else {
            this.client = over(this._config.url);
        }
        this.client.heartbeat.incoming = this._config.heartbeat_in;
        this.client.heartbeat.outgoing = this._config.heartbeat_out;
        this.client.reconnect_delay = this._config.reconnect_delay;
        if (!this._config.debug) {
            this.debug = function () {
            };
        }
        this.client.debug = this.debug;
        this.setupOnReceive();
        this.setupReceipts();
    };
    StompRService.prototype.initAndConnect = function () {
        this.initStompClient();
        if (!this._config.headers) {
            this._config.headers = {};
        }
        this.client.connect(this._config.headers, this.on_connect, this.on_error);
        this.debug('Connecting...');
        this.state.next(StompState.TRYING);
    };
    StompRService.prototype.disconnect = function () {
        var _this = this;
        if (this.client) {
            if (!this.client.connected) {
                this.state.next(StompState.CLOSED);
                return;
            }
            this.state.next(StompState.DISCONNECTING);
            this.client.disconnect(function () { return _this.state.next(StompState.CLOSED); });
        }
    };
    StompRService.prototype.connected = function () {
        return this.state.getValue() === StompState.CONNECTED;
    };
    StompRService.prototype.publish = function (queueName, message, headers) {
        if (headers === void 0) { headers = {}; }
        if (this.connected()) {
            this.client.send(queueName, headers, message);
        }
        else {
            this.debug("Not connected, queueing " + message);
            this.queuedMessages.push({ queueName: (queueName), message: (message), headers: headers });
        }
    };
    StompRService.prototype.sendQueuedMessages = function () {
        var queuedMessages = this.queuedMessages;
        this.queuedMessages = [];
        this.debug("Will try sending queued messages " + queuedMessages);
        try {
            for (var queuedMessages_1 = __values(queuedMessages), queuedMessages_1_1 = queuedMessages_1.next(); !queuedMessages_1_1.done; queuedMessages_1_1 = queuedMessages_1.next()) {
                var queuedMessage = queuedMessages_1_1.value;
                this.debug("Attempting to send " + queuedMessage);
                this.publish(queuedMessage.queueName, queuedMessage.message, queuedMessage.headers);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (queuedMessages_1_1 && !queuedMessages_1_1.done && (_a = queuedMessages_1.return)) _a.call(queuedMessages_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
    StompRService.prototype.subscribe = function (queueName, headers) {
        var _this = this;
        if (headers === void 0) { headers = {}; }
        this.debug("Request to subscribe " + queueName);
        if (!headers['ack']) {
            headers['ack'] = 'auto';
        }
        var coldObservable = Observable.create(function (messages) {
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
        return coldObservable.pipe(share());
    };
    StompRService.prototype.setupOnReceive = function () {
        var _this = this;
        this.defaultMessagesObservable = new Subject();
        this.client.onreceive = function (message) {
            _this.defaultMessagesObservable.next(message);
        };
    };
    StompRService.prototype.setupReceipts = function () {
        var _this = this;
        this.receiptsObservable = new Subject();
        this.client.onreceipt = function (frame) {
            _this.receiptsObservable.next(frame);
        };
    };
    StompRService.prototype.waitForReceipt = function (receiptId, callback) {
        this.receiptsObservable.pipe(filter(function (frame) {
            return frame.headers['receipt-id'] === receiptId;
        }), first()).subscribe(function (frame) {
            callback(frame);
        });
    };
    return StompRService;
}());
StompRService.decorators = [
    { type: Injectable },
];
StompRService.ctorParameters = function () { return []; };
var StompConfig = /** @class */ (function () {
    function StompConfig() {
    }
    return StompConfig;
}());
StompConfig.decorators = [
    { type: Injectable },
];
var StompService = /** @class */ (function (_super) {
    __extends(StompService, _super);
    function StompService(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.initAndConnect();
        return _this;
    }
    return StompService;
}(StompRService));
StompService.decorators = [
    { type: Injectable },
];
StompService.ctorParameters = function () { return [
    { type: StompConfig, },
]; };

export { StompRService, StompService, StompState, StompConfig };
//# sourceMappingURL=stomp-ng2-stompjs.js.map
