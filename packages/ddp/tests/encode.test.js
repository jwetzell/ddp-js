const { deepEqual, throws } = require('assert');
const { describe, it } = require('node:test');
const ddp = require('../dist/cjs/index');

const goodTests = [
  
];

const badTests = [
  
];

describe('DDP Message Encoding Pass', () => {
  goodTests.forEach((messageTest) => {
    it(messageTest.description, () => {
      const encoded = ddp.encode(messageTest.message);
      deepEqual(encoded, messageTest.expected);
    });
  });
});

describe('DDP Message Encoding Throws', () => {
  badTests.forEach((messageTest) => {
    it(messageTest.description, () => {
      throws(() => {
        ddp.encode(messageTest.message);
      }, messageTest.throwsMessage);
    });
  });
});
