/**
 * The definition of reactive data container that lives inside global (window or node.js global) context
 */
export type ReactiveDataContainer = {
  data: Map<number, Reactive<unknown>>;
  lastUsedId: number;
};

export interface ICallbackValues<valueType> {
  previousValue?: valueType;
  newValue?: valueType;
}

/**
 * Describes single Reactive Entity.
 * **Do not use it, since it will not be reactive!!!**
 * **This class only serves type and shape informations about your reactive values**
 */
export type Reactive<initialValueType> = {
  /**
   * Key of reactive value that sits inside `window.$reactiveDataContainer`
   * **Do not use it to retrieve or change the value!
   * use `value` instead!**
   */
  key: number;
  /**
   * The value that reacts on every changes
   */
  value: initialValueType;
  /**
   * Callback that returns freshly updated value. Mainly needed to make reactive value work.
   * **IF YOU WANT TO GET VALUE, JUST USE `value` INSTEAD OF THIS**
   */
  callbackThatReturnsUpdatedValue: () => initialValueType;
};
