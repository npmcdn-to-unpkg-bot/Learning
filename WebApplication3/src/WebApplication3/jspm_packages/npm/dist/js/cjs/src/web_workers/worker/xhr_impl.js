"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var di_1 = require('angular2/src/core/di');
var xhr_1 = require('angular2/src/compiler/xhr');
var client_message_broker_1 = require('angular2/src/web_workers/shared/client_message_broker');
var messaging_api_1 = require('angular2/src/web_workers/shared/messaging_api');
/**
 * Implementation of compiler/xhr that relays XHR requests to the UI side where they are sent
 * and the result is proxied back to the worker
 */
var WebWorkerXHRImpl = (function (_super) {
    __extends(WebWorkerXHRImpl, _super);
    function WebWorkerXHRImpl(messageBrokerFactory) {
        _super.call(this);
        this._messageBroker = messageBrokerFactory.createMessageBroker(messaging_api_1.XHR_CHANNEL);
    }
    WebWorkerXHRImpl.prototype.get = function (url) {
        var fnArgs = [new client_message_broker_1.FnArg(url, null)];
        var args = new client_message_broker_1.UiArguments("get", fnArgs);
        return this._messageBroker.runOnService(args, String);
    };
    WebWorkerXHRImpl = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof client_message_broker_1.ClientMessageBrokerFactory !== 'undefined' && client_message_broker_1.ClientMessageBrokerFactory) === 'function' && _a) || Object])
    ], WebWorkerXHRImpl);
    return WebWorkerXHRImpl;
    var _a;
}(xhr_1.XHR));
exports.WebWorkerXHRImpl = WebWorkerXHRImpl;
//# sourceMappingURL=xhr_impl.js.map