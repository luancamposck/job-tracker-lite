import { Controller } from "react-hook-form"

import { useCreateJobTagForm } from "@/features/job-tags/hooks/use-create-job-tag-form"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/shared/ui/input-group"
import { Textarea } from "@/shared/ui/textarea"

const CreateTagForm = () => {
	const { form, onSubmit } = useCreateJobTagForm()
	const { control, reset } = form

	return (
		<Card className="w-full sm:max-w-md">
			<CardHeader>
				<CardTitle>Job Tags</CardTitle>
				<CardDescription>Create tags for a job. Tags are stored in localStorage.</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="create-job-tag-form" onSubmit={onSubmit}>
					<FieldGroup>
						<Controller
							name="job"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="create-job-tag-job">Job</FieldLabel>
									<Input
										{...field}
										id="create-job-tag-job"
										aria-invalid={fieldState.invalid}
										placeholder="Frontend Developer - Acme"
										autoComplete="off"
									/>
									<FieldDescription>Use a job title or ID to group tags.</FieldDescription>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Controller
							name="name"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="create-job-tag-name">Tag name</FieldLabel>
									<InputGroup>
										<InputGroupAddon align="inline-start">
											<InputGroupText>#</InputGroupText>
										</InputGroupAddon>
										<InputGroupInput
											{...field}
											id="create-job-tag-name"
											placeholder="remote"
											autoComplete="off"
											aria-invalid={fieldState.invalid}
										/>
									</InputGroup>
									<FieldDescription>Short labels like remote, onsite, or urgent work best.</FieldDescription>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Controller
							name="description"
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="create-job-tag-description">Description (optional)</FieldLabel>
									<Textarea
										{...field}
										id="create-job-tag-description"
										placeholder="Example: Requires 3+ years of React experience."
										aria-invalid={fieldState.invalid}
										className="min-h-24"
									/>
									<FieldDescription>Add more context if needed.</FieldDescription>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter>
				<Field orientation="horizontal">
					<Button type="button" variant="outline" onClick={() => reset()}>
						Clear
					</Button>
					<Button type="submit" form="create-job-tag-form">
						Add tag
					</Button>
				</Field>
			</CardFooter>
		</Card>
	)
}

export { CreateTagForm }
