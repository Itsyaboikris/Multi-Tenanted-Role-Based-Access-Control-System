import { FastifyReply, FastifyRequest } from "fastify";
import { createRole } from "./roles.services";
import { CreateRoleBody } from "./role.schema";

export async function createRoleHandler(request: FastifyRequest<{Body: CreateRoleBody;}>, reply: FastifyReply) {
  
	const user = request.user;
	const applicationId = user.applicationId;
	const { name, permissions } = request.body;

	const role = await createRole({
		name,
		permissions,
		applicationId,
	});

	return role;
}