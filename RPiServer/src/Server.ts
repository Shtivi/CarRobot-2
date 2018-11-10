import {Application, Router, Request, Response} from 'express';
import express from 'express';
import ConfigLoader from './ConfigLoader';

console.log("starting server initialization");

const app: express.Express = express();
const environment: string = process.env.NODE_ENV || 'DEV';
console.log(`environment set to: ${environment}`);
console.log("loading configuration");

let config: any = ConfigLoader.loadConfig(environment);
const port: number = Number(config.port) || 3000;

const router: Router = Router();

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
})

router.get('/', (req: Request, res: Response) => {
    res.send('hello world');
})
app.use('/', router);