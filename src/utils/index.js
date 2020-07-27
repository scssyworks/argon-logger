function isObject(ob) {
    return ob && typeof ob === 'object';
}

/**
 * Returns true if input is an array
 * @param {any[]} arr Any array
 */
export function isArr(arr) {
    return Array.isArray(arr);
}

/**
 * Converts array like object to proper array
 * @param {any[]} arrayLike Array like object
 */
export function toArr(arrayLike) {
    return Array.prototype.slice.call(arrayLike);
}

/**
 * Inner loop function for assign
 * @private
 * @param {object} ref Argument object
 * @param {object} target First object
 */
function loopFunc(ref, target) {
    if (isObject(ref)) {
        Object.keys(ref).forEach(function (key) {
            target[key] = ref[key];
        });
    }
}

/**
 * Polyfill for Object.assign only smaller and with less features
 * @private
 * @returns {object}
 */
export function assign() {
    const target = isObject(arguments[0]) ? arguments[0] : {};
    for (let i = 1; i < arguments.length; i++) {
        loopFunc(arguments[i], target);
    }
    return target;
}