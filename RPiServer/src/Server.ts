import express from 'express';
import {Router, Request, Response} from 'express';
import ConfigLoader from './config/ConfigLoader';
import { Config } from './config/Config';
import { RobotCommandsMapping } from './robotControl/RobotCommandsMapping';
import { IRobotCommunicator } from './robotControl/IRobotCommunicator';
import { ArduinoSerialCommunicator } from './robotControl/ArduinoSerialCommunicator';
import { SerialCommunicationOptions } from './robotControl/SerialCommunicationOptions';
import { RobotCommand } from './robotControl/RobotCommand';
import { DemoSerialCommunicator } from './robotControl/DemoSerialCommunicator';

console.log("starting server initialization");
const app: express.Express = express();
const environment: string = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'PROD');
console.log(`environment set to: ${environment}`);

console.log("loading configuration");
let config: Config = ConfigLoader.loadConfig(environment);

let robotCommandsMapping: RobotCommandsMapping = 
    new RobotCommandsMapping(config.robot.availableCommands);
let robotCommunicator: IRobotCommunicator<SerialCommunicationOptions> = new ArduinoSerialCommunicator();

console.log("initializing robot connection");
robotCommunicator.connect(new SerialCommunicationOptions(config.robot.serialPortName)).then(() => {
    console.log("robot connected");
    robotCommunicator.sendCommand(RobotCommand.of('on;')).then(() => {
        console.log('sent on;');
        setTimeout(() => robotCommunicator.sendCommand(RobotCommand.of('off;')), 3000);
    });
    app.listen(config.port, () => {
        console.log(`listening at http://localhost:${config.port}`);
    })
}).catch(err => {
    console.error("robot connection failed");
    console.error(err);
})

const router: Router = Router();
router.get('/:cmd', (req: Request, res: Response) => {
    robotCommunicator.sendCommand(RobotCommand.of(req.params.cmd)).then(() => {
        res.status(200).send("sent " + req.params.cmd);
    }).catch(err => {
        res.status(500).send(err);
    })
})
app.use('/', router);