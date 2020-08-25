export function find<T>(arr: T[], cb: (item: T, index?: number) => boolean): T {
    return arr.filter((item, index) => {
        return cb(item, index);
    })[0];
}