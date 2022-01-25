import { ReactiveDataContainer } from './types';
import { reactive } from './reactive';
import { stopTracking } from './stopTracking';
import { syncWithHTML } from './syncWithHTML';
import { trackChanges } from './trackChanges';

declare global {
  interface Window {
    $reactiveDataContainer: ReactiveDataContainer;
  }
  namespace NodeJS {
    interface Global {
      $reactiveDataContainer: ReactiveDataContainer;
    }
  }
}

export { reactive, stopTracking, syncWithHTML, trackChanges };
