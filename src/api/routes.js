import express from 'express';
import cacheRoute from '../cache.js';
import opportunityCostApiRoutes from './opportunityCostApi/routes.js';

const router = express.Router();

router.use('/opportunityCost', cacheRoute, opportunityCostApiRoutes);

router.get('*', (req, res) => {
    res.status(400);
    res.send();
});

export default router;