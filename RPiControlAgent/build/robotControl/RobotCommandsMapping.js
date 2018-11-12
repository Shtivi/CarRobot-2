"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RobotCommand_1 = require("./RobotCommand");
var Optional_1 = require("../utils/Optional");
var RobotCommandsMapping = /** @class */ (function () {
    function RobotCommandsMapping(commandsList) {
        this.commandsMapping = {};
        this.fillCommandsMap(commandsList);
    }
    RobotCommandsMapping.prototype.parse = function (commandName) {
        return Optional_1.Optional.of(this.commandsMapping[commandName]);
    };
    RobotCommandsMapping.prototype.fillCommandsMap = function (commandsList) {
        var _this = this;
        commandsList.forEach(function (cmdName) {
            _this.insertCommand(RobotCommand_1.RobotCommand.of(cmdName));
        }, this);
    };
    RobotCommandsMapping.prototype.insertCommand = function (command) {
        this.commandsMapping[command.commandName] = command;
    };
    return RobotCommandsMapping;
}());
exports.RobotCommandsMapping = RobotCommandsMapping;
//# sourceMappingURL=RobotCommandsMapping.js.map