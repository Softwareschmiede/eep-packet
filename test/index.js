const ESP3Packet = require('esp3-packet');

const EEPPacket = require('../');

describe('test', function() {
    const knownDevices = { '01830281': {rorg: 'd5', func: '00', type: '01'}, '0181383f': {rorg: 'a5', func: '02', type: '05'} };
    const knownDevicesArray = [
        {
            senderId: '01830281',
            eep: {
                rorg: 'd5',
                func: '00',
                type: '01'
            }
        },
        {
            senderId: '0181383f',
            eep: {
                rorg: 'a5',
                func: '02',
                type: '05'
            }
        }
    ];
    const buf = Buffer.from('55000a0701eba500007a080181383f0003ffffffff3d00e5', 'hex');

    const eepPacket = new EEPPacket(new ESP3Packet());
    eepPacket.setKnownDevices(knownDevicesArray);
    const packet = eepPacket.parse(buf);

    console.log(packet);
});


// f6
// 55000707017af610002cebff3003ffffffff3c00bb
// 55000707017af600002cebff2003ffffffff3d00e6
// 55000707017af630002cebff3003ffffffff3d0050
// 55000707017af600002cebff2003ffffffff4000ad
// 55000707017af670002cebff3003ffffffff3d00ab
// 55000707017af600002cebff2003ffffffff4000ad
// 55000707017af635002cebff3002ffffffff3500ed
// 55000707017af600002cebff2003ffffffff370064

// d5
// 55000707017ad509018302810003ffffffff33009c
// 55000707017ad508018302810002ffffffff3300d7
//  learn
// 55000707017ad500018302810002ffffffff2900be


// a5
// 55000a0701eba500007a080181383f0003ffffffff3d00e5
// 55000a0701eba508282d800181383f0003ffffffff4100b7
// 55000a0701eba50000030905037d9a0001ffffffff370039
//  learn
// 55000a0701eba508282d800181383f0003ffffffff4400f6


// d2
// 550009070156d20460e405037d9a0003ffffffff3c003b
// 550009070156d204608005037d9a0001ffffffff3a00a7
// 550009070156d20460e405037d9a0001ffffffff3c0082
// 550009070156d204608005037d9a0001ffffffff3c00d9

// d4
// 55000d0701fdd4a0ff33000901d205037d9a0003ffffffff310082
