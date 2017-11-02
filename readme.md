# eep-packet
This module parses vaild esp3 buffer to eep packets.
It extracts all information out of the buffer.

## Usage
```javascript
const EEPPacket = require('eep-packet');
...
const packet = new EEPPacket(buffer);
```

## Packet structure
```javascript
{
    raw: Buffer,
    syncByte: '55',
    rawHeader: Buffer,
    header: {
        dataLength: Number,
        optionalLength: Number,
        packetType: String
    },
    crc8h: String,
    rawData: Buffer,
    data: {
        rorg: String,
        rawUserData: Buffer,
        userData: Object
        senderId: String,
        status: String
    },
    rawOptionalData: Buffer,
    optionalData: {
        subTelNum: Number,
        destinationId: String,
        dBm: Number,
        securityLevel: Number
    },
    crc8d: String
}
  ```
