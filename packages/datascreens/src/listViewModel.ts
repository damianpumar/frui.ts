import { IPagingInfo, PagedQueryResult } from "@frui.ts/data";
import { ConductorSingleChild, ScreenBase } from "@frui.ts/screens";
import { action, observable } from "mobx";

export default abstract class ListViewModel<TEntity, TDetail extends ScreenBase = ScreenBase> extends ConductorSingleChild<
  TDetail
> {
  @observable.shallow items: TEntity[];

  /** Paging information relevant to the data in `items`. */
  @observable currentPaging: IPagingInfo;

  @action.bound
  protected setData([items, paging]: PagedQueryResult<TEntity>) {
    this.items = items;
    this.currentPaging = paging;
  }

  protected findNavigationChild(navigationName: string | undefined): Promise<TDetail | undefined> | TDetail | undefined {
    return undefined;
  }
}
