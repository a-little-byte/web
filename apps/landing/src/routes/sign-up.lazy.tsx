import { apiClient } from "@alittlebyte/common/lib/apiClient"
import {
	SignUpForm,
	SignUpValidatorOutput,
} from "@alittlebyte/components/forms/SignUpForm"
import { toast } from "@alittlebyte/components/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { SubmitHandler } from "react-hook-form"

const SignUp = () => {
	const navigate = useNavigate()
	const { mutateAsync } = useMutation<unknown, Error, SignUpValidatorOutput>({
		mutationFn: (data) =>
			apiClient.auth["sign-up"].$post({
				json: {
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					password: data.password,
				},
			}),
		onSuccess: async () => {
			toast({
				title: "Please check your email",
				description: "An email has been sent in order to verify your email",
			})

			await navigate({ to: "/" })
		},
	})
	const onSubmit: SubmitHandler<SignUpValidatorOutput> = async (values) => {
		await mutateAsync(values)
	}

	return (
		<div className="p-2">
			<SignUpForm onSubmit={onSubmit} />
		</div>
	)
}

export const Route = createLazyFileRoute("/sign-up")({
	component: SignUp,
})
