/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./PubSub.ts":
/*!*******************!*\
  !*** ./PubSub.ts ***!
  \*******************/
/*! namespace exports */
/*! export PubSub [provided] [no usage info] [missing usage info prevents renaming] */
/*! export PubSubInstance [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PubSub\": () => /* binding */ PubSub,\n/* harmony export */   \"PubSubInstance\": () => /* binding */ PubSubInstance\n/* harmony export */ });\nclass PubSub {\n  constructor() {\n    this.listeners = {};\n  }\n  subscribe(eventName, eventHandler) {\n    if (!this.listeners[eventName]) {\n      this.listeners[eventName] = new Set();\n    }\n    this.listeners[eventName].add(eventHandler);\n    return this;\n  }\n  unsubscribe(eventName, eventHandler) {\n    if (this.listeners[eventName].has(eventHandler)) {\n      this.listeners[eventName].delete(eventHandler);\n    }\n    return this;\n  }\n  publish(eventName, ...data) {\n    const listeners = this.listeners[eventName];\n    if (listeners && listeners.size) {\n      listeners.forEach((listener) => listener(...data));\n    }\n    return this;\n  }\n  clearListeners() {\n    this.listeners = {};\n  }\n}\nlet PubSubInstance;\nPubSubInstance = PubSubInstance || new PubSub();\n\n\n//# sourceURL=webpack://@kamyil/reactive-function/./PubSub.ts?");

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/*! namespace exports */
/*! export onChange [provided] [no usage info] [missing usage info prevents renaming] */
/*! export reactive [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.g, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"onChange\": () => /* binding */ onChange,\n/* harmony export */   \"reactive\": () => /* binding */ reactive\n/* harmony export */ });\n/* harmony import */ var _PubSub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PubSub */ \"./PubSub.ts\");\n;\nfunction onChange(reactiveValueToListenTo, callback) {\n  _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSubInstance.subscribe(`reactiveValue:${reactiveValueToListenTo.key}:change`, ({previousValue, newValue}) => {\n    console.log(\"it happened!\", previousValue, newValue);\n    callback({previousValue, newValue});\n  });\n}\nfunction reactive(callbackThatReturnsValue) {\n  const executionContext = window ? window : __webpack_require__.g;\n  if (!executionContext.$reactiveDataContainer) {\n    executionContext.$reactiveDataContainer = {\n      data: new Map(),\n      lastUsedId: 0\n    };\n  }\n  const lastUsedId = executionContext.$reactiveDataContainer.lastUsedId;\n  const newReactiveEntity = new Proxy({\n    key: lastUsedId,\n    callbackThatReturnsUpdatedValue: callbackThatReturnsValue,\n    value: callbackThatReturnsValue()\n  }, {\n    set: (target, key, value) => {\n      _PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSubInstance.publish(`reactiveValue:${target.key}:change`, {\n        previousValue: target.callbackThatReturnsUpdatedValue(),\n        newValue: value\n      });\n      console.log(_PubSub__WEBPACK_IMPORTED_MODULE_0__.PubSubInstance);\n      executionContext.$reactiveDataContainer.data.set(target.key, {\n        key: target.key,\n        callbackThatReturnsUpdatedValue: () => value,\n        value\n      });\n      console.log(`reactiveValue:${target.key}:change`);\n      return true;\n    },\n    get: (target, propertyCalledToGet) => {\n      if (!executionContext.$reactiveDataContainer.data.get(target.key)) {\n        return target.callbackThatReturnsUpdatedValue();\n      } else {\n        const newValue = executionContext.$reactiveDataContainer.data.get(target.key).callbackThatReturnsUpdatedValue();\n        if (propertyCalledToGet === \"key\")\n          return target.key;\n        else if (propertyCalledToGet === \"value\")\n          return newValue;\n        else if (propertyCalledToGet === \"callbackThatReturnsUpdatedValue\")\n          return callbackThatReturnsValue;\n      }\n    }\n  });\n  executionContext.$reactiveDataContainer.data.set(lastUsedId, {\n    key: lastUsedId,\n    callbackThatReturnsUpdatedValue: callbackThatReturnsValue,\n    value: callbackThatReturnsValue()\n  });\n  executionContext.$reactiveDataContainer.lastUsedId++;\n  return newReactiveEntity;\n}\nlet Car = reactive(() => ({\n  color: \"green\",\n  width: 200,\n  height: 300,\n  length: 300,\n  positionX: 0,\n  positionY: 0,\n  propultion: \"front\",\n  weight: 500\n}));\nonChange(Car, ({previousValue, newValue}) => {\n  console.log(`previousValue was: ${previousValue.height} and the new value is: ${newValue.height}`);\n});\nCar.value = {\n  ...Car.value,\n  height: 50\n};\n\n\n//# sourceURL=webpack://@kamyil/reactive-function/./index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./index.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;