export type ReactiveValue<typeOfInitialValue = unknown> = {
  /**
   * Key of reactive value that sits inside `window.$reactiveDataContainer` with this key
   */
  key: number;
  /**
   * The value that reacts on every changes
   */
  value: typeOfInitialValue;
  /**
   * Callback that returns freshly updated value. Mainly needed to make reactive value work.
   * **IF YOU WANT TO GET VALUE, JUST USE `value` INSTEAD OF THIS**
   */
  callbackThatReturnsUpdatedValue: () => typeOfInitialValue;
};

/**
 * The definition of reactive data container that lives inside global (window or node.js global) context
 */
export type IReactiveDataContainer = {
  data: Map<number, ReactiveValue<unknown>>;
  lastUsedId: number;
};

/**
 * @description Makes given value reactive, which means that it will react and change on internal/other depdendent reactive value changes
 * inside application and it will returns freshly updated value every single time
 * 
 * This function will be highly valuable, when you need to have reactive data without need to use any reactive JS framework
 * @param callbackThatReturnsValue - The callback that determines how initial and every freshly updated value will look like
 *
 * @example
 * ```ts
 * let firstNumber = reactive(() => 2);
 * let secondNumber = reactive(() => firstNumber.value * 2);
 * 
 * console.log(secondNumber.value); // => 4

 * firstNumber.value = 10;
 *
 * console.log(secondNumber.value); // => 20
 * ```
 * @returns Initial and updated on every change value
 */
export function reactive<typeOfInitialValue>(
  callbackThatReturnsValue: () => typeOfInitialValue
): ReactiveValue<typeOfInitialValue>;
