import { action, computed, observable } from "mobx";
import { IBusyWatcher } from "./types";

export default class BusyWatcher implements IBusyWatcher {
  @observable private counter = 0;

  @computed get isBusy() {
    return this.counter > 0;
  }

  @action.bound
  getBusyTicket() {
    this.counter++;

    let wasUsed = false;
    return () => {
      if (!wasUsed) {
        wasUsed = true;
        this.decrement();
      }
    };
  }

  @action.bound
  watch<T>(watchedAction: Promise<T>) {
    this.counter++;
    watchedAction.then(this.decrement, this.decrement);
    return watchedAction;
  }

  @action.bound
  private decrement() {
    this.counter--;
  }
}

export function watchBusy(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalFunction = descriptor.value as (...args: any) => Promise<any>;

  descriptor.value = function (this: { busyWatcher?: BusyWatcher }, ...args: any[]) {
    const result = originalFunction.apply(this, args);

    if (typeof result?.then === "function") {
      result.then(undefined, (error: any) => console.error(error));

      if (this.busyWatcher && typeof this.busyWatcher.watch === "function") {
        void this.busyWatcher.watch(result);
      }
    }

    return result;
  };
}
