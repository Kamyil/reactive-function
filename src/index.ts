import { Reactive, ReactiveDataContainer } from './types';
import { reactive } from './reactive';
import { stopTracking } from './stopTracking';
import { syncWithHTML } from './syncWithHTML';
import { trackChanges } from './trackChanges';

declare global {
  interface Window {
    $reactiveDataContainer: ReactiveDataContainer;
    reactive: <initialValueType>(
      value: initialValueType | (() => initialValueType)
    ) => Reactive<initialValueType>;
  }
  namespace NodeJS {
    interface Global {
      $reactiveDataContainer: ReactiveDataContainer;
      reactive: <initialValueType>(
        value: initialValueType | (() => initialValueType)
      ) => Reactive<initialValueType>;
    }
  }
}

export { reactive, stopTracking, syncWithHTML, trackChanges };
