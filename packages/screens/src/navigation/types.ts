import type PathElement from "../models/pathElements";

export interface ScreenNavigator {
  readonly isActive: boolean;

  canNavigate(path: PathElement[]): Promise<boolean> | boolean;
  navigate(path: PathElement[]): Promise<void>;

  navigationName: string;
  getNavigationState(): PathElement;

  parent: ScreenNavigator | undefined;
  getPrimaryChild(): ScreenNavigator | undefined;
}

export interface LifecycleScreenNavigator extends ScreenNavigator {
  canDeactivate(isClosing: boolean): Promise<boolean> | boolean;
  deactivate(isClosing: boolean): Promise<void>;
}
