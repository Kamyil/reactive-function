import { Reactive } from './types';
import { PubSubInstance } from './PubSub';

type CallbackArguments = {
  currentValue: unknown;
};

/**
 * Stops tracking given reactive value and optionally performs an given callback if any provided
 * @param reactiveValue
 * @param callbackOnTrackStop
 */
export function stopTracking<reactiveValueType>(
  reactiveValue: Reactive<reactiveValueType>,
  callbackOnTrackStop?: ({ currentValue }: CallbackArguments) => unknown
) {
  PubSubInstance.unsubscribe(
    `reactiveValue:${reactiveValue.key}:change`,
    callbackOnTrackStop ? callbackOnTrackStop : () => {}
  );
}
