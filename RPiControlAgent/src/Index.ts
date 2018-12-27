import ConfigLoader from './config/ConfigLoader';
import { Config } from './config/Config';
import { RobotCommandsMapping } from './robotControl/RobotCommandsMapping';
import { IRobotCommunicator } from './robotControl/IRobotCommunicator';
import { SerialCommunicationOptions } from './robotControl/SerialCommunicationOptions';
import { RobotCommand } from './robotControl/RobotCommand';
import { DemoSerialCommunicator } from './robotControl/DemoSerialCommunicator';
import { ArduinoSerialCommunicator } from './robotControl/ArduinoSerialCommunicator';
import { MasterClient } from './client/MasterClient';
import { IMasterClient } from './client/IMasterClient';
import { Retry } from './utils/Retry';
import { ConnectionStatus } from './client/ConnectionStatus';
import { RobotConnectionStatus } from './robotControl/RobotConnectionStatus';
import * as path from 'path';
import { SerialProxyCommunicator } from './robotControl/SerialProxyCommunicator';
import * as Log4js from 'log4js';
import { ICameraControl } from './camera/ICameraControl';
import { PythonScriptCameraControl } from './camera/PythonScriptCameraControl';
import { MeasurementsManager } from './measurements/MeasurementsManager';
import { WifiMeter } from './measurements/indicators/WifiMeter';

console.log("starting initialization");
const environment: string = (process.env.NODE_ENV ? process.env.NODE_ENV.trim().toUpperCase() : 'DEV');
console.log(`environment set to: ${environment}`);

console.log("loading configuration");
let config: Config = ConfigLoader.loadConfig(environment);

let robotCommandsMapping: RobotCommandsMapping = 
    new RobotCommandsMapping(config.robot.availableCommands);
let robotCommunicator: IRobotCommunicator<SerialCommunicationOptions> = 
    (environment == "DEV") ? 
        new DemoSerialCommunicator() : 
        new SerialProxyCommunicator(path.join(__dirname, '../external/serialCommunicator.py'));

let client: IMasterClient = new MasterClient({
    allowRetry: true, 
    apiUrl: config.api.url, 
    maxConnectionAttemps: config.api.retryPolicy.maxConnectionAttempts
});

const measurementsMgr: MeasurementsManager = new MeasurementsManager(config.robot.measurements.interval);

client.connect().then(() => {
    console.log('connected to remote server');
    
    console.log('starting measurements');
    measurementsMgr
        .withIndicator(new WifiMeter())
        .onData(data => client.send('measurements', data))
        .onError(err => {
            console.error('failure in measurements', err);
            client.send('error', err);
        })
        .start();

    client.on('data', (data: string) => {
        if (data == 'CAPTURE') {
            cameraController.capture().then((data: string) => {
                client.send('capture', data).then(() => console.log("captured and sent")).catch(err => console.error("captured but failed sending", err));
            }).catch(err => {
                console.error('failed to capture', err);
                client.send('error', err);
            })
        } else if (robotCommunicator.getConnectionStatus() == RobotConnectionStatus.CONNECTED) {
            console.log(`Received command: ${data}. Sendind to robot...`);  
            robotCommunicator.sendCommand(RobotCommand.of(data)).then(() => console.log(`command ${data} sent.`)).catch(err => {
                console.error('error sending command to robot', err);
                client.send('error', err);
            });
        }
    });

    console.log("initailizing live streaming...");
    const cameraController: ICameraControl = 
        new PythonScriptCameraControl(path.join(__dirname, '../external/camera.py'), path.join(__dirname, '../capture_output.jpeg'));  

    cameraController.startStreaming(config.camera).then(() => {
        console.log("started to stream");
    }), (err: Error) => {
        console.error("failed to stream", err)
    };

    connectArduino(robotCommunicator);
}).catch(() => console.error('failed to connect'));

const connectArduino = (robotCommunicator: IRobotCommunicator<SerialCommunicationOptions>) => {
    console.log('Establishing arduino connection');

    Retry.action<IRobotCommunicator<SerialCommunicationOptions>>((success, fail) => 
        robotCommunicator.connect({serialPortName: config.robot.serialPortName}).then(() => success(robotCommunicator)).catch(fail))
    .handleSuccess((attemptNo: number, communicator: IRobotCommunicator<SerialCommunicationOptions>) => {
        console.log(`arduino connection established (${attemptNo} attempts)`);
        communicator.once('close', (err?: Error) => {
            if (err) {
                console.error('arduino connection unexpectedly closed with the following error:', err);
                connectArduino(robotCommunicator);
            }
        });
        communicator.on('error', (reason: any) => {
            console.error("communicator rasied an error", reason);
        })
    })
    .handleTermination(() => console.log('failed to connect to arduino via serial'))
    .handleAttemptFailure((attemptNo: number, err: any) => console.error(`attempt ${attemptNo} to connect to arduino failed: ${JSON.stringify(err)}`))
    .withMaxAttempts(5)
    .run();
}