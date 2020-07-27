if (!Array.prototype.find) {
    Array.prototype.find = function (cb) {
        return this.filter(cb)[0];
    }
}