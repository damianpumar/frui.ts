import type { LifecycleScreenNavigator, ScreenBase } from "@frui.ts/screens";
import { getNavigator } from "@frui.ts/screens";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { UNSAFE_RouteContext, useLocation } from "react-router";
import type { ViewComponent } from "../types";
import View from "./view";

// use custom context provider to customize `createInstance` (e.g., using DI container)
export const DependenciesContext = React.createContext({ createInstance: activateInstance });

type constructor<T> = new (...args: any[]) => T;
function activateInstance<T>(type: constructor<T>): T {
  return new type();
}

/**
 * Maintains instance of the specified view model type and handles its life cycle
 * @param viewModelType
 * Type of the view models that should be instantiated
 * @returns
 * Instance of the specified view model type
 */
export default function useViewModel<TViewModel extends ScreenBase>(viewModelType: constructor<TViewModel>) {
  const location = useLocation();
  const routeContext = useContext(UNSAFE_RouteContext);
  const { createInstance } = useContext(DependenciesContext);
  const [viewModel] = useState(() => createInstance(viewModelType));

  useEffect(() => {
    const navigator = getNavigator<LifecycleScreenNavigator>(viewModel);
    if (navigator?.deactivate) {
      return () => void navigator.deactivate?.(true);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const navigator = getNavigator<LifecycleScreenNavigator>(viewModel);
    if (navigator) {
      const currentRoute = routeContext.matches.length > 0 ? routeContext.matches[routeContext.matches.length - 1] : undefined;
      void navigator.navigate(
        [{ name: currentRoute?.route.path ?? currentRoute?.pathname ?? "", params: currentRoute?.params }],
        location
      );
    }
  }, [location]);

  return viewModel;
}

/**
 * Helper that wraps the provided view inside an `obsever`
 * and calls `useViewModel` to instantiate the view model
 * @param viewModelType
 * Type of the view models that should be instantiated
 * @param view
 * Actual view to be bound to the view model
 * @returns
 * View component observing its own instance of the view model
 */
export function createViewFirst<TViewModel extends ScreenBase>(
  viewModelType: constructor<TViewModel>,
  view: React.FunctionComponent<{ vm: TViewModel }>
) {
  const ObserverView = observer(view);
  return () => {
    const vm = useViewModel<TViewModel>(viewModelType);
    return <ObserverView vm={vm} />;
  };
}

/**
 * Typed helper that simplifies creating views for view models
 * @param render
 * Actual view render function
 * @returns
 * View model-observing view component
 */
export function createViewComponent<TViewModel>(
  render: (vm: TViewModel) => React.ReactElement | null
): ViewComponent<TViewModel> {
  return observer(({ vm }) => render(vm));
}

interface ViewElementProps {
  type: Parameters<typeof useViewModel>[0];
  context?: string;
}

/** Helper for React Router `element` definition */
export function ViewElement(props: ViewElementProps) {
  const vm = useViewModel(props.type);
  return (
    <View vm={vm} context={props.context} useLifecycle={false}>
      Could not find view for {props.type.name}
    </View>
  );
}

export function viewModel(type: Parameters<typeof useViewModel>[0], context?: string) {
  return {
    element: <ViewElement type={type} context={context} />,
  };
}
