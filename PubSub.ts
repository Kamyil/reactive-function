export class PubSub {
  listeners: {
    [index: string]: Set<CallableFunction>;
  };

  constructor() {
    this.listeners = {};
  }

  /**
   * @description  Subscribe eventHandler to custom event
   *
   * @param  eventName  Event Name to subscribe to
   * @param  eventHandler  Event Handler callback
   */
  subscribe(eventName: string, eventHandler: CallableFunction): PubSub {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }
    this.listeners[eventName].add(eventHandler);
    return this;
  }

  /**
   * @description  Unsubscribe eventHandler from custom event
   *
   * @param  eventName  Event Name to subscribe to
   * @param  eventHandler  Event Handler callback
   */
  unsubscribe(eventName: string, eventHandler: CallableFunction): PubSub {
    if (this.listeners[eventName].has(eventHandler)) {
      this.listeners[eventName].delete(eventHandler);
    }
    return this;
  }

  /**
   * @description  When called will dispatch all listeners (subscriptions) to the
   *               event
   *
   * @param  eventName  Event to be published
   * @param  data  Data to be passed to all subscribers
   */
  publish(eventName: string, ...data: unknown[]): PubSub {
    const listeners = this.listeners[eventName];

    if (listeners && listeners.size) {
      listeners.forEach((listener: CallableFunction) => listener(...data));
    }

    return this;
  }

  clearListeners(): void {
    this.listeners = {};
  }
}

export let PubSubInstance: PubSub;
PubSubInstance = PubSubInstance || new PubSub();
