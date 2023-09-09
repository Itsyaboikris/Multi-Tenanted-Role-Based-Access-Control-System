export const ALL_PERMISSIONS = [

	'users:roles:write', // Allow to add role to user
	'users:roles:delete', // allow to remove role from user

	'roles:write',

	'post:write',
	'post:read',
	'post:delete',
	'post:edit-own',
] as const

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
	acc[permission] = permission
	
	return acc
}, {} as Record<(typeof ALL_PERMISSIONS)[number],(typeof ALL_PERMISSIONS)[number] >)

export const USER_ROLE_PERMISSIONS = [
	PERMISSIONS['post:write'],
	PERMISSIONS['post:read']
]

export const SYSTEM_ROLES = {
	SUPER_ADMIN: 'SUPER_ADMIN',
	APPLICATION_USER: 'APPLICATION_USER',
}