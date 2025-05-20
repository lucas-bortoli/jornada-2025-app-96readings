import { useEffect, useState } from "react";
import { gbus, useMiniGBus } from "./gbus_mini";
import generateUUID, { UUID } from "./uuid";

export type ObjectUUID = UUID<"ObjectUUID">;
export const makeObjectUUID = () => generateUUID<ObjectUUID>();

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
 * Listens to an imperative object that can trigger re-renders when internally mutated.
 *
 * This hook:
 * - Subscribes to internal mutation events to force React re-renders.
 * - Cleans up subscriptions on unmount.
 *
 * @param object -The imperative object that will be listened for changes
 * @returns - The same imperative object (pass-through)
 */
export default function useObjectSubscription<O extends ImperativeObject>(object: O): O {
  const gbus = useMiniGBus();
  const [, forceUpdate] = useState(false);

  useEffect(() => {
    const eventKey = gbus.subscribe("imperativeUpdate", (payload) => {
      if (payload.objectUUID === object.uuid) {
        // force a re-render when this object is updated internally
        forceUpdate((prev) => !prev);
      }
    });

    return () => {
      gbus.unsubscribe(eventKey);
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
