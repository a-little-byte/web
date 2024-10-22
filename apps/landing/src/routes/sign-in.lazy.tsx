import {
	SignInForm,
	SignInValidatorOutput,
} from "@alittlebyte/components/forms/SignInForm"
import { useAuthClient } from "@alittlebyte/landing/hooks/useAuthClient"
import { useMutation } from "@tanstack/react-query"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback, useState } from "react"
import { SubmitHandler } from "react-hook-form"

const SignIn = () => {
	const [invalidEmailOrPassword, setInvalidEmailOrPassword] = useState(false)
	const navigate = useNavigate()
	const { signIn } = useAuthClient()
	const { mutate } = useMutation<unknown, Error, SignInValidatorOutput>({
		mutationFn: async (data) => {
			setInvalidEmailOrPassword(false)
			const res = await signIn.email(data)
			if (res.error) {
				throw new Error(res.error.message)
			}
		},
		onSuccess: () => {
			navigate({
				to: "/",
			})
		},
		onError: () => {
			setInvalidEmailOrPassword(true)
		},
	})

	const onSubmit = useCallback<SubmitHandler<SignInValidatorOutput>>(
		(values) => {
			mutate(values)
		},
		[mutate],
	)

	return (
		<div className="p-2">
			{invalidEmailOrPassword && (
				<div className="bg-red-500 p-2 text-white">
					Invalid email or password
				</div>
			)}
			<SignInForm onSubmit={onSubmit} />
		</div>
	)
}

export const Route = createLazyFileRoute("/sign-in")({
	component: SignIn,
})
