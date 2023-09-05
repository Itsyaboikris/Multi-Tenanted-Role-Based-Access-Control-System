import { FastifyInstance } from "fastify";
import { createApplicationHandler } from "./applications.controllers";
import { createApplicationJsonSchema } from "./application.schemas";
import { getApplications } from "./applications.services";

export async function applicationRoutes(app:FastifyInstance) {
	app.post('/',{schema: createApplicationJsonSchema}, createApplicationHandler)

	app.get('/', getApplications)
}
