import { AnimatePresence } from "framer-motion";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";
import sequence, { Sequence } from "../sequence_generator";
import useBackButton from "./use_back_button";
import WindowContainer from "./window_container";

export type WindowKey = Sequence;
const makeWindowKey = sequence();

export interface Window<P> {
  key: WindowKey;
  title: string;
  noAnimation: boolean;
  backButton: boolean;
  component: (props: P) => ReactNode;
  props: P;
}

interface State {
  windows: Window<any>[];
}

type Action =
  | { kind: "WmCreateWindow"; window: Window<any> }
  | { kind: "WmRemoveWindow"; key: WindowKey }
  | { kind: "WmUpdateWindow"; key: WindowKey; updates: Omit<Partial<Window<any>>, "key"> };

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

  useBackButton(() => {
    const topmostWindow = state.windows.at(-1);
    if (topmostWindow && state.windows.length > 1 && topmostWindow.backButton) {
      dispatch({ kind: "WmRemoveWindow", key: topmostWindow.key });
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
    function createWindow<P extends object>(options: {
      component: (props: P) => ReactNode | null;
      props: P;
      title: string;
      noAnimation?: boolean;
      backButton?: boolean;
    }) {
      const window = {
        key: makeWindowKey(),
        title: options.title,
        component: options.component,
        props: options.props,
        noAnimation: options.noAnimation ?? false,
        backButton: options.backButton ?? true,
      } satisfies Window<P>;

      wm.dispatch({ kind: "WmCreateWindow", window });

      return window.key;
    }

    function removeSpecificWindow(key: WindowKey) {
      wm.dispatch({ kind: "WmRemoveWindow", key });
    }

    return {
      windows: wm.state.windows as ReadonlyArray<Window<any>>,
      createWindow,
      removeSpecificWindow,
    };
  }, [wm.state]);
}
