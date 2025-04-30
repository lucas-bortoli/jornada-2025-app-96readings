/**
 * A packet decoder for reading binary data in little-endian format.
 * The buffer must have been written with a PacketBuilder to ensure correct ordering.
 */
export default class PacketDecoder {
  private buffer: Uint8Array;
  private capacity: number;
  private position: number;

  /**
   * Initializes a new PacketDecoder with the specified buffer.
   * @param buffer The buffer containing the encoded packet data.
   */
  constructor(buffer: Uint8Array) {
    this.buffer = buffer;
    this.capacity = buffer.length;
    this.position = 0;
  }

  /**
   * Reads an 8-bit unsigned integer from the current position.
   */
  readUInt8(): number {
    if (this.position + 1 > this.capacity) {
      throw new Error("Insufficient space in packet buffer");
    }
    return this.buffer[this.position++];
  }

  /**
   * Reads an 8-bit signed integer from the current position.
   */
  readInt8(): number {
    return this.readUInt8();
  }

  /**
   * Reads a 16-bit unsigned integer from the current position.
   */
  readUInt16(): number {
    if (this.position + 2 > this.capacity) {
      throw new Error("Insufficient space in packet buffer");
    }
    const low = this.buffer[this.position++];
    const high = this.buffer[this.position++];
    return (high << 8) | low;
  }

  /**
   * Reads a 16-bit signed integer from the current position.
   */
  readInt16(): number {
    return this.readUInt16();
  }

  /**
   * Reads a 32-bit unsigned integer from the current position.
   */
  readUInt32(): number {
    if (this.position + 4 > this.capacity) {
      throw new Error("Insufficient space in packet buffer");
    }
    const b0 = this.buffer[this.position++];
    const b1 = this.buffer[this.position++];
    const b2 = this.buffer[this.position++];
    const b3 = this.buffer[this.position++];
    return (b3 << 24) | (b2 << 16) | (b1 << 8) | b0;
  }

  /**
   * Reads a 32-bit signed integer from the current position.
   */
  readInt32(): number {
    return this.readUInt32();
  }

  /**
   * Reads a 64-bit unsigned integer from the current position.
   */
  readUInt64(): bigint {
    if (this.position + 8 > this.capacity) {
      throw new Error("Insufficient space in packet buffer");
    }
    let value = 0n;
    for (let i = 0; i < 8; i++) {
      value = (value << 8n) | BigInt(this.buffer[this.position++]);
    }
    return value;
  }

  /**
   * Reads a 64-bit signed integer from the current position.
   */
  readInt64(): bigint {
    return this.readUInt64();
  }

  /**
   * Returns the current position in the buffer.
   */
  getPosition(): number {
    return this.position;
  }

  /**
   * Returns the total capacity of the buffer.
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Returns the current buffer slice up to the current position.
   */
  getBuffer(): Uint8Array {
    return this.buffer.subarray(0, this.position);
  }
}
