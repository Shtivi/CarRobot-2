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
Object.defineProperty(exports, "__esModule", { value: true });
var RobotConnectionStatus_1 = require("./RobotConnectionStatus");
var events_1 = require("events");
var DemoSerialCommunicator = /** @class */ (function (_super) {
    __extends(DemoSerialCommunicator, _super);
    function DemoSerialCommunicator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DemoSerialCommunicator.prototype.connect = function (connectionOptions) {
        this.connectionStatus = RobotConnectionStatus_1.RobotConnectionStatus.CONNECTED;
        return Promise.resolve();
    };
    DemoSerialCommunicator.prototype.disconnect = function () {
        this.connectionStatus = RobotConnectionStatus_1.RobotConnectionStatus.DISCONNECTED;
        return Promise.resolve();
        this.emit('close');
    };
    DemoSerialCommunicator.prototype.getConnectionStatus = function () {
        return this.connectionStatus;
    };
    DemoSerialCommunicator.prototype.sendCommand = function (command) {
        return Promise.resolve();
    };
    return DemoSerialCommunicator;
}(events_1.EventEmitter));
exports.DemoSerialCommunicator = DemoSerialCommunicator;
//# sourceMappingURL=DemoSerialCommunicator.js.map