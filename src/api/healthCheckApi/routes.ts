import express from 'express'

const router = express.Router()

router.get('/status', (req, res) => {
	res.status(200)
	res.send(JSON.stringify({
		message: 'Not implemented yet'
	}))
})

export default router