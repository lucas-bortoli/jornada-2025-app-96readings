import { BleClient } from "@capacitor-community/bluetooth-le";
import { ImperativeObject } from "../imperative_object";
import generateUUID from "../uuid";

const SERVICE_UUID = "df2f1391-514a-4ec9-9750-e47859e49d88";
const CHARACTERISTIC_UUID = "fcf4d9d0-5c0c-43f6-bb2c-f19c5177ce7e";

class BluetoothOps implements ImperativeObject {
  public uuid: string = generateUUID();
  public state: "Connected" | "TryingToConnect" = "TryingToConnect";

  public async setupConnection() {
    await BleClient.initialize({
      androidNeverForLocation: true,
    });

    const device = await BleClient.requestDevice({
      services: [SERVICE_UUID],
    });

    console.log("Got device:", device);
  }

  public onUnmount() {}
}

//@ts-expect-error
window.BluetoothOps = BluetoothOps;

//@ts-expect-error
window.BleClient = BleClient;
