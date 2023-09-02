import {migrate} from 'drizzle-orm/node-postgres/migrator'
import { env } from "./config/env"
import { logger } from "./utils/logger"
import { buildServer } from "./utils/server"
import { db } from './db'


async function gracefulShutdown(app:{app: Awaited<ReturnType<typeof buildServer>>}) {
	await process.exit(1)
}

async function main() {
	const app = await buildServer()

	const url = await app.listen({
		port: env.PORT,
		host: env.HOST
	})

	await migrate(db, {
		migrationsFolder: './migrations'
	})

	const signals = ['SIGINT', 'SIGTERM']

	logger.debug(env, "using env")

	for(const signal of signals) {
		process.on(signal, () => {
			logger.info(`got signal ${signal}`)
			gracefulShutdown({app, })
		})
	}

	// logger.info(`Server is running at ${url}`)
}

main()