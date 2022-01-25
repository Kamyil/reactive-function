"use strict";
exports.__esModule = true;
exports.syncWithHTML = void 0;
var trackChanges_1 = require("./trackChanges");
/**
 * Allows to keep reactive value in sync with HTML element
 * @param reactiveValue
 * @param elementOrSelector
 * @param options
 */
function syncWithHTML(reactiveValue, elementOrSelector, options) {
    var element;
    if (typeof options.useDangerousInnerHTML === 'undefined')
        options.useDangerousInnerHTML = false;
    if (typeof elementOrSelector === 'string') {
        element = document.querySelector(elementOrSelector);
    }
    else
        element = elementOrSelector;
    (0, trackChanges_1.trackChanges)(reactiveValue, function (_a) {
        var previousValue = _a.previousValue, newValue = _a.newValue;
        if (previousValue === newValue) {
            // Pass unnecesary change trigger
            return;
        }
        else {
            // else call that something changed
            if (options.useDangerousInnerHTML)
                element.innerHTML = String(newValue);
            else
                element.textContent = String(newValue);
            if (options.callback)
                options.callback({ previousValue: previousValue, newValue: newValue });
        }
    });
}
exports.syncWithHTML = syncWithHTML;
