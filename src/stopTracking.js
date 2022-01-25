"use strict";
exports.__esModule = true;
exports.stopTracking = void 0;
var PubSub_1 = require("./PubSub");
/**
 * Stops tracking given reactive value and optionally performs an given callback if any provided
 * @param reactiveValue
 * @param callbackOnTrackStop
 */
function stopTracking(reactiveValue, callbackOnTrackStop) {
    PubSub_1.PubSubInstance.unsubscribe("reactiveValue:".concat(reactiveValue.key, ":change"), callbackOnTrackStop ? callbackOnTrackStop : function () { });
}
exports.stopTracking = stopTracking;
