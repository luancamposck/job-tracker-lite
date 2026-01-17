import * as z from "zod"

const descriptionSchema = z
	.string()
	.trim()
	.max(200, "Description must be at most 200 characters.")
	.superRefine((value, ctx) => {
		if (value.length > 0 && value.length < 2) {
			ctx.addIssue({
				code: "too_small",
				minimum: 2,
				inclusive: true,
				origin: "string",
				message: "Description must be at least 2 characters."
			})
		}
	})

const optionalDescriptionSchema = descriptionSchema.optional()

const jobTagSchema = z.object({
	id: z.string().min(1, "Tag id is required."),
	name: z.string().trim().min(2, "Tag name must be at least 2 characters.").max(24, "Tag name must be at most 24 characters."),
	description: optionalDescriptionSchema
})

const createJobTagSchema = z.object({
	job: z.string().trim().min(2, "Job name must be at least 2 characters.").max(80, "Job name must be at most 80 characters."),
	name: z.string().trim().min(2, "Tag name must be at least 2 characters.").max(24, "Tag name must be at most 24 characters."),
	description: optionalDescriptionSchema
})

const jobTagsStorageSchema = z.record(z.string(), z.array(jobTagSchema))

type CreateJobTagInput = z.infer<typeof createJobTagSchema>
type JobTag = z.infer<typeof jobTagSchema>
type JobTagsStorage = z.infer<typeof jobTagsStorageSchema>

function parseJobTagsStorage(raw: string | null): JobTagsStorage {
	if (!raw) {
		return {}
	}

	try {
		const parsed = JSON.parse(raw)
		const result = jobTagsStorageSchema.safeParse(parsed)
		if (result.success) {
			return result.data
		}

		return {}
	} catch {
		return {}
	}
}

export { createJobTagSchema, jobTagSchema, parseJobTagsStorage }
export type { CreateJobTagInput, JobTag, JobTagsStorage }
