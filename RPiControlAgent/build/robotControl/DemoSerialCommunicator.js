"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RobotConnectionStatus_1 = require("./RobotConnectionStatus");
var DemoSerialCommunicator = /** @class */ (function () {
    function DemoSerialCommunicator() {
    }
    DemoSerialCommunicator.prototype.connect = function (connectionOptions) {
        this.connectionStatus = RobotConnectionStatus_1.RobotConnectionStatus.CONNECTED;
        return Promise.resolve();
    };
    DemoSerialCommunicator.prototype.disconnect = function () {
        this.connectionStatus = RobotConnectionStatus_1.RobotConnectionStatus.DISCONNECTED;
        return Promise.resolve();
    };
    DemoSerialCommunicator.prototype.getConnectionStatus = function () {
        return this.connectionStatus;
    };
    DemoSerialCommunicator.prototype.sendCommand = function (command) {
        return Promise.resolve();
    };
    return DemoSerialCommunicator;
}());
exports.DemoSerialCommunicator = DemoSerialCommunicator;
//# sourceMappingURL=DemoSerialCommunicator.js.map