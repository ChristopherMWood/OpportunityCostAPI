import express from 'express';
import opportunityCostApiRoutes from './opportunityCostApi/routes.js';

const router = express.Router();
router.use('/opportunityCost', opportunityCostApiRoutes);

router.get('*', (req, res) => {
    res.status(400);
    res.send();
});

export default router;