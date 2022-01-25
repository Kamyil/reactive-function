"use strict";
exports.__esModule = true;
exports.trackChanges = void 0;
var PubSub_1 = require("./PubSub");
/**
 * Allows to perform provided callbacks on given Reactive value change
 * @param callback - Callback to perform
 */
function trackChanges(reactiveValueToTrack, callback) {
    PubSub_1.PubSubInstance.subscribe("reactiveValue:".concat(reactiveValueToTrack.key, ":change"), function (_a) {
        var previousValue = _a.previousValue, newValue = _a.newValue;
        console.log(previousValue);
        console.log(newValue);
        callback({ previousValue: previousValue, newValue: newValue });
    });
}
exports.trackChanges = trackChanges;
