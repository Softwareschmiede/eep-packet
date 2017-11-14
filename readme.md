# eep-packet
This module extracts all information out of an esp3 buffer.

## Usage
```javascript
const EEPPacket = require('eep-packet');
...
const packet = new EEPPacket(buffer, knownDevices);
```

## Known Devices
You have to set an object with all known devices.
For the first time you have to set an empty object ( {} ).
Otherwise the object has to look like this:

```javascript
{
    00000000: { rorg: 'a5', func: '02', type: '05' },
    11111111: { rorg: 'd5', func: '00', type: '01' },
    ...
}
```
The key is the id of a known device.
The value is the eep (EnOcean Equipment Profile) of a known device.

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
    },
    learnMode: Boolean
    eep: { // This only exists if learnMode is true
        rorg: String,
        func: String,
        type: String
    }
}
  ```
