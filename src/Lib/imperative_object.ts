import { useEffect, useMemo, useState } from "react";
import { gbus, useMiniGBus } from "./gbus_mini";

export type ObjectUUID = string & { _tag?: "objectUUID" };

/**
 * Represents an imperative object with a unique identifier.
 * Can optionally define a cleanup function that runs on unmount.
 */
export interface ImperativeObject {
  /** Unique identifier for the imperative object */
  uuid: ObjectUUID;
  /** Optional cleanup function executed when the object is unmounted */
  onUnmount?: () => void;
}

/**
 * Creates an imperative object that can trigger re-renders when externally mutated.
 *
 * This hook:
 * - Instantiates the object using the provided factory function.
 * - Subscribes to external mutation events to force React re-renders.
 * - Cleans up subscriptions on unmount.
 *
 * @param factory - Factory function that creates the imperative object
 * @returns - The instantiated imperative object
 */
export default function useImperativeObject<O extends ImperativeObject>(factory: () => O): O {
  const object = useMemo(factory, []);
  const gbus = useMiniGBus();
  const [, forceUpdate] = useState(false);

  useEffect(() => {
    const eventKey = gbus.subscribe("imperativeUpdate", (payload) => {
      if (payload.objectUUID === object.uuid) {
        // force a re-render when this object is updated externally
        forceUpdate((prev) => !prev);
      }
    });

    return () => {
      gbus.unsubscribe(eventKey);
      object.onUnmount?.();
    };
  }, [object]);

  return object;
}

/**
 * Notifies the system that an imperative object has been externally updated.
 *
 * @param object - The object or object ID that was mutated
 */
export function notifyUpdate(object: ImperativeObject | ObjectUUID): void {
  gbus.publish("imperativeUpdate", {
    objectUUID: typeof object === "string" ? object : object.uuid,
  });
}
