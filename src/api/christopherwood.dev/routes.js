import express from 'express'
import sendEmail from '../../services/emailService.js'

const router = express.Router()

router.post('/contact', async (req, res) => {
	sendEmail(req.body, process.env.CONTACT_EMAIL, () => {
		res.status(200)
		res.send()
	}, () => {
		res.status(400)
		res.send()
	})
})

router.get('/health-check', (req, res) => {
	res.status(200)
	res.send(JSON.stringify({
		message: 'Not implemented yet'
	}))
})

export default router