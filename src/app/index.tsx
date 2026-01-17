import { CreateTagForm } from "@/features/job-tags/ui/components/create-tag-form"

export const App = () => {
	return (
		<>
			<header className="w-full border-b-2">
				<div>Hello World</div>
			</header>
			<main className="flex w-full justify-center px-6 py-10">
				<CreateTagForm />
			</main>
		</>
	)
}
