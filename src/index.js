import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './api/routes.js';
import logger from './logger.js';

dotenv.config();

if (!process.env.PORT || !process.env.GOOGLE_API_KEY) {
    throw new Error('ERROR: PORT or GOOGLE_API_KEY environment variable has not been correctly set!');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.static(path.join(__dirname, '../../static_files')));
app.use(cors());

const apiRouteRequestLogging = (req, res, next) => {
    const requestedEndpoint = req.protocol + '://' + req.get('Host') + req.url;
    logger.info(`API Request: ${requestedEndpoint}`);
    next();
};

app.use('/api', apiRouteRequestLogging, apiRoutes);

/* Global Error Handler */
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send('An unknown error occured')
})

/* Static File Server for frontend */
app.get('*', (req, res) => {
    const requestedEndpoint = req.protocol + '://' + req.get('Host') + req.url;
    logger.info(`STATIC File Request: ${requestedEndpoint}`);
    res.sendFile(path.join(__dirname, '../../static_files/index.html'));
});

app.listen(process.env.PORT, () => {
    logger.info(`Server running on port ${process.env.PORT}...`);
});