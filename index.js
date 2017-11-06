const fs = require('fs');
const ESP3Packet = require('esp3-packet');

const Helper = require('./helper');
const EEPs = require('./eep');

class EEPPacket {
    constructor(buffer, knownDevicesFilePath) {
        if (buffer === undefined || buffer === null) {
            throw new Error('Buffer is missing.');
        }

        const kdfp = (knownDevicesFilePath === undefined || knownDevicesFilePath === null) ? __dirname + '/known-devices.json' : knownDevicesFilePath;
        console.log(kdfp);
        const KnownDevices = require(kdfp);

        const espPacket = new ESP3Packet(buffer);

        // RPS
        if (espPacket.data.rorg === 'f6') {
            espPacket.data.userData = EEPs['f60203'](espPacket.data.rawUserData);
            delete espPacket.data.rawUserData;

            return espPacket;
        }

        // 1BS
        if (espPacket.data.rorg === 'd5') { // At this moment there is only one eep
            const learnMode = espPacket.data.rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1

            if (learnMode === 0) { // it's a learn packet
                KnownDevices[espPacket.data.senderId] = { rorg: espPacket.data.rorg, func: '00', type: '01' };

                fs.writeFileSync(kdfp, JSON.stringify(KnownDevices));
                delete espPacket.data.rawUserData;

                return espPacket;
            } else {
                if (KnownDevices.hasOwnProperty(espPacket.data.senderId)) { // It's a known device, so parse it
                    const eep = KnownDevices[espPacket.data.senderId];
                    espPacket.data.userData = EEPs[eep.rorg + eep.func + eep.type](espPacket.data.rawUserData);

                    delete espPacket.data.rawUserData;
                    return espPacket;
                } else { // Device isn't known, so cannot parse
                    delete espPacket.data.rawUserData;
                    return espPacket;
                }
            }
        }

        // 4BS
        if (espPacket.data.rorg === 'a5') {
            const learnMode = espPacket.data.rawUserData.readUInt8(3) << 28 >>> 31;

            if (learnMode === 0) { // it's a learn packet
                const func = Helper.pad(espPacket.data.rawUserData.readUInt8() >>> 2);
                const type = Helper.pad(espPacket.data.rawUserData.readUInt16BE() << 22 >>> 25);

                KnownDevices[espPacket.data.senderId] = { rorg: espPacket.data.rorg, func: func, type: type };

                fs.writeFileSync(kdfp, JSON.stringify(KnownDevices));
                delete espPacket.data.rawUserData;

                return espPacket;
            } else {
                if (KnownDevices.hasOwnProperty(espPacket.data.senderId)) { // It's a known device, so parse it
                    const eep = KnownDevices[espPacket.data.senderId];
                    espPacket.data.userData = EEPs[eep.rorg + eep.func](espPacket.data.rawUserData, eep);

                    delete espPacket.data.rawUserData;
                    return espPacket;
                } else { // Device isn't known, so cannot parse
                    delete espPacket.data.rawUserData;
                    return espPacket;
                }
            }
        }
    }
}

module.exports = EEPPacket;
