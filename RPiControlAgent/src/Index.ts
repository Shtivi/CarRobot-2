import ConfigLoader from './config/ConfigLoader';
import { Config } from './config/Config';
import { RobotCommandsMapping } from './robotControl/RobotCommandsMapping';
import { IRobotCommunicator } from './robotControl/IRobotCommunicator';
import { ArduinoSerialCommunicator } from './robotControl/ArduinoSerialCommunicator';
import { SerialCommunicationOptions } from './robotControl/SerialCommunicationOptions';
import { RobotCommand } from './robotControl/RobotCommand';
import { DemoSerialCommunicator } from './robotControl/DemoSerialCommunicator';
import WebSocket from 'ws';

console.log("starting initialization");
const environment: string = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'DEV');
console.log(`environment set to: ${environment}`);

console.log("loading configuration");
let config: Config = ConfigLoader.loadConfig(environment);

let robotCommandsMapping: RobotCommandsMapping = 
    new RobotCommandsMapping(config.robot.availableCommands);
let robotCommunicator: IRobotCommunicator<SerialCommunicationOptions> = new ArduinoSerialCommunicator();

console.log("initializing robot connection");
robotCommunicator.connect(new SerialCommunicationOptions(config.robot.serialPortName)).then(() => {
    console.log("robot connected");
    console.log("connecting to robot websocket server");
    
    const wsClient: WebSocket = new WebSocket(config.api.url);
    wsClient.on('open', () => {
        console.log('robot websocket connected');
    });

    wsClient.on('message', (data) => {
        console.log(data);
    })
}).catch(err => {
    console.error("robot connection failed");
    console.error(err);
})