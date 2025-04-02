import { createContext, PropsWithChildren, useContext, useMemo } from "react";

/**
 * A strongly typed event bus with both pub/sub and RPC capabilities.
 *
 * @template Events - A map of event names to their payload types.
 * @template RPCs - A map of RPC method names to their function signatures.
 */
class MiniGBus<
  Events extends Record<string, any>,
  RPCs extends Record<string, (...args: any[]) => any>,
> {
  private listeners: {
    [K in keyof Events]?: Array<{ id: number; callback: (payload: Events[K]) => void }>;
  } = {};
  private rpcHandlers: { [K in keyof RPCs]?: RPCs[K] } = {};
  private idCounter = 0;

  /**
   * Subscribes to an event.
   *
   * @param event - The event name.
   * @param callback - The function to call when the event is emitted.
   * @returns - A unique ID for the listener, which can be used to unsubscribe.
   */
  on<K extends keyof Events>(event: K, callback: (payload: Events[K]) => void): number {
    const id = this.idCounter++;
    (this.listeners[event] ||= []).push({ id, callback });
    return id;
  }

  /**
   * Unsubscribes a specific event listener.
   *
   * @param event - The event name.
   * @param id - The listener ID returned by `on()`.
   */
  off<K extends keyof Events>(event: K, id: number): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event]!.filter((listener) => listener.id !== id);
    }
  }

  /**
   * Emits an event, notifying all registered listeners.
   *
   * @param event - The event name.
   * @param payload - The event data to pass to listeners.
   */
  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    (this.listeners[event] || []).forEach(({ callback }) => callback(payload));
  }

  /**
   * Registers an RPC method.
   *
   * @param method - The RPC method name.
   * @param handler - The function to handle RPC calls.
   */
  register<K extends keyof RPCs>(method: K, handler: RPCs[K]): void {
    this.rpcHandlers[method] = handler;
  }

  /**
   * Unregisters an RPC method.
   *
   * @param method - The RPC method name to remove.
   */
  unregister<K extends keyof RPCs>(method: K): void {
    delete this.rpcHandlers[method];
  }

  /**
   * Calls a registered RPC method and returns a promise with the result.
   *
   * @param method - The RPC method name.
   * @param args - Arguments for the RPC function.
   * @returns - A promise resolving with the RPC result.
   * @throws If the method is not registered.
   */
  async call<K extends keyof RPCs>(
    method: K,
    ...args: Parameters<RPCs[K]>
  ): Promise<ReturnType<RPCs[K]>> {
    if (!this.rpcHandlers[method]) {
      throw new Error(`RPC method "${String(method)}" is not registered.`);
    }
    return await this.rpcHandlers[method]!(...args);
  }
}

type Events = {};
type Procedures = {};

const reactContext = createContext<MiniGBus<Events, Procedures> | null>(null);

export function MiniGBusProvider(props: PropsWithChildren) {
  const gbus = useMemo(() => new MiniGBus<Events, Procedures>(), [])!;
  return <reactContext.Provider value={gbus}>{props.children}</reactContext.Provider>;
}

export function useMiniGBus() {
  return useContext(reactContext);
}
