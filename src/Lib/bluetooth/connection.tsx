import { BleClient, BleDevice, ScanResult } from "@capacitor-community/bluetooth-le";
import { Capacitor } from "@capacitor/core";
import { ImperativeObject, notifyUpdate } from "../imperative_object";
import generateUUID from "../uuid";

/**
 * A class for handling Bluetooth LE (Low Energy) operations, such as connecting to a device, sending control commands,
 * and receiving status updates.
 */
const SERVICE_UUID = "686ae9e3-0b45-485c-90bb-9442f3571af7";
const CONTROL_CHARACTERISTIC_UUID = "e750171f-7796-4d77-bdfb-5b16dff6dc59";
const STATUS_CHARACTERISTIC_UUID = "13e827f5-ecde-4927-b5f4-fd3f27ac89ee";

enum ControlAction {
  Increase = 0,
  Decrease = 1,
  SetPWM = 2,
  Stop = 3,
}

/**
 * A class for managing Bluetooth LE (Low Energy) operations.
 * Implements the `ImperativeObject` interface for state and event updates.
 */
export default class BluetoothOps implements ImperativeObject {
  /**
   * A unique identifier for this BluetoothOps instance.
   */
  public uuid: string = generateUUID();

  /**
   * The current state of the Bluetooth connection.
   * Can be one of: "NotConnected", "Connecting", or "Connected".
   */
  public state: "NotConnected" | "Connecting" | "Connected" = "NotConnected";

  /**
   * The current PWM value (0–255) reported by the device.
   */
  public pwm: number = 0;

  /**
   * The device ID of the connected BLE device.
   */
  private deviceId: string | null = null;

  /**
   * Callback for status updates from the device.
   */
  private onStatusUpdateCallback: ((value: number) => void) | null = null;

  /**
   * Callback for handling errors during Bluetooth operations.
   */
  private onErrorCallback: ((error: Error) => void) | null = null;

  /**
   * Initializes a Bluetooth connection to a compatible device.
   * @returns A promise that resolves when the connection is established.
   * @throws If connection fails or no device is found.
   */
  public async setupConnection(): Promise<void> {
    try {
      await this.checkPermissions();
      this.state = "Connecting";
      notifyUpdate(this);

      await this.initializeBle();
      const device = await this.selectDevice();
      this.deviceId = device.deviceId;

      await this.connectToDevice();
      await this.discoverServices();
      await this.subscribeToStatus();

      this.state = "Connected";
      console.log("Connection established.");
      notifyUpdate(this);
    } catch (error) {
      console.error("Connection failed:", error);
      this.state = "NotConnected";
      this.onErrorCallback?.(error as Error);
      notifyUpdate(this);
    }
  }

  /**
   * Checks for Android-specific location permissions.
   * @throws If location services are not enabled and cannot be opened.
   */
  private async checkPermissions(): Promise<void> {
    if (Capacitor.getPlatform() === "android") {
      const isLocationEnabled = await BleClient.isLocationEnabled();
      if (!isLocationEnabled) {
        await BleClient.openLocationSettings();
      }
    }
  }

  /**
   * Selects a BLE device based on the platform.
   * On web, uses the browser's `requestDevice` API.
   * On Android, uses a custom scan with `requestLEScan`.
   * @returns A Promise that resolves to the selected device.
   * @throws If no device is selected or found.
   */
  private async selectDevice(): Promise<BleDevice> {
    if (Capacitor.getPlatform() === "web") {
      const device = await BleClient.requestDevice({
        services: [SERVICE_UUID],
      });
      if (!device) {
        throw new Error("Device selection canceled.");
      }
      return device;
    } else {
      const scanResult = await this.scanForDevice();
      if (!scanResult) {
        throw new Error("No device found during scan.");
      }
      return scanResult;
    }
  }

  /**
   * Scans for a BLE device with the specified service UUID.
   * @param timeout - The maximum time in milliseconds to scan.
   * @returns A Promise that resolves to the first matching device or null if none found.
   */
  private async scanForDevice(timeout: number = 15000): Promise<BleDevice | null> {
    return new Promise((resolve) => {
      const scanCallback = (result: ScanResult) => {
        console.log(result);
        if (result.uuids?.includes(SERVICE_UUID)) {
          BleClient.stopLEScan();
          resolve(result.device);
        }
      };

      BleClient.requestLEScan({ services: [SERVICE_UUID] }, scanCallback);

      setTimeout(() => {
        BleClient.stopLEScan();
        resolve(null);
      }, timeout);
    });
  }

  /**
   * Initializes the BLE client on the platform.
   * @throws If initialization fails.
   */
  private async initializeBle(): Promise<void> {
    await BleClient.initialize({ androidNeverForLocation: true });
  }

  /**
   * Connects to the device using its ID.
   * @throws If no device ID is available or connection fails.
   */
  private async connectToDevice(): Promise<void> {
    if (!this.deviceId) throw new Error("No device ID available");
    await BleClient.connect(this.deviceId, (deviceId) => this.handleDisconnect(deviceId));
  }

  /**
   * Discovers the required BLE service on the connected device.
   * @throws If the service is not found.
   */
  private async discoverServices(): Promise<void> {
    try {
      const services = await BleClient.getServices(this.deviceId!);
      console.info({ services });
      const serviceFound = services.some((service) => service.uuid === SERVICE_UUID);
      if (!serviceFound) {
        throw new Error("Required service not found.");
      }
    } catch (error) {
      console.error("Failed to discover services:", error);
      this.state = "NotConnected";
      this.onErrorCallback?.(error as Error);
    }
  }

  /**
   * Subscribes to the status characteristic to receive updates.
   * @throws If subscription fails.
   */
  private async subscribeToStatusCharacteristic(): Promise<void> {
    try {
      await BleClient.startNotifications(
        this.deviceId!,
        SERVICE_UUID,
        STATUS_CHARACTERISTIC_UUID,
        (value) => {
          const status = value.getUint8(0);
          console.log("Status update received:", status);
          this.pwm = status;
          notifyUpdate(this);
          this.onStatusUpdateCallback?.(status);
        }
      );
    } catch (error) {
      console.error("Failed to subscribe to status characteristic:", error);
      this.onErrorCallback?.(error as Error);
    }
  }

  /**
   * Subscribes to the status characteristic for updates.
   * @throws If subscription fails.
   */
  private async subscribeToStatus(): Promise<void> {
    await this.subscribeToStatusCharacteristic();
  }

  /**
   * Sends a control command to the device.
   * @param action - The type of control action (e.g., Increase, Decrease, SetPWM, Stop).
   * @param value - The value associated with the action.
   * @throws If not connected or invalid value.
   */
  private async sendControlCommand(action: ControlAction, value: number): Promise<void> {
    if (this.state !== "Connected") {
      throw new Error("Cannot send control command: not connected.");
    }
    const command = new Uint8Array([action, value]);
    try {
      await BleClient.write(
        this.deviceId!,
        SERVICE_UUID,
        CONTROL_CHARACTERISTIC_UUID,
        new DataView(command.buffer),
        { timeout: 5000 }
      );
      console.log(`Sent control command: ${ControlAction[action]} with value ${value}`);
    } catch (error) {
      console.error("Failed to send control command:", error);
      this.onErrorCallback?.(error as Error);
    }
  }

  /**
   * Increases the PWM value by the specified delta.
   * @param delta - The amount to increase the PWM (must be > 0).
   * @throws If not connected or delta ≤ 0.
   */
  public async increasePWM(delta: number): Promise<void> {
    if (delta <= 0) {
      throw new Error("Delta must be greater than 0.");
    }
    await this.sendControlCommand(ControlAction.Increase, delta);
  }

  /**
   * Decreases the PWM value by the specified delta.
   * @param delta - The amount to decrease the PWM (must be > 0).
   * @throws If not connected or delta ≤ 0.
   */
  public async decreasePWM(delta: number): Promise<void> {
    if (delta <= 0) {
      throw new Error("Delta must be greater than 0.");
    }
    await this.sendControlCommand(ControlAction.Decrease, delta);
  }

  /**
   * Sets the PWM value directly.
   * @param value - The PWM value (0–255).
   * @throws If not connected or value is out of range.
   */
  public async setPWM(value: number): Promise<void> {
    if (value < 0 || value > 255) {
      throw new Error("PWM value must be between 0 and 255.");
    }
    await this.sendControlCommand(ControlAction.SetPWM, value);
  }

  /**
   * Stops the motor by sending a stop command.
   * @throws If not connected.
   */
  public async stopMotor(): Promise<void> {
    await this.sendControlCommand(ControlAction.Stop, 0);
  }

  /**
   * Retrieves the current PWM value from the device.
   * @returns The current PWM value (0–255).
   * @throws If not connected or read fails.
   */
  public async getCurrentPWM(): Promise<number> {
    if (this.state !== "Connected") {
      throw new Error("Cannot get PWM: not connected.");
    }

    try {
      const result = await BleClient.read(
        this.deviceId!,
        SERVICE_UUID,
        STATUS_CHARACTERISTIC_UUID,
        { timeout: 5000 }
      );
      return result.getUint8(0);
    } catch (error) {
      console.error("Failed to read current PWM:", error);
      this.onErrorCallback?.(error as Error);
      throw error;
    }
  }

  /**
   * Registers a callback to handle status updates from the device.
   * @param callback - A function that receives the current PWM value.
   */
  public onStatusUpdate(callback: (value: number) => void): void {
    this.onStatusUpdateCallback = callback;
  }

  /**
   * Registers a callback to handle errors during Bluetooth operations.
   * @param callback - A function that receives an Error object.
   */
  public onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Checks if the device is currently connected.
   * @returns `true` if connected, `false` otherwise.
   */
  public isConnected(): boolean {
    return this.state === "Connected";
  }

  /**
   * Handles device disconnection events.
   * @param deviceId - The ID of the device that disconnected.
   */
  private handleDisconnect(deviceId: string): void {
    console.log(`Device ${deviceId} disconnected`);
    this.state = "NotConnected";
    this.onErrorCallback?.(new Error(`Device ${deviceId} disconnected`));
  }

  /**
   * Disconnects from the Bluetooth device and updates the state.
   * @throws If disconnection fails.
   */
  public async disconnect(): Promise<void> {
    if (this.state === "Connected" && this.deviceId) {
      try {
        await BleClient.disconnect(this.deviceId);
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    }
    this.state = "NotConnected";
    notifyUpdate(this);
  }
}

//@ts-expect-error
window.BluetoothOps = BluetoothOps;

//@ts-expect-error
window.BleClient = BleClient;
