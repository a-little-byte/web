import { apiClient } from "@alittlebyte/common/lib/apiClient"
import {
	SignInForm,
	SignInValidatorOutput,
} from "@alittlebyte/components/forms/SignInForm"
import { landingConfig } from "@alittlebyte/landing/config"
import { useMutation } from "@tanstack/react-query"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { SubmitHandler } from "react-hook-form"

const SignIn = () => {
	const [invalidEmailOrPassword, setInvalidEmailOrPassword] = useState(false)
	const navigate = useNavigate()
	const { mutate } = useMutation<unknown, Error, SignInValidatorOutput>({
		mutationFn: async (data) => {
			setInvalidEmailOrPassword(false)

			const res = await apiClient.auth["sign-in"].$post({
				json: data,
			})
			const { token } = await res.json()

			localStorage.setItem(landingConfig.services.auth.sessionKey, token)
		},
		onSuccess: () => {
			void navigate({
				to: "/",
			})
		},
		onError: () => {
			setInvalidEmailOrPassword(true)
		},
	})
	const onSubmit: SubmitHandler<SignInValidatorOutput> = (values) => {
		mutate(values)
	}

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
