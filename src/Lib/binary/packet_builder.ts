/**
 * A packet builder for constructing binary data in little-endian format.
 * The buffer has a fixed capacity, and appending data will panic if there is insufficient space.
 */
export default class PacketBuilder {
  private buffer: Uint8Array;
  private capacity: number;
  private position: number;
  private isLittleEndian: boolean;

  /**
   * Initializes a new PacketBuilder with the specified capacity.
   * @param capacity The maximum number of bytes the buffer can hold.
   */
  constructor(capacity: number) {
    this.buffer = new Uint8Array(capacity);
    this.capacity = capacity;
    this.position = 0;
    this.isLittleEndian = this.checkEndianness();
  }

  /**
   * Checks whether the system uses little-endian byte order.
   * @returns True if the system is little-endian, false otherwise.
   */
  private checkEndianness(): boolean {
    const view = new DataView(new ArrayBuffer(2));
    view.setUint16(0, 0x1234, false); // Write as big-endian
    return view.getUint8(0) === 0x34;
  }

  /**
   * Appends an 8-bit unsigned integer to the buffer.
   * @param value The value to append.
   */
  appendUint8(value: number): void {
    if (this.position + 1 > this.capacity) {
      throw new Error("Insufficient space in packet buffer");
    }
    this.buffer[this.position++] = value;
  }

  /**
   * Appends an 8-bit signed integer to the buffer.
   * @param value The value to append.
   */
  appendInt8(value: number): void {
    this.appendUint8(value & 0xff);
  }

  /**
   * Appends a 16-bit unsigned integer to the buffer in little-endian format.
   * @param value The value to append.
   */
  appendUint16(value: number): void {
    if (this.position + 2 > this.capacity) {
      throw new Error("Insufficient space in packet buffer");
    }
    if (this.isLittleEndian) {
      this.buffer[this.position] = value & 0xff;
      this.buffer[this.position + 1] = (value >> 8) & 0xff;
    } else {
      this.buffer[this.position] = (value >> 8) & 0xff;
      this.buffer[this.position + 1] = value & 0xff;
    }
    this.position += 2;
  }

  /**
   * Appends a 16-bit signed integer to the buffer in little-endian format.
   * @param value The value to append.
   */
  appendInt16(value: number): void {
    this.appendUint16(value & 0xffff);
  }

  /**
   * Appends a 32-bit unsigned integer to the buffer in little-endian format.
   * @param value The value to append.
   */
  appendUint32(value: number): void {
    if (this.position + 4 > this.capacity) {
      throw new Error("Insufficient space in packet buffer");
    }
    if (this.isLittleEndian) {
      this.buffer[this.position] = value & 0xff;
      this.buffer[this.position + 1] = (value >> 8) & 0xff;
      this.buffer[this.position + 2] = (value >> 16) & 0xff;
      this.buffer[this.position + 3] = (value >> 24) & 0xff;
    } else {
      this.buffer[this.position] = (value >> 24) & 0xff;
      this.buffer[this.position + 1] = (value >> 16) & 0xff;
      this.buffer[this.position + 2] = (value >> 8) & 0xff;
      this.buffer[this.position + 3] = value & 0xff;
    }
    this.position += 4;
  }

  /**
   * Appends a 32-bit signed integer to the buffer in little-endian format.
   * @param value The value to append.
   */
  appendInt32(value: number): void {
    this.appendUint32(value & 0xffffffff);
  }

  /**
   * Appends a 64-bit unsigned integer to the buffer in little-endian format.
   * @param value The value to append.
   */
  appendUint64(value: bigint): void {
    if (this.position + 8 > this.capacity) {
      throw new Error("Insufficient space in packet buffer");
    }
    if (this.isLittleEndian) {
      this.buffer[this.position] = Number(value & 0xffn);
      this.buffer[this.position + 1] = Number((value >> 8n) & 0xffn);
      this.buffer[this.position + 2] = Number((value >> 16n) & 0xffn);
      this.buffer[this.position + 3] = Number((value >> 24n) & 0xffn);
      this.buffer[this.position + 4] = Number((value >> 32n) & 0xffn);
      this.buffer[this.position + 5] = Number((value >> 40n) & 0xffn);
      this.buffer[this.position + 6] = Number((value >> 48n) & 0xffn);
      this.buffer[this.position + 7] = Number((value >> 56n) & 0xffn);
    } else {
      this.buffer[this.position] = Number((value >> 56n) & 0xffn);
      this.buffer[this.position + 1] = Number((value >> 48n) & 0xffn);
      this.buffer[this.position + 2] = Number((value >> 40n) & 0xffn);
      this.buffer[this.position + 3] = Number((value >> 32n) & 0xffn);
      this.buffer[this.position + 4] = Number((value >> 24n) & 0xffn);
      this.buffer[this.position + 5] = Number((value >> 16n) & 0xffn);
      this.buffer[this.position + 6] = Number((value >> 8n) & 0xffn);
      this.buffer[this.position + 7] = Number(value & 0xffn);
    }
    this.position += 8;
  }

  /**
   * Appends a 64-bit signed integer to the buffer in little-endian format.
   * @param value The value to append.
   */
  appendInt64(value: bigint): void {
    this.appendUint64(value & 0xffffffffn);
  }

  /**
   * Returns a view of the buffer.
   * @returns A Uint8Array containing the current packet data.
   */
  getBuffer(): Uint8Array {
    return this.buffer;
  }
}
