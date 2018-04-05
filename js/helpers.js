// Helper functions used by app

function splitTimer(timer) {
    return {
        minutes: parseInt(timer / 60, 10),
        seconds: parseInt(timer % 60, 10)
    };
}

/**
 *
 * @param number
 * @param size
 * @returns {string}
 * {@link https://stackoverflow.com/a/2998822/1946899|Modifed from Source}
 */
function zeroPad(number, size) {
    var s=number+'';
    while (s.length < size) {
        s = '0' + s;
    }

    return s;
}

/**
 *
 * @param string
 * @returns {string}
 * {@link https://stackoverflow.com/a/1026087/1946899|Source}
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}