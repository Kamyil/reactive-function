/**
 * @description Makes given value reactive, which means that it will react and change on internal/other depdendent reactive value changes
 * inside application and it will returns freshly updated value every single time
 *
 * @param value - Value that will react on changes or callback that will determine how initial and every freshly updated value will look like.
 * If given reactive value is going to be independent - it can be passed directly.
 * However if you want to make it dependent from other reactive values, you need to pass it as a callback in order
 * to prevent JavaScript to early compute your value model with loosing reference to your variable in the same time.
 * 
 * @example
 * ```ts
 * // Like here - simple values can be passed directly
 * let firstNumber = reactive(2);
 * 
 * // ... but if other values have to be dependent on other reactive values
 * // then you have to pass it as a callback to prevent JavaScript from early computing your expression
 * // into some value without any references to your variables
 * let secondNumber = reactive(() => firstNumber.value * 2);
 * console.log(secondNumber.value); // => 4

 * firstNumber.value = 10;
 *
 * console.log(secondNumber.value); // => 20
 * 
 * // You can also pass arrays and objects
 * let testArray = reactive([1, 2, 3]);
 * let testObject = reactive({
 *   name: 'Kamil',
 *   age: 23
 * });
 * 
 * // But they cannot be mutated since they will loose reference
 * // Rather assign new object / array to them
 * testArray.value = [...testArray.value, 4];
 * testObject.value = {
 *  ...testObject.value,
 *  favoriteHero: 'Daredevil'
 * } 
 * 
 * // If you use TypeScript, you can (but don't have to since generics do type inference here)
 * // also pass your interfaces or types
 * type Person = {
 *   name: string;
 *   age: number;
 *   favoriteHero?: string;
 * };
 * 
 * testObject = reactive<Person>({
 *   name: 'Kamyil',
 *   age: 24,
 * });
 * ```
 * @returns Initial and updated on every change value
 */
declare function reactive<initialValueType>(
  value: initialValueType | (() => initialValueType)
): Reactive<initialValueType>;

/**
 * Stops tracking given reactive value and optionally performs an given callback if any provided
 * @param reactiveValue
 * @param callbackOnTrackStop
 */
declare function stopTracking<reactiveValueType>(
  reactiveValue: Reactive<reactiveValueType>,
  callbackOnTrackStop?: ({ currentValue }: { currentValue: unknown }) => unknown
);

/**
 * Allows to keep reactive value in sync with HTML element
 * @param reactiveValue
 * @param elementOrSelector
 * @param options
 */
declare function syncWithHTML<reactiveValueType>(
  reactiveValue: Reactive<reactiveValueType>,
  elementOrSelector: HTMLElement | string,
  options?: {
    useDangerousInnerHTML?: boolean;
    callback?: ({
      previousValue,
      newValue,
    }: ICallbackValues<reactiveValueType>) => unknown;
  }
);

/**
 * Allows to perform provided callbacks on given Reactive value change
 * @param callback - Callback to perform
 */
declare function trackChanges<reactiveValueType>(
  reactiveValueToTrack: Reactive<reactiveValueType>,
  callback: ({
    previousValue,
    newValue,
  }: ICallbackValues<reactiveValueType>) => void
): void;

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
