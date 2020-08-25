function isObject(ob: any): any {
    return ob && typeof ob === 'object';
}

/**
 * Returns true if input is an array
 * @param {any[]} arr Any array
 */
export function isArr(arr?: any[]): boolean {
    return Array.isArray(arr);
}

/**
 * Inner loop function for assign
 * @private
 * @param {object} ref Argument object
 * @param {object} target First object
 */
function loopFunc(ref: any, target: any) {
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
export function assign<T>(...args: T[]): T {
    const target = isObject(args[0]) ? args[0] : {} as T;
    for (let i = 1; i < args.length; i++) {
        loopFunc(args[i], target);
    }
    return target;
}