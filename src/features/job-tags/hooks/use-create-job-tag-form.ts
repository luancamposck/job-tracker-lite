import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { getJobTagsStorageRaw, setJobTagsStorageRaw } from "@/features/job-tags/api/job-tags-storage"
import { type CreateJobTagInput, createJobTagSchema, parseJobTagsStorage } from "@/features/job-tags/model/job-tags"

function useCreateJobTagForm() {
	const form = useForm<CreateJobTagInput>({
		resolver: zodResolver(createJobTagSchema),
		defaultValues: {
			job: "",
			name: "",
			description: ""
		}
	})

	const onSubmit = form.handleSubmit((data) => {
		const jobName = data.job.trim()
		const tagName = data.name.trim()
		const description = data.description?.trim()

		const tagsByJob = parseJobTagsStorage(getJobTagsStorageRaw())
		const currentTags = tagsByJob[jobName]
		const existingTags = Array.isArray(currentTags) ? currentTags : []
		const hasTag = existingTags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase())

		if (hasTag) {
			toast("Tag already exists for this job.", {
				description: "Use a different tag or pick another job."
			})
			form.setFocus("name")
			return
		}

		const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
		const tag = {
			id,
			name: tagName,
			description: description?.length ? description : undefined
		}

		tagsByJob[jobName] = [...existingTags, tag]
		setJobTagsStorageRaw(JSON.stringify(tagsByJob))

		toast("Tag added to job.", {
			description: `Added "${tagName}" to "${jobName}".`
		})

		form.reset({ job: jobName, name: "", description: "" })
		form.setFocus("name")
	})

	return { form, onSubmit }
}

export { useCreateJobTagForm }
