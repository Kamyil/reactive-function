import { ICallbackValues, Reactive } from './types';
import { trackChanges } from './trackChanges';

/**
 * Allows to keep reactive value in sync with HTML element
 * @param reactiveValue
 * @param elementOrSelector
 * @param options
 */
export function syncWithHTML<reactiveValueType>(
  reactiveValue: Reactive<reactiveValueType>,
  elementOrSelector: HTMLElement | string,
  options: {
    useDangerousInnerHTML?: boolean;
    callback?: ({
      previousValue,
      newValue,
    }: ICallbackValues<reactiveValueType>) => unknown;
  } = {
    useDangerousInnerHTML: false,
  }
) {
  let element: HTMLElement;

  if (typeof elementOrSelector === 'string') {
    element = document.querySelector(elementOrSelector);
  } else element = elementOrSelector;

  trackChanges(reactiveValue, ({ previousValue, newValue }) => {
    if (previousValue === newValue) {
      // Pass unnecesary change trigger
      return;
    } else {
      // else call that something changed
      if (options.useDangerousInnerHTML) element.innerHTML = String(newValue);
      else element.textContent = String(newValue);

      if (options.callback) options.callback({ previousValue, newValue });
    }
  });
}
