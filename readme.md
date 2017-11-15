# eep-packet
This module extracts all information out of an esp3 buffer.

## Usage
```javascript
const EEPPacket = require('eep-packet');
...
const eepPacket = new EEPPacket();
eepPacket.setParser(parser);

const packet = eepPacket.parse(buffer);
```

## Constructor
```javascript
new EEPPacket(parser);
new EEPPacket(knownDevices);
new EEPPacket(parser, knownDevices);
```

## Methods
### setParser(parser)
* `parser` A parser that can parses esp3 buffer like [esp3-packet](https://github.com/Softwareschmiede/esp3-packet)

### addKnownDevice(device)
* `device` An object that has a `senderId` key and an `eep` key

Throws a `TypeError` if the device is missing or invaild.

**Device example:**
```javascript
{
    senderId: '00000000',
    eep: {
        rorg: 'd5',
        func: '00',
        type: '01'
    }
}
```

### setKnownDevices(devices)
* `devices` An array of devices, see [Device example](#addKnownDevice(device))

Throws a `TypeError` if the devices are not set or have an invaild format.

### parse(buffer)
* `buffer` A vaild buffer like [esp3-packet](https://github.com/Softwareschmiede/esp3-packet) returns.

Throws a `TypeError` if the `buffer` or the `parser` is missing.
**Returns:**
```javascript
{
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
