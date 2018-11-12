"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RobotCommand = /** @class */ (function () {
    function RobotCommand(command) {
        this.commandName = command;
    }
    RobotCommand.of = function (commandName) {
        return new RobotCommand(commandName);
    };
    return RobotCommand;
}());
exports.RobotCommand = RobotCommand;
//# sourceMappingURL=RobotCommand.js.map