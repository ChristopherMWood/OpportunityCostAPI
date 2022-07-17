import express from 'express'
import requestCache from '../middleware/requestCache.js'
import opportunityCostApiRoutes from './opportunityCostApi/routes.js'
import christopherWoodDevApiRoutes from './christopherwood.dev/routes.js'

const router = express.Router()

router.use('/opportunityCost', requestCache, opportunityCostApiRoutes)
router.use('/site', christopherWoodDevApiRoutes)

router.get('*', (req, res) => {
	res.status(400)
	res.send()
})

export default router