import { PubSubInstance } from './PubSub';
import { Reactive } from './types';

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
  let executionContext;

  if (typeof window === 'undefined') {
    executionContext = global;
  } else executionContext = window;

  if (!executionContext.$reactiveDataContainer) {
    executionContext.$reactiveDataContainer = {
      data: new Map(),
      lastUsedId: 0,
    };
  }

  const lastUsedId = executionContext.$reactiveDataContainer.lastUsedId;

  const newReactiveEntity: Reactive<initialValueType> = new Proxy(
    {
      key: lastUsedId,
      callbackThatReturnsUpdatedValue:
        typeof value === 'function'
          ? (value as () => initialValueType)
          : () => value,
      value:
        typeof value === 'function'
          ? (value as () => initialValueType)()
          : value,
    },
    {
      set: (target, _key, value) => {
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
    callbackThatReturnsUpdatedValue:
      typeof value === 'function'
        ? (value as () => initialValueType)
        : () => value,
    value:
      typeof value === 'function' ? (value as () => initialValueType)() : value,
  });

  executionContext.$reactiveDataContainer.lastUsedId++;

  return newReactiveEntity;
}
