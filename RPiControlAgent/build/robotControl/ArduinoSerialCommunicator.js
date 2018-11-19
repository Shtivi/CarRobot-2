"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialport_1 = __importDefault(require("serialport"));
var RobotConnectionStatus_1 = require("./RobotConnectionStatus");
var events_1 = require("events");
var ArduinoSerialCommunicator = /** @class */ (function (_super) {
    __extends(ArduinoSerialCommunicator, _super);
    function ArduinoSerialCommunicator() {
        var _this = _super.call(this) || this;
        _this.connectionStatus = RobotConnectionStatus_1.RobotConnectionStatus.DISCONNECTED;
        return _this;
    }
    ArduinoSerialCommunicator.prototype.connect = function (connectionOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connectionOptions = connectionOptions;
            _this.serialPort = new serialport_1.default(_this.connectionOptions.serialPortName, { baudRate: 9600 }, function (err) {
                if (err) {
                    _this.emit('error', err);
                    reject(err);
                    return;
                }
                _this.emit('open');
                resolve();
            });
        });
    };
    ArduinoSerialCommunicator.prototype.disconnect = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.serialPort.isOpen) {
                var err = new Error("cannot close serial port - it's not open");
                _this.emit('error', err);
                reject(err);
                return;
            }
            _this.serialPort.close(function (err) {
                if (err) {
                    _this.emit('error', err);
                    reject(err);
                    return;
                }
                _this.emit('close');
                resolve();
            });
        });
    };
    ArduinoSerialCommunicator.prototype.sendCommand = function (command) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.serialPort.isOpen) {
                reject("cannot send command: serial port is not open");
                return;
            }
            _this.serialPort.write(command.commandName, function (error) {
                if (error) {
                    _this.emit('error', error);
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    };
    ArduinoSerialCommunicator.prototype.getConnectionStatus = function () {
        return this.connectionStatus;
    };
    return ArduinoSerialCommunicator;
}(events_1.EventEmitter));
exports.ArduinoSerialCommunicator = ArduinoSerialCommunicator;
//# sourceMappingURL=ArduinoSerialCommunicator.js.map