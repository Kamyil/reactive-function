"use strict";
exports.__esModule = true;
exports.PubSubInstance = exports.PubSub = void 0;
var PubSub = /** @class */ (function () {
    function PubSub() {
        this.listeners = {};
    }
    /**
     * @description  Subscribe eventHandler to custom event
     *
     * @param  eventName  Event Name to subscribe to
     * @param  eventHandler  Event Handler callback
     */
    PubSub.prototype.subscribe = function (eventName, eventHandler) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = new Set();
        }
        this.listeners[eventName].add(eventHandler);
        return this;
    };
    /**
     * @description  Unsubscribe eventHandler from custom event
     *
     * @param  eventName  Event Name to subscribe to
     * @param  eventHandler  Event Handler callback
     */
    PubSub.prototype.unsubscribe = function (eventName, eventHandler) {
        if (this.listeners[eventName].has(eventHandler)) {
            this.listeners[eventName]["delete"](eventHandler);
        }
        return this;
    };
    /**
     * @description  When called will dispatch all listeners (subscriptions) to the
     *               event
     *
     * @param  eventName  Event to be published
     * @param  data  Data to be passed to all subscribers
     */
    PubSub.prototype.publish = function (eventName) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        var listeners = this.listeners[eventName];
        if (listeners && listeners.size) {
            listeners.forEach(function (listener) { return listener.apply(void 0, data); });
        }
        return this;
    };
    PubSub.prototype.clearListeners = function () {
        this.listeners = {};
    };
    return PubSub;
}());
exports.PubSub = PubSub;
exports.PubSubInstance = exports.PubSubInstance || new PubSub();
