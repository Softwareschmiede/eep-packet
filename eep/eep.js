const fs = require('fs');
const path = require('path');

const Helper = require('./helper');
const Profiles = require('./profiles');

module.exports = function(data) {
    const EEPMapper = JSON.parse(fs.readFileSync(path.join(__dirname, 'eep.json'), 'utf8')); // FS Bug? Always from root dir

    if (data.rorg === 'f6') {
        //const t21 = parseInt(data.status, 16) << 26 >>> 31;
        //const nu = parseInt(data.status, 16) << 27 >>> 31;

        return Profiles['f60203'](data.rawUserData);
    }

    if (data.rorg === 'd5') { // At this moment there is only one eep
        const learnMode = data.rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1

        if (learnMode === 0) { // it's a learn packet
            return {
                learnMode: true,
                eep: { rorg: data.rorg, func: '00', type: '01' }
            }
        } else {
            const eep = EEPMapper[data.senderId];
            return Profiles[eep.rorg + eep.func + eep.type](data.rawUserData);
        }
    }

    if (data.rorg === 'a5') {
        const learnMode = data.rawUserData.readUInt8(3) << 28 >>> 31;

        if (learnMode === 0) { // it's a learn packet
            const func = Helper.pad(data.rawUserData.readUInt8() >>> 2);
            const type = Helper.pad(data.rawUserData.readUInt16BE() << 22 >>> 25);

            return {
                learnMode: true,
                eep: { rorg: data.rorg, func: func, type: type }
            }
        } else {
            const eep = EEPMapper[data.senderId];
            return Profiles[eep.rorg + eep.func + 'xx'](data.rawUserData, eep);
        }
    }

    return null;
}
