import type { Awaitable } from "@frui.ts/helpers";
import { BusyWatcher, ScreenBase } from "@frui.ts/screens";
import { action, observable } from "mobx";

export default abstract class DetailViewModel<TEntity> extends ScreenBase {
  busyWatcher = new BusyWatcher();
  @observable item: TEntity;

  @action.bound
  setItem(item: TEntity) {
    this.item = item;
  }

  async onInitialize() {
    const item = await this.loadDetail();
    if (item) {
      this.setItem(item);
    }
  }
  protected abstract loadDetail(): Awaitable<TEntity | undefined>;
}
