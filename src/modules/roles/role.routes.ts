import { FastifyInstance } from "fastify";
import { createRoleHandler } from "./role.controllers";
import { PERMISSIONS } from "../../config/permissions";
import { CreateRoleBody, createRoleJsonSchema } from "./role.schema";

export async function roleRoutes(app: FastifyInstance) {
  app.post<{Body: CreateRoleBody; }>("/", {schema: createRoleJsonSchema, preHandler: [app.guard.scope([PERMISSIONS["roles:write"]])],}, createRoleHandler);
}