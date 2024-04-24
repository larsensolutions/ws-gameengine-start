/* eslint-disable @typescript-eslint/ban-types */
// This is a simple event bus implementation that allows you to subscribe to events and emit them. It not typesafe, but it's a good starting point for a simple game engine.
export class EventBus {
  private events: { [key: string]: Function[] };
  private constructor() {
    this.events = {};
  }

  static Of(): EventBus {
    return new EventBus();
  }

  on(eventName: string, callback: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName: string, ...args: (Record<string, never> | undefined)[]) {
    const eventListeners = this.events[eventName];
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(...args));
    }
  }

  off(eventName: string | number, callback: Function) {
    const eventListeners = this.events[eventName];
    if (eventListeners) {
      this.events[eventName] = eventListeners.filter((cb) => cb !== callback);
    }
  }
}
