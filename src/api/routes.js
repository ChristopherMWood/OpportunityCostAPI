import express from 'express';
import logger from '../logger.js';
import cacheRoute from '../cache.js';
import opportunityCostApiRoutes from './opportunityCostApi/routes.js';

const router = express.Router();

router.use('/opportunityCost', cacheRoute, opportunityCostApiRoutes);

router.get('*', (req, res) => {
    const requestedEndpoint = req.protocol + '://' + req.get('Host') + req.url;
    logger.warn(`Endpoint not found: ${requestedEndpoint}`);
    res.status(400);
    res.send();
});

export default router;