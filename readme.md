# eep-packet
This module extracts all information out of an esp3 buffer.

## Dependencies
* ESP3Packet 0.0.5

## Usage
```javascript
const EEPPacket = require('eep-packet');
...
const packet = new EEPPacket(buffer);
```

## Option
You can set a file path where all known devices will be stored.
Default: "./known-devices.json"

```javascript
const packet = new EEPPacket(buffer, 'absolute/path/file.json');
```

## Packet structure
```javascript
{
    header: {
        dataLength: Number,
        optionalLength: Number,
        packetType: String
    },
    data: {
        rorg: String,
        senderId: String,
        status: String,
        userData: Object
    },
    optionalData: {
        subTelNum: Number,
        destinationId: String,
        dBm: Number,
        securityLevel: Number
    }
}
  ```
