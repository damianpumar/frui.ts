/* eslint-disable @typescript-eslint/no-empty-function */
import { bound } from "@frui.ts/helpers";
import { computed, observable } from "mobx";
import { isNavigationParent } from "../navigation/helpers";
import NavigationConfiguration from "../navigation/navigationConfiguration";
import { NavigationPath } from "../navigation/navigationPath";
import { ICanNavigate } from "../navigation/types";
import { IChild, IConductor, IScreen } from "./types";

export default abstract class ScreenBase implements IScreen, IChild, ICanNavigate {
  navigationName: string;
  @observable name: string;
  parent: IConductor<ScreenBase>;

  // child

  canDeactivate(isClosing: boolean): Promise<boolean> | boolean {
    return true;
  }

  @bound
  requestClose(): Promise<boolean> | boolean {
    return this.parent?.closeChild(this) ?? false;
  }

  // activation

  private isInitialized = false;
  @observable protected isActiveValue = false;
  @computed get isActive() {
    return this.isActiveValue;
  }

  // this ensures that activateInner will be called only once even if it takes longer time
  private activatePromise?: Promise<void>;
  private clearActivatePromise: () => void = () => (this.activatePromise = undefined);
  activate() {
    return (
      this.activatePromise ||
      (this.activatePromise = this.activateInner().then(this.clearActivatePromise, this.clearActivatePromise))
    );
  }

  private async activateInner() {
    if (this.isActiveValue) {
      return;
    }

    await this.initialize();

    try {
      await this.onActivate();
    } catch (error) {
      console.error(error);
    }

    this.isActiveValue = true;
    this.notifyNavigationChanged();
  }

  private async initialize() {
    if (!this.isInitialized) {
      try {
        await this.onInitialize();
      } catch (error) {
        console.error(error);
      }

      this.isInitialized = true;
    }
  }

  // this ensures that deactivateInner will be called only once even if it takes a longer time
  private deactivatePromise?: Promise<void>;
  private clearDeactivatePromise: () => void = () => (this.deactivatePromise = undefined);
  deactivate(close: boolean) {
    return (
      this.deactivatePromise ||
      (this.deactivatePromise = this.deactivateInner(close).then(this.clearDeactivatePromise, this.clearDeactivatePromise))
    );
  }
  private async deactivateInner(close: boolean) {
    if (this.isActiveValue || (this.isInitialized && close)) {
      try {
        await this.onDeactivate(close);
      } catch (error) {
        console.error(error);
      }

      this.isActiveValue = false;
    }
  }

  protected onInitialize(): Promise<any> | void {}

  protected onActivate(): Promise<any> | void {}

  protected onDeactivate(close: boolean): Promise<any> | void {}

  // navigation

  protected get canBeNavigationActiveScreen() {
    return true;
  }

  protected notifyNavigationChanged() {
    if (this.canBeNavigationActiveScreen && NavigationConfiguration.onScreenChanged) {
      NavigationConfiguration.onScreenChanged(this);
    }
  }

  // you can override this function to navigate to children, react to params, etc.
  navigate(subPath: string | undefined, params: any): Promise<any> | void {}

  // you can override this function to add params, manipulate the address, etc.
  getNavigationPath(): NavigationPath {
    if (this.parent && isNavigationParent(this.parent)) {
      return this.parent.getChildNavigationPath(this);
    } else {
      return { path: this.navigationName, isClosed: false };
    }
  }
}
