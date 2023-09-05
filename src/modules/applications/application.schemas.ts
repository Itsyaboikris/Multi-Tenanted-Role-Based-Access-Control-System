import { z } from "zod";
import zodToJsonSchema from 'zod-to-json-schema'

const createApplicationComponentBodySchema = z.object({
	name: z.string({
		required_error: 'Name is required'
	})
})

export type CreateApplicationBody = z.infer<typeof createApplicationComponentBodySchema>

export const createApplicationJsonSchema = {
	body: zodToJsonSchema(createApplicationComponentBodySchema, "createApplicationComponentBodySchema")
}