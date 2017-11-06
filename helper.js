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
}

module.exports = Helper;
