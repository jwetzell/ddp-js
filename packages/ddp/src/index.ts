export enum DDPDataType {
  UNDEFINED = 0,
  RGB = 1,
  HSL = 2,
  RGBW = 3,
  GRAYSCALE = 4,
}

export enum DDPID {
  JSON_CONTROL = 246,
  JSON_CONFIG = 250,
  JSON_STATUS = 251,
  DMX_TRANSIT = 254,
  ALL = 255,
}

export type DDPHeader = {
  flags: {
    version: number;
    timecode: boolean;
    storage: boolean;
    reply: boolean;
    query: boolean;
    push: boolean;
  };
  sequenceNumber: number;
  dataType: {
    standard: boolean;
    type: number;
    bitsPerPixel: number;
  };
  sourceOrDestinationID: number;
  dataOffset: number;
  dataLength: number;
  timecode?: {
    seconds: number;
    fractionalSeconds: number;
  };
};

export type DDPPacket = {
  header: DDPHeader;
  data: Uint8Array;
};

export function decode(bytes: Uint8Array): DDPPacket {
  if (bytes.length < 10) {
    throw new Error('DDP packet must be at least 10 bytes');
  }

  const flagsByte = bytes[0];

  const flags = {
    version: (flagsByte & 0xc0) >> 6,
    timecode: (flagsByte & 0x10) >> 4 === 1,
    storage: (flagsByte & 0x08) >> 3 === 1,
    reply: (flagsByte & 0x04) >> 2 === 1,
    query: (flagsByte & 0x02) >> 1 === 1,
    push: (flagsByte & 0x01) === 1,
  };
  const sequenceNumber = bytes[1] & 0x0f;

  const dataTypeByte = bytes[2];

  const dataType = {
    standard: dataTypeByte >> 7 === 0,
    type: (dataTypeByte & 0x38) >> 3,
    bitsPerPixel: dataTypeByte & 0x07,
  };

  if (dataType.bitsPerPixel > 1) {
    if (dataType.bitsPerPixel === 2) {
      dataType.bitsPerPixel = 4;
    } else if (dataType.bitsPerPixel === 3) {
      dataType.bitsPerPixel = 8;
    } else if (dataType.bitsPerPixel === 4) {
      dataType.bitsPerPixel = 16;
    } else if (dataType.bitsPerPixel === 5) {
      dataType.bitsPerPixel = 24;
    } else if (dataType.bitsPerPixel === 6) {
      dataType.bitsPerPixel = 32;
    } else {
      throw new Error('unknown DDP size');
    }
  }

  const sourceOrDestinationID = bytes[3];
  const dataOffset = (bytes[4] << 24) + (bytes[5] << 16) + (bytes[6] << 8) + bytes[7];
  const dataLength = (bytes[8] << 8) + bytes[9];

  const header: DDPHeader = {
    flags,
    sequenceNumber,
    dataType,
    sourceOrDestinationID,
    dataOffset,
    dataLength,
  };

  let dataStart = 10;
  if (flags.timecode) {
    if (bytes.length < 14) {
      throw new Error('DDP packet with timecode must be at least 14 bytes');
    }
    dataStart = 14;
    header.timecode = {
      seconds: (bytes[10] << 8) + bytes[11],
      fractionalSeconds: (bytes[12] << 8) + bytes[13],
    };
  }

  return {
    header,
    data: bytes.subarray(dataStart),
  };
}
