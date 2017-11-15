/*
 *  Private imports
 */ 
const Helper = require('./helper');
const EEPs = require('./eep');

/*
 *  Declarations
 */
let _parser;
let _knownDevices;

class EEPPacket {
    constructor(parser, devices) {
        _parser = parser ? parser : null;

        if (devices) {
            try {
                _knownDevices = buildKnownDevices(devices);
            } catch (err) {
                throw new TypeError(err.message);
            }
        } else {
            _knownDevices = {};
        }
    }

    setParser(parser) {
        _parser = parser;
    }

    setKnownDevices(devices) {
        try {
            _knownDevices = buildKnownDevices(devices);
        } catch (err) {
            throw new TypeError(err.message);
        }
    }

    addKnownDevice(device) {
        if (device && device.senderId && device.eep) {
            _knownDevices[device.senderId] = device.eep;
        } else {
            throw TypeError('Device is missing or invaild.')
        }
        
    }

    parse(buffer) {
        if (buffer === undefined || buffer === null) {
            throw new TypeError('Buffer is missing.');
        }

        if (_parser === undefined || _parser === null) {
            throw new TypeError('Parser is missing.');
        }

        const packet = _parser.parse(buffer);

        // RPS
        if (packet.data.rorg === 'f6') {
            packet.data.userData = EEPs['f60203'](packet.data.rawUserData);
            packet.learnMode = false;
            delete packet.data.rawUserData;

            return packet;
        }

        // 1BS
        if (packet.data.rorg === 'd5') { // At this moment there is only one eep
            const learnMode = packet.data.rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1

            if (learnMode === 0) { // it's a learn packet
                packet.learnMode = true;
                packet.eep = { rorg: packet.data.rorg, func: '00', type: '01' };
                delete packet.data.rawUserData;

                return packet;
            } else {
                if (_knownDevices.hasOwnProperty(packet.data.senderId)) { // It's a known device, so parse it
                    const eep = _knownDevices[packet.data.senderId];

                    packet.data.userData = EEPs[eep.rorg + eep.func + eep.type](packet.data.rawUserData);
                    packet.learnMode = false;
                    delete packet.data.rawUserData;

                    return packet;
                }
            }
        }

        // 4BS
        if (packet.data.rorg === 'a5') {
            const learnMode = packet.data.rawUserData.readUInt8(3) << 28 >>> 31;

            if (learnMode === 0) { // it's a learn packet
                const func = Helper.pad(packet.data.rawUserData.readUInt8() >>> 2);
                const type = Helper.pad(packet.data.rawUserData.readUInt16BE() << 22 >>> 25);

                packet.learnMode = true;
                packet.eep = { rorg: packet.data.rorg, func: func, type: type };
                delete packet.data.rawUserData;

                return packet;
            } else {
                if (_knownDevices.hasOwnProperty(packet.data.senderId)) { // It's a known device, so parse it
                    const eep = _knownDevices[packet.data.senderId];

                    packet.data.userData = EEPs[eep.rorg + eep.func](packet.data.rawUserData, eep);
                    packet.learnMode = false;
                    delete packet.data.rawUserData;

                    return packet;
                }
            }
        }
    }
}

function buildKnownDevices(devices) {
    if (devices) {
        for (let i = 0; i < devices.length; i++) {
            if (devices[i].senderId && devices[i].eep) {
                _knownDevices[devices[i].senderId] = devices[i].eep;
            } else {
                throw TypeError('Device is invaild. "senderId" or "eep" is missing.');
            }
        }
    } else {
        throw TypeError('Devices are missing.');
    }
}

module.exports = EEPPacket;
