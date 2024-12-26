const { deepEqual, throws } = require('assert');
const { describe, it } = require('node:test');
const ddp = require('../dist/cjs/index');

const goodTests = [
  {
    description: 'simple DDP packet',
    bytes: new Uint8Array([0x40, 0x0f, 0x92, 0x01, 0x45, 0x67, 0x89, 0x10, 0x10, 0x11]),
    expected: {
      header: {
        flags: {
          version: 1,
          timecode: false,
          storage: false,
          reply: false,
          query: false,
          push: false,
        },
        sequenceNumber: 15,
        dataType: {
          standard: false,
          type: 2,
          bitsPerPixel: 4,
        },
        sourceOrDestinationID: 1,
        dataOffset: 1164413200,
        dataLength: 4113,
      },
      data: new Uint8Array([])
    },
  },
  {
    description: 'DDP packet with timecode',
    bytes: new Uint8Array([0x50, 0x0f, 0x92, 0x01, 0x45, 0x67, 0x89, 0x10, 0x10, 0x11, 0x10, 0x11, 0x11, 0x10]),
    expected: {
      header: {
        flags: {
          version: 1,
          timecode: true,
          storage: false,
          reply: false,
          query: false,
          push: false,
        },
        sequenceNumber: 15,
        dataType: {
          standard: false,
          type: 2,
          bitsPerPixel: 4,
        },
        sourceOrDestinationID: 1,
        dataOffset: 1164413200,
        dataLength: 4113,
        timecode: {
          seconds: 4113,
          fractionalSeconds: 4368,
        },
      },
      data: new Uint8Array([])

    },
  },
];

const badTests = [];

describe('DDP Message Decoding Pass', () => {
  goodTests.forEach((messageTest) => {
    it(messageTest.description, () => {
      const decoded = ddp.decode(messageTest.bytes);
      console.log(decoded.header);
      deepEqual(decoded, messageTest.expected);
    });
  });
});

describe('DDP Message Decoding Throws', () => {
  badTests.forEach((messageTest) => {
    it(messageTest.description, () => {
      throws(() => {
        ddp.decode(messageTest.bytes);
      }, messageTest.throwsMessage);
    });
  });
});
