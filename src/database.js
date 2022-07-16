import mysql from 'mysql'
import logger from './logger'
import dotenv from 'dotenv'

dotenv.config()

var db = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD
})

db.connect(function(err) {
	if (err) 
		throw err

	logger.info('Datbase connected successfully')
})

export default db