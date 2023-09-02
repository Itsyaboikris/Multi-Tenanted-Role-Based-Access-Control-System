import fastify from "fastify";
import { logger } from "./logger";

export function buildServer() {
	const app = fastify({
		logger: logger
	});

	// register plugins


	// register routes

	return app
}