import { config } from 'dotenv';
import { initServer, createAdmin, createClient } from './configs/server.js';

config();

const initializeServer = async () => {

    await initServer();
    await createAdmin();
    await createClient();

};

initializeServer();