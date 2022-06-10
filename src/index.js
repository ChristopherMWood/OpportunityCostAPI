import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './api/routes.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.PORT || !process.env.GOOGLE_API_KEY) {
    throw new Error('ERROR: PORT or GOOGLE_API_KEY environment variable has not been correctly set!');
}

const app = express();
app.use(express.static(path.join(__dirname, '../../static_files')));

// app.use((req, res, next) => {
//     //res.header('Access-Control-Allow-Origin', '*'); // allow cors for this endpoint... VERIFY
//     next();
// })

app.use(cors());
app.use('/api', apiRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../static_files/index.html'));
});

let server = app;

server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});