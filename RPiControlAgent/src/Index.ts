import ConfigLoader from './config/ConfigLoader';
import { Config } from './config/Config';
import { RobotCommandsMapping } from './robotControl/RobotCommandsMapping';
import { IRobotCommunicator } from './robotControl/IRobotCommunicator';
import { ArduinoSerialCommunicator } from './robotControl/ArduinoSerialCommunicator';
import { SerialCommunicationOptions } from './robotControl/SerialCommunicationOptions';
import { RobotCommand } from './robotControl/RobotCommand';
import { DemoSerialCommunicator } from './robotControl/DemoSerialCommunicator';
import WebSocket from 'ws';
import { MasterClient } from './client/MasterClient';
import { IMasterClient } from './client/IMasterClient';

console.log("starting initialization");
const environment: string = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'DEV');
console.log(`environment set to: ${environment}`);

console.log("loading configuration");
let config: Config = ConfigLoader.loadConfig(environment);

let robotCommandsMapping: RobotCommandsMapping = 
    new RobotCommandsMapping(config.robot.availableCommands);
let robotCommunicator: IRobotCommunicator<SerialCommunicationOptions> = new ArduinoSerialCommunicator();

console.log("initializing robot connection");
robotCommunicator.connect({ serialPortName: config.robot.serialPortName }).then(() => {
    console.log("robot connected");

    let client: IMasterClient = new MasterClient({
        allowRetry: true, 
        apiUrl: config.api.url, 
        maxConnectionAttemps: config.api.retryPolicy.maxConnectionAttempts
    });

    client.connect().then(() => {
        console.log('connected');
        client.on('data', (data: string) => {
            console.log(`received command: ${data}`);   
            robotCommunicator.sendCommand(RobotCommand.of('data'));
        })
    }).catch(() => console.error('failed to connect'));
}).catch(err => {
    console.error("robot connection failed");
    console.error(err);
})