class Helper {
    static pad(value) {
        const str = value.toString();
        if (str.length === 1) {
            return '0' + str;
        } else {
            return str;
        }
    }

    static conversion(rawValue, scaleMin, scaleMax, rangeMin, rangeMax) {
        return (((scaleMax - scaleMin) / (rangeMax - rangeMin)) * (rawValue - rangeMin) + scaleMin).toFixed(2);
    }

    static bitshift8(value, offset, length) {
        return value << (32 - (8 - offset)) >>> (32 - length);
    }

    static bitshift16(value, offset, length) {
        return value << (32 - (16 - offset)) >>> (32 - length);
    }
}

module.exports = Helper;
