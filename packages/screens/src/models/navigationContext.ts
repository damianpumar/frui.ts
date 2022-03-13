import type { ScreenNavigator } from "../navigation/types";
import type { PathElement } from "./pathElements";

export interface NavigationContext<TScreen = unknown, TNavigationParams = unknown, TLocation = unknown> {
  screen?: TScreen;
  navigator: ScreenNavigator;
  navigationParams?: TNavigationParams;
  location?: TLocation;

  path: PathElement[];
}

export interface ClosingNavigationContext<TScreen = unknown> {
  screen?: TScreen;
  navigator: ScreenNavigator;
  isClosing: boolean;
}
