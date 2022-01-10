import { PubSubInstance } from './PubSub';

/**
 * Describes single Reactive Entity.
 * **Do not use it, since it will not be reactive!!!**
 * **This class only serves type and shape informations about your reactive values**
 */
export class Reactive<initialValueType = unknown> {
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

  constructor({ key, value, callbackThatReturnsUpdatedValue }) {
    this.key = key;
    this.value = value;
    this.callbackThatReturnsUpdatedValue = callbackThatReturnsUpdatedValue;
  }
}

export type IReactiveDataContainer = {
  data: Map<number, Reactive<unknown>>;
  lastUsedId: number;
};

declare global {
  interface Window {
    $reactiveDataContainer: IReactiveDataContainer;
  }
  namespace NodeJS {
    interface Global {
      $reactiveDataContainer: IReactiveDataContainer;
    }
  }
}

/**
 * Allows to perform provided callbacks on given Reactive value change
 * @param callback - Callback to perform
 *
 * @returns Object with `stopWatching` method that can be used to stop this watcher
 * from watching value anymore with possibility to run callback on watchFinish
 */
export function trackChanges<reactiveValueType>(
  reactiveValueToTrack: Reactive<reactiveValueType>,
  callback: ({ previousValue, newValue }) => void
): { stopTracking: (callbackOnWatchStop?: () => unknown) => void } {
  PubSubInstance.subscribe(
    `reactiveValue:${reactiveValueToTrack.key}:change`,
    ({ previousValue, newValue }) => {
      callback({ previousValue, newValue });
    }
  );

  return {
    stopTracking: (callbackOnTrackStop?: () => unknown) => {
      PubSubInstance.unsubscribe(
        `reactiveValue:${reactiveValueToTrack.key}:change`,
        callbackOnTrackStop
      );
    },
  };
}

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
export function reactive<initialValueType>(
  value: initialValueType | (() => initialValueType)
): Reactive<initialValueType> {
  /**
   * Determines if function is being executed inside a Browser or NodeJS
   */
  const executionContext = window ? window : global;

  if (!executionContext.$reactiveDataContainer) {
    executionContext.$reactiveDataContainer = {
      data: new Map(),
      lastUsedId: 0,
    };
  }

  const lastUsedId = executionContext.$reactiveDataContainer.lastUsedId;

  const newReactiveEntity: Reactive<initialValueType> = new Proxy(
    new Reactive({
      key: lastUsedId,
      callbackThatReturnsUpdatedValue:
        typeof value === 'function' ? value : () => value,
      // @ts-ignore
      value: typeof value === 'function' ? value() : value,
    }),
    {
      set: (target, key, value) => {
        PubSubInstance.publish(`reactiveValue:${target.key}:change`, {
          previousValue: target.callbackThatReturnsUpdatedValue(),
          newValue: value,
        });

        executionContext.$reactiveDataContainer.data.set(target.key, {
          key: target.key,
          callbackThatReturnsUpdatedValue: () => value,
          value: value,
        });

        return true;
      },
      get: (
        target,
        propertyCalledToGet: 'key' | 'value' | 'callbackThatReturnsUpdatedValue'
      ) => {
        if (!executionContext.$reactiveDataContainer.data.get(target.key)) {
          return target.callbackThatReturnsUpdatedValue();
        } else {
          const newValue = executionContext.$reactiveDataContainer.data
            .get(target.key)
            .callbackThatReturnsUpdatedValue();

          if (propertyCalledToGet === 'key') return target.key;
          else if (propertyCalledToGet === 'value') return newValue;
          else if (propertyCalledToGet === 'callbackThatReturnsUpdatedValue')
            return value;
        }
      },
    }
  );

  executionContext.$reactiveDataContainer.data.set(lastUsedId, {
    key: lastUsedId,
    // @ts-ignore
    callbackThatReturnsUpdatedValue:
      typeof value === 'function' ? value : () => value,
    // @ts-ignore
    value: typeof value === 'function' ? value() : value,
  });

  executionContext.$reactiveDataContainer.lastUsedId++;

  return newReactiveEntity;
}
