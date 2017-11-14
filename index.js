const ESP3Packet = require('esp3-packet');

const Helper = require('./helper');
const EEPs = require('./eep');

class EEPPacket {
    constructor(buffer, knownDevices) {
        if (buffer === undefined || buffer === null) {
            throw new Error('Buffer is missing.');
        }

        if (knownDevices === undefined || knownDevices === null) {
            // throw new Error('Known devices object is missing.');
            knownDevices = {};
        }

        const espPacket = new ESP3Packet(buffer);

        // RPS
        if (espPacket.data.rorg === 'f6') {
            espPacket.data.userData = EEPs['f60203'](espPacket.data.rawUserData);
            espPacket.learnMode = false;
            delete espPacket.data.rawUserData;

            return espPacket;
        }

        // 1BS
        if (espPacket.data.rorg === 'd5') { // At this moment there is only one eep
            const learnMode = espPacket.data.rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1

            if (learnMode === 0) { // it's a learn packet
                //knownDevices[espPacket.data.senderId] = { rorg: espPacket.data.rorg, func: '00', type: '01' };
                espPacket.learnMode = true;
                espPacket.eep = { rorg: espPacket.data.rorg, func: '00', type: '01' };
                delete espPacket.data.rawUserData;

                return espPacket;
            } else {
                if (knownDevices.hasOwnProperty(espPacket.data.senderId)) { // It's a known device, so parse it
                    const eep = knownDevices[espPacket.data.senderId];

                    espPacket.data.userData = EEPs[eep.rorg + eep.func + eep.type](espPacket.data.rawUserData);
                    espPacket.learnMode = false;
                    delete espPacket.data.rawUserData;

                    return espPacket;
                }/* else { // Device isn't known, so cannot parse
                    delete espPacket.data.rawUserData;
                    return espPacket;
                }*/
            }
        }

        // 4BS
        if (espPacket.data.rorg === 'a5') {
            const learnMode = espPacket.data.rawUserData.readUInt8(3) << 28 >>> 31;

            if (learnMode === 0) { // it's a learn packet
                const func = Helper.pad(espPacket.data.rawUserData.readUInt8() >>> 2);
                const type = Helper.pad(espPacket.data.rawUserData.readUInt16BE() << 22 >>> 25);

                // knownDevices[espPacket.data.senderId] = { rorg: espPacket.data.rorg, func: func, type: type };
                // fs.writeFileSync(kdfp, JSON.stringify(knownDevices));
                espPacket.learnMode = true;
                espPacket.eep = { rorg: espPacket.data.rorg, func: func, type: type };
                delete espPacket.data.rawUserData;

                return espPacket;
            } else {
                if (knownDevices.hasOwnProperty(espPacket.data.senderId)) { // It's a known device, so parse it
                    const eep = knownDevices[espPacket.data.senderId];

                    espPacket.data.userData = EEPs[eep.rorg + eep.func](espPacket.data.rawUserData, eep);
                    espPacket.learnMode = false;
                    delete espPacket.data.rawUserData;

                    return espPacket;
                }/* else { // Device isn't known, so cannot parse
                    delete espPacket.data.rawUserData;

                    return espPacket;
                }*/
            }
        }
    }
}

module.exports = EEPPacket;
