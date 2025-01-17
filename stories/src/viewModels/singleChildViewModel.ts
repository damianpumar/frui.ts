import type { FindNavigationChildHandler } from "@frui.ts/screens";
import { ActiveChildConductor, ScreenBase } from "@frui.ts/screens";
import ChildViewModel from "./childViewModel";
import type { IChildScreen } from "./types";

export default class SingleChildViewModel extends ScreenBase<ActiveChildConductor<ChildViewModel>> implements IChildScreen {
  name = "Single active";

  constructor() {
    super();
    this.navigator = new ActiveChildConductor<ChildViewModel>(this);
    this.navigator.navigationName = "single";
    this.navigator.findNavigationChild = this.findNavigationChild;
  }

  private findNavigationChild: FindNavigationChildHandler<ChildViewModel> = context => {
    const childPathElement = context.path.length > 1 && context.path[1];
    if (childPathElement) {
      if (childPathElement.name === this.navigator.activeChild?.navigator.navigationName) {
        return Promise.resolve({
          newChild: this.navigator.activeChild,
          closePrevious: false,
        });
      }

      const newChild = new ChildViewModel(childPathElement.name, `Child ${childPathElement.name}`);
      newChild.navigator.parent = context.navigator;
      return Promise.resolve({
        newChild,
        closePrevious: true,
      });
    }

    // close
    return Promise.resolve({
      newChild: undefined,
      closePrevious: true,
    });
  };
}
