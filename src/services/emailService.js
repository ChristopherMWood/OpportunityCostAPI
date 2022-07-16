import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
import logger from '../logger.js'
dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendEmail(emailRequest, toAddress, onSuccess, onError) {
	sgMail
		.send({
			to: toAddress,
			from: 'cmw2379@proton.me', // Change to your verified sender
			subject: `christopherwood.dev - Message Request - ${emailRequest.name}`,
			text: emailRequest.body
		})
		.then(() => {
			logger.info(`Email sent from: ${emailRequest.name}`)
			onSuccess()
		})
		.catch((error) => {
			logger.error(error)
			onError(error)
		})
}

export default sendEmail