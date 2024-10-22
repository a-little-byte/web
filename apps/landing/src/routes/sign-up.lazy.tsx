import { FULL_NAME_SEPARATOR } from "@alittlebyte/common/constants"
import {
	SignUpForm,
	SignUpValidatorOutput,
} from "@alittlebyte/components/forms/SignUpForm"
import { useAuthClient } from "@alittlebyte/landing/hooks/useAuthClient"
import { useMutation } from "@tanstack/react-query"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"
import { SubmitHandler } from "react-hook-form"

const SignUp = () => {
	const navigate = useNavigate()
	const { signUp } = useAuthClient()
	const { mutateAsync } = useMutation<unknown, Error, SignUpValidatorOutput>({
		mutationFn: (data) => {
			return signUp.email({
				name: `${data.firstName}${FULL_NAME_SEPARATOR}${data.lastName}`,
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
			})
		},
	})

	const onSubmit = useCallback<SubmitHandler<SignUpValidatorOutput>>(
		async (values) => {
			await mutateAsync(values)
			navigate({
				to: "/",
			})
		},
		[mutateAsync, navigate],
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
