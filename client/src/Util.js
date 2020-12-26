/**
 * Util.js
 * Contains methods that are useful to a number of classes.
 */
class Util {
    /**
     * Creates an array like the python range function.
     */
    static range(start, stop, inc) {
        return Array.from({length: (stop - start) / inc + 1}, (_, i) => start + (i * inc));
    }
}

export default Util;