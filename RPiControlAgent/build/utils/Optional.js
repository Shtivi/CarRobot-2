"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Optional = /** @class */ (function () {
    function Optional(value) {
        this.value = value;
    }
    Optional.of = function (value) {
        return new Optional(value);
    };
    Optional.prototype.isPresent = function () {
        if (this.value) {
            return true;
        }
        return false;
    };
    Optional.prototype.get = function () {
        if (!this.value) {
            throw new Error('Cannot return empty value');
        }
        return this.value;
    };
    Optional.prototype.ifPresnet = function (callback) {
        if (this.isPresent()) {
            callback(this.get());
        }
    };
    Optional.prototype.ifNotPresent = function (callback) {
        if (!this.isPresent()) {
            callback();
        }
    };
    ;
    return Optional;
}());
exports.Optional = Optional;
//# sourceMappingURL=Optional.js.map