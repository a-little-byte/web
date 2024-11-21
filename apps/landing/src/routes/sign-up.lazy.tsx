import { FULL_NAME_SEPARATOR } from "@alittlebyte/common/constants"
import {
	SignUpForm,
	SignUpValidatorOutput,
} from "@alittlebyte/components/forms/SignUpForm"
import { toast } from "@alittlebyte/components/hooks/use-toast"
import { useAuthClient } from "@alittlebyte/landing/hooks/useAuthClient"
import { useMutation } from "@tanstack/react-query"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"
import { SubmitHandler } from "react-hook-form"

const SignUp = () => {
	const navigate = useNavigate()
	const { signUp, sendVerificationEmail } = useAuthClient()
	const { mutateAsync } = useMutation<unknown, Error, SignUpValidatorOutput>({
		mutationFn: (data) =>
			signUp.email({
				name: `${data.firstName}${FULL_NAME_SEPARATOR}${data.lastName}`,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
			}),
		onSuccess: async (_data, { email }) => {
			toast({
				title: "Please check your email",
				description: "An email has been sent in order to verify your email",
			})
			await sendVerificationEmail({
				email,
				callbackURL: `${window.location.origin}/sign-in`,
			})
			await navigate({ to: "/" })
		},
	})
	const onSubmit = useCallback<SubmitHandler<SignUpValidatorOutput>>(
		async (values) => {
			await mutateAsync(values)
		},
		[mutateAsync],
	)

	return (
		<div className="p-2">
			<SignUpForm onSubmit={onSubmit} />
		</div>
	)
}

export const Route = createLazyFileRoute("/sign-up")({
	component: SignUp,
})
