import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";

/**
 * A strongly typed event bus with pub/sub and RPC capabilities.
 *
 * @template Events - A map of event names to their payload types.
 * @template RPCs - A map of RPC method names to their function signatures.
 */
class MiniGBus<
  Events extends Record<string, any>,
  RPCs extends Record<string, (...args: any[]) => any>,
> {
  private listeners = new Map<number, { event: keyof Events; callback: (payload: any) => void }>();
  private rpcHandlers: { [K in keyof RPCs]?: RPCs[K] } = {};
  private idCounter = 0;

  /**
   * Subscribes to an event.
   * @returns A globally unique ID for the listener, used to unsubscribe.
   */
  subscribe<K extends keyof Events>(event: K, callback: (payload: Events[K]) => void): number {
    const id = this.idCounter++;
    this.listeners.set(id, { event, callback });
    return id;
  }

  /**
   * Unsubscribes a listener by its unique ID.
   */
  unsubscribe(id: number): void {
    this.listeners.delete(id);
  }

  /**
   * Emits an event, notifying all registered listeners.
   */
  publish<K extends keyof Events>(event: K, payload: Events[K]): void {
    for (const { event: registeredEvent, callback } of this.listeners.values()) {
      if (registeredEvent === event) callback(payload);
    }
  }

  /**
   * Registers an RPC method.
   */
  register<K extends keyof RPCs>(method: K, handler: RPCs[K]): void {
    this.rpcHandlers[method] = handler;
  }

  /**
   * Unregisters an RPC method.
   */
  unregister<K extends keyof RPCs>(method: K): void {
    delete this.rpcHandlers[method];
  }

  /**
   * Calls a registered RPC method and returns a promise with the result.
   */
  async invoke<K extends keyof RPCs>(
    method: K,
    ...args: Parameters<RPCs[K]>
  ): Promise<ReturnType<RPCs[K]>> {
    const handler = this.rpcHandlers[method];
    if (!handler) throw new Error(`RPC method "${String(method)}" is not registered.`);
    return await handler(...args);
  }
}

// React Integration
type Events = {
  imperativeUpdate: { objectUUID: string };
  backButton: null;
  bluetoothSensorData: Uint32Array;
};
type Procedures = {};

const reactContext = createContext<MiniGBus<Events, Procedures> | null>(null);

export const gbus = new MiniGBus<Events, Procedures>();

export function MiniGBusProvider(props: PropsWithChildren) {
  return <reactContext.Provider value={gbus}>{props.children}</reactContext.Provider>;
}

export function useMiniGBus() {
  return useContext(reactContext)!;
}

export function useMiniGBusSubscription<K extends keyof Events>(
  topic: K,
  callback: (value: Events[K]) => void
) {
  const gbus = useMiniGBus();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const subscription = gbus.subscribe(topic, (value) => {
      callbackRef.current(value);
    });

    return () => gbus.unsubscribe(subscription);
  }, [topic, gbus]);
}
