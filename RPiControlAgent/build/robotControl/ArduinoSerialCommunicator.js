"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var raspi_1 = require("raspi");
var raspi_serial_1 = require("raspi-serial");
var RobotConnectionStatus_1 = require("./RobotConnectionStatus");
var ArduinoSerialCommunicator = /** @class */ (function () {
    function ArduinoSerialCommunicator() {
        this.connectionStatus = RobotConnectionStatus_1.RobotConnectionStatus.DISCONNECTED;
    }
    ArduinoSerialCommunicator.prototype.getConnectionStatus = function () {
        return this.connectionStatus;
    };
    ArduinoSerialCommunicator.prototype.connect = function (connectionOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            raspi_1.init(function () {
                _this.serial = new raspi_serial_1.Serial({
                    portId: connectionOptions.serialPortName
                });
                _this.serial.open(function () {
                    _this.connectionStatus = RobotConnectionStatus_1.RobotConnectionStatus.CONNECTED;
                    resolve();
                });
            });
        });
    };
    ArduinoSerialCommunicator.prototype.disconnect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.serial.close(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    ArduinoSerialCommunicator.prototype.sendCommand = function (command) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.getConnectionStatus() != RobotConnectionStatus_1.RobotConnectionStatus.CONNECTED) {
                reject('Cannot send command; The robot is not available.');
                return;
            }
            _this.serial.write(command.commandName, function () {
                resolve();
            });
        });
    };
    return ArduinoSerialCommunicator;
}());
exports.ArduinoSerialCommunicator = ArduinoSerialCommunicator;
//# sourceMappingURL=ArduinoSerialCommunicator.js.map