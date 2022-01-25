import { PubSubInstance } from './PubSub';
import { ICallbackValues, Reactive } from './types';

/**
 * Allows to perform provided callbacks on given Reactive value change
 * @param callback - Callback to perform
 */
export function trackChanges<reactiveValueType>(
  reactiveValueToTrack: Reactive<reactiveValueType>,
  callback: ({
    previousValue,
    newValue,
  }: ICallbackValues<reactiveValueType>) => void
): void {
  PubSubInstance.subscribe(
    `reactiveValue:${reactiveValueToTrack.key}:change`,
    ({ previousValue, newValue }: ICallbackValues<reactiveValueType>) => {
      console.log(previousValue);
      console.log(newValue);
      callback({ previousValue, newValue });
    }
  );
}
