import { FastifyReply, FastifyRequest } from "fastify";
import { AssignRoleToUserBody, CreateUserBody, LoginBody } from "./users.schemas";
import { SYSTEM_ROLES } from "../../config/permissions";
import { getRoleByName } from "../roles/roles.services";
import { assignRoleToUser, createUser, getUserByEmail, getUsersByApplication } from "./users.services";
import { users } from "../../db/schema";
import jwt  from "jsonwebtoken";
import { logger } from "../../utils/logger";

export async function createUserHandler(request: FastifyRequest<{Body: CreateUserBody}>, reply: FastifyReply){
	const {initialUser, ...data} = request.body

	const roleName = initialUser ? SYSTEM_ROLES.SUPER_ADMIN : SYSTEM_ROLES.APPLICATION_USER

	if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
		const appUsers = await getUsersByApplication(data.applicationId)
		
		if(appUsers.length > 0) {
			return reply.code(400).send({
				message: "application already has super admin user",
				extensions: {
					code: 'APPLICATION_ALREADY_HAS_SUPER_ADMIN',
					applicationId: data.applicationId
				}
			})
		}
		
	}
	
	const role = await getRoleByName({ name: roleName, applicationId: data.applicationId})

	if(!role) {
		return reply.code(404).send({
			message: "Role not found",
		})
	}

	try {
		const user = await createUser(data)

		await assignRoleToUser({
			userId: user.id,
			roleId: role.id,
			applicationId: data.applicationId
		})

		return user
	} catch (error) {
		
	}

}

export async function loginHandler(request:FastifyRequest<{Body: LoginBody}>, reply:FastifyReply) {
	
	const {applicationId, email, password} = request.body

	const user = await getUserByEmail({applicationId, email})

	if(!user) {
		return reply.code(400).send({
			message: "Invalid email or password"
		})
	}

	const token = jwt.sign({
		id: user.id,
		email,
		applicationId,
		scopes: user.permissions
	}, "secret")

	return {token}
}

export async function assignRoleToUserHandler(request:FastifyRequest<{Body: AssignRoleToUserBody}>, reply:FastifyReply) {

	const applicationId = request.user.applicationId;
	const {userId, roleId} = request.body

	try {

		const result = await assignRoleToUser({userId, applicationId, roleId})

		return result;
		
	} catch (error) {
		logger.error(error, `error assigning role to user`)
		return reply.code(400).send({
			message: `Could not assign role to user`
		})
	}

}