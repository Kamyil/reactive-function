import { PubSubInstance } from './PubSub';

export type ReactiveValue<typeOfInitialValue = unknown> = {
  /**
   * Key of reactive value that sits inside `window.$reactiveDataContainer`
   * **Do not use it to retrieve or change the value!
   * use `value` instead!**
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

export type IReactiveDataContainer = {
  data: Map<number, ReactiveValue<unknown>>;
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
 * Allows to perform provided callbacks on given ReactiveValue change
 * @param callback - Callback to perform
 */
export function onChange<typeofReactiveValue>(
  reactiveValueToListenTo: ReactiveValue<typeofReactiveValue>,
  callback: ({ previousValue, newValue }) => void
): void {
  PubSubInstance.subscribe(
    `reactiveValue:${reactiveValueToListenTo.key}:change`,
    ({ previousValue, newValue }) => {
      callback({ previousValue, newValue });
    }
  );
}

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
): ReactiveValue<typeOfInitialValue> {
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

  const newReactiveEntity = new Proxy(
    {
      key: lastUsedId,
      callbackThatReturnsUpdatedValue: callbackThatReturnsValue,
      value: callbackThatReturnsValue(),
    },
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
            return callbackThatReturnsValue;
        }
      },
    }
  );

  executionContext.$reactiveDataContainer.data.set(lastUsedId, {
    key: lastUsedId,
    callbackThatReturnsUpdatedValue: callbackThatReturnsValue,
    value: callbackThatReturnsValue(),
  });

  executionContext.$reactiveDataContainer.lastUsedId++;

  return newReactiveEntity;
}
