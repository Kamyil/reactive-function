import { ICallbackValues, Reactive } from '../index';
import { PubSubInstance } from './PubSub';

/**
 * Allows to perform provided callbacks on given Reactive value change
 * @param callback - Callback to perform
 */
export function trackChanges<reactiveValueType>(
  reactiveValueToTrack: Reactive<reactiveValueType>,
  callback: ({ previousValue, newValue }: ICallbackValues) => void
): void {
  PubSubInstance.subscribe(
    `reactiveValue:${reactiveValueToTrack.key}:change`,
    ({ previousValue, newValue }: ICallbackValues) => {
      callback({ previousValue, newValue });
    }
  );
}
