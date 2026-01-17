const JOB_TAGS_STORAGE_KEY = "job-tracker-lite:job-tags:v1"

const getJobTagsStorageRaw = () => {
	if (typeof window === "undefined") {
		return null
	}

	return window.localStorage.getItem(JOB_TAGS_STORAGE_KEY)
}

const setJobTagsStorageRaw = (value: string) => {
	if (typeof window === "undefined") {
		return
	}

	window.localStorage.setItem(JOB_TAGS_STORAGE_KEY, value)
}

export { JOB_TAGS_STORAGE_KEY, getJobTagsStorageRaw, setJobTagsStorageRaw }
