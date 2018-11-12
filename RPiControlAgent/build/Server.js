"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_2 = require("express");
var ConfigLoader_1 = __importDefault(require("./config/ConfigLoader"));
var RobotCommandsMapping_1 = require("./robotControl/RobotCommandsMapping");
var ArduinoSerialCommunicator_1 = require("./robotControl/ArduinoSerialCommunicator");
var SerialCommunicationOptions_1 = require("./robotControl/SerialCommunicationOptions");
var RobotCommand_1 = require("./robotControl/RobotCommand");
console.log("starting server initialization");
var app = express_1.default();
var environment = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'PROD');
console.log("environment set to: " + environment);
console.log("loading configuration");
var config = ConfigLoader_1.default.loadConfig(environment);
var robotCommandsMapping = new RobotCommandsMapping_1.RobotCommandsMapping(config.robot.availableCommands);
var robotCommunicator = new ArduinoSerialCommunicator_1.ArduinoSerialCommunicator();
console.log("initializing robot connection");
robotCommunicator.connect(new SerialCommunicationOptions_1.SerialCommunicationOptions(config.robot.serialPortName)).then(function () {
    console.log("robot connected");
    robotCommunicator.sendCommand(RobotCommand_1.RobotCommand.of('on;')).then(function () {
        console.log('sent on;');
        setTimeout(function () { return robotCommunicator.sendCommand(RobotCommand_1.RobotCommand.of('off;')); }, 3000);
    });
    app.listen(config.port, function () {
        console.log("listening at http://localhost:" + config.port);
    });
}).catch(function (err) {
    console.error("robot connection failed");
    console.error(err);
});
var router = express_2.Router();
router.get('/:cmd', function (req, res) {
    robotCommunicator.sendCommand(RobotCommand_1.RobotCommand.of(req.params.cmd)).then(function () {
        res.status(200).send("sent " + req.params.cmd);
    }).catch(function (err) {
        res.status(500).send(err);
    });
});
app.use('/', router);
//# sourceMappingURL=Server.js.map