(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs/operators'), require('@angular/core'), require('rxjs'), require('@stomp/stompjs')) :
	typeof define === 'function' && define.amd ? define('@stomp/ng2-stompjs', ['exports', 'rxjs/operators', '@angular/core', 'rxjs', '@stomp/stompjs'], factory) :
	(factory((global.stomp = global.stomp || {}, global.stomp['ng2-stompjs'] = {}),global.Rx.Observable.prototype,global.ng.core,global.rxjs,global.stompjs));
}(this, (function (exports,operators,core,rxjs,stompjs) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */
var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}








function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

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
        this.state = new rxjs.BehaviorSubject(StompState.CLOSED);
        this.connectObservable = this.state.pipe(operators.filter(function (currentState) {
            return currentState === StompState.CONNECTED;
        }));
        this.connectObservable.subscribe(function () {
            _this.sendQueuedMessages();
        });
        this._serverHeadersBehaviourSubject = new rxjs.BehaviorSubject(null);
        this.serverHeadersObservable = this._serverHeadersBehaviourSubject.pipe(operators.filter(function (headers) {
            return headers !== null;
        }));
        this.errorSubject = new rxjs.Subject();
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
            this.client = stompjs.client(this._config.url);
        }
        else {
            this.client = stompjs.over(this._config.url);
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
        var coldObservable = rxjs.Observable.create(function (messages) {
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
        return coldObservable.pipe(operators.share());
    };
    StompRService.prototype.setupOnReceive = function () {
        var _this = this;
        this.defaultMessagesObservable = new rxjs.Subject();
        this.client.onreceive = function (message) {
            _this.defaultMessagesObservable.next(message);
        };
    };
    StompRService.prototype.setupReceipts = function () {
        var _this = this;
        this.receiptsObservable = new rxjs.Subject();
        this.client.onreceipt = function (frame) {
            _this.receiptsObservable.next(frame);
        };
    };
    StompRService.prototype.waitForReceipt = function (receiptId, callback) {
        this.receiptsObservable.pipe(operators.filter(function (frame) {
            return frame.headers['receipt-id'] === receiptId;
        }), operators.first()).subscribe(function (frame) {
            callback(frame);
        });
    };
    return StompRService;
}());
StompRService.decorators = [
    { type: core.Injectable },
];
StompRService.ctorParameters = function () { return []; };
var StompConfig = /** @class */ (function () {
    function StompConfig() {
    }
    return StompConfig;
}());
StompConfig.decorators = [
    { type: core.Injectable },
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
    { type: core.Injectable },
];
StompService.ctorParameters = function () { return [
    { type: StompConfig, },
]; };

exports.StompRService = StompRService;
exports.StompService = StompService;
exports.StompState = StompState;
exports.StompConfig = StompConfig;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=stomp-ng2-stompjs.umd.js.map
