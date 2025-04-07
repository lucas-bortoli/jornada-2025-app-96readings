import { AnimatePresence } from "framer-motion";
import {
  ActionDispatch,
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  RefObject,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { useBackButtonHandler } from "../back_button";
import sequence, { Sequence } from "../sequence_generator";
import WindowContainer from "./window_container";

export type WindowKey = Sequence;
const makeWindowKey = sequence();

export type BackButtonHandler = (
  currentWindowKey: WindowKey,
  dispatch: ActionDispatch<[action: Action]>
) => BackButtonAction;
type BackButtonAction = "DisposeCurrentWindow" | "Ignore";

type Component = (props: any) => ReactNode;
type PropsOf<C extends Component> = Parameters<C>[0] extends undefined ? {} : Parameters<C>[0];

export interface Window<P> {
  key: WindowKey;
  manifest: Manifest<P>;
  component: Component;
  props: P;
  title: string | null;
  backButtonHandler: RefObject<BackButtonHandler | null> | null;
}

type WindowUpdater = Pick<Partial<Window<any>>, "title" | "backButtonHandler">;

interface State {
  windows: Window<any>[];
}

type Action =
  | { kind: "WmCreateWindow"; window: Window<any> }
  | { kind: "WmRemoveWindow"; key: WindowKey }
  | {
      kind: "WmUpdateWindow";
      key: WindowKey;
      updates: WindowUpdater;
    };

function reducer(state: State, action: Action): State {
  const getWindow = (key: WindowKey) => {
    const found = state.windows.find((win) => win.key === key);
    if (!found) throw new Error(`Window ${key} not found.`);
    return found;
  };

  switch (action.kind) {
    case "WmCreateWindow": {
      return {
        ...state,
        windows: [...state.windows, { ...action.window }],
      };
    }
    case "WmRemoveWindow": {
      return {
        ...state,
        windows: [...state.windows.filter((win) => win.key !== action.key)],
      };
    }
    case "WmUpdateWindow": {
      const updated = { ...getWindow(action.key), ...action.updates };

      return {
        ...state,
        windows: [...state.windows.filter((win) => win.key !== action.key), updated],
      };
    }
  }
}

const initialState: State = { windows: [] };

const context = createContext<{ state: State; dispatch: Dispatch<Action> }>({
  state: initialState,
  dispatch: () => null,
});

export function WindowManagerProvider(props: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useBackButtonHandler(() => {
    const topmostWindow = state.windows.at(-1);
    if (topmostWindow && state.windows.length >= 2) {
      const action: BackButtonAction =
        topmostWindow.backButtonHandler?.current?.(topmostWindow.key, dispatch) ??
        "DisposeCurrentWindow";

      switch (action) {
        case "Ignore":
          break;
        case "DisposeCurrentWindow":
          dispatch({ kind: "WmRemoveWindow", key: topmostWindow.key });
          break;
      }
    }
  });

  return <context.Provider value={{ state, dispatch }}>{props.children}</context.Provider>;
}

export function WindowsOutlet() {
  const { state } = useContext(context);

  // Sort windows array so they are always in a stable order. We need to do this because if the order changes, React re-renders the window DOM element, losing things like scroll positions in the application (even if the key is the same)
  const windows = state.windows.slice().toSorted((a, b) => a.key - b.key);

  return (
    <div className="relative z-0 h-[100lvh] w-[100lvw] overflow-hidden">
      <AnimatePresence>
        {windows.map((window, index) => {
          return <WindowContainer key={window.key} window={window} zIndex={index} />;
        })}
      </AnimatePresence>
    </div>
  );
}

/**
 * The useWindowing hook. This is the WindowManager's public API.
 */
export function useWindowing() {
  const wm = useContext(context);

  return useMemo(() => {
    function createWindow<P>(manifest: Manifest<P>, props: P) {
      const window = {
        key: makeWindowKey(),
        manifest,
        component: manifest.component,
        props: props,
        title: manifest.initialTitle(props),
        backButtonHandler: null,
      } satisfies Window<P>;

      wm.dispatch({ kind: "WmCreateWindow", window });

      return window.key;
    }

    function updateWindow(key: WindowKey, updates: WindowUpdater) {
      wm.dispatch({ kind: "WmUpdateWindow", key, updates });
    }

    function removeWindow(key: WindowKey) {
      wm.dispatch({ kind: "WmRemoveWindow", key });
    }

    return {
      windows: wm.state.windows as ReadonlyArray<Window<any>>,
      createWindow,
      updateWindow,
      removeWindow,
    };
  }, [wm.state]);
}

export interface Manifest<P> {
  component: Component;
  initialTitle: (props: P) => string;
  hasAnimation: boolean;
}

export function manifest<C extends Component>(
  component: C,
  options: Omit<Manifest<PropsOf<C>>, "component">
) {
  return {
    component,
    ...options,
  } satisfies Manifest<PropsOf<C>>;
}
