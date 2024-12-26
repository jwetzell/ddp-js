const { deepEqual, throws } = require('assert');
const { describe, it } = require('node:test');
const ddp = require('../dist/cjs/index');

const goodTests = [
];

const badTests = [
  
];

describe('DDP Message Decoding Pass', () => {
  goodTests.forEach((messageTest) => {
    it(messageTest.description, () => {
      const decoded = ddp.decode(messageTest.bytes);
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
