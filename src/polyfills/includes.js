if (!Array.prototype.includes) {
    Array.prototype.includes = function (el) {
        return this.indexOf(el) > -1;
    }
}