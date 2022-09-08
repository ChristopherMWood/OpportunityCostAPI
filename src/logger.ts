import { createLogger, transports, format, Logger } from "winston"
import LokiTransport from "winston-loki"

let logger: Logger;

// if (process.env.NODE_ENV === 'production') {
	const grafanaApiKey = process.env.GRAFANA_API_KEY;
	const grafanaApiUrl = `https://278710:${grafanaApiKey}@logs-prod3.grafana.net`;

	logger = createLogger({
		transports: [new LokiTransport({
			host: grafanaApiUrl,
			labels: { app: 'honeyshop'},
			json: true,
			format: format.json(),
			replaceTimestamp: true,
			onConnectionError: (err) => console.error(err)
		  }),
		  new transports.Console({
			format: format.combine(format.simple(), format.colorize())
		  })]
	  })
// } else {
// 	logger = createLogger({
// 		level: 'info',
// 		format: format.combine(
// 			format.timestamp({
// 				format: 'YYYY-MM-DD HH:mm:ss'
// 			}),
// 			format.json()
// 		),
// 		transports: [
// 			new transports.File({ filename: './logs/error.log', level: 'error' }),
// 			new transports.File({ filename: './logs/combined.log' }),
// 		],
// 	})

// 	logger.add(new transports.Console({
// 		format: format.combine(
// 			format.timestamp({
// 				format: 'YYYY-MM-DD HH:mm:ss'
// 			}),
// 			format.colorize(),
// 			format.simple()
// 		),
// 	}))
// }

export default logger