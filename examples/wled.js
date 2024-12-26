// Receive virtual leds over DDP from WLED
const ddp = require('@jwetzell/ddp');

const dgram = require('dgram');

const socket = dgram.createSocket('udp4');
socket.bind(4048, '0.0.0.0');

socket.on('message', (msg) => {
  console.clear();
  const leds = [];

  const packet = ddp.decode(msg);
  const ledCount = packet.header.dataLength / (packet.header.dataType.bitsPerPixel / 8) / 3;

  for (let index = 0; index < ledCount; index += 1) {
    const ledOffset = index * 3;

    const led = {
      r: packet.data[ledOffset + 0],
      g: packet.data[ledOffset + 1],
      b: packet.data[ledOffset + 2],
    };

    leds.push(led);
  }
  leds.forEach((led, index) => {
    console.log(`led ${index + 1}:\tr=${led.r}\tg=${led.g}\tb=${led.b}`);
  });
});
