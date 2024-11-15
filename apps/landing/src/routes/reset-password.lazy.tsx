import {
	ResetPasswordForm,
	ResetPasswordValidatorOutput,
} from "@alittlebyte/components/forms/ResetPasswordForm"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"
import { useAuthClient } from "../hooks/useAuthClient"
import { useMutation } from "@tanstack/react-query"
import { SubmitHandler } from "react-hook-form"
import { useToast } from "@alittlebyte/components/hooks/use-toast"

const ResetPassword = () => {
	const { resetPassword } = useAuthClient()
	const navigate = useNavigate()
	const queryParams = new URLSearchParams(window.location.search)
	const token = queryParams.get("token")
	const { toast } = useToast()

	if (!token) {
		throw new Error("Token can not be null")
	}

	const { mutate } = useMutation<unknown, Error, ResetPasswordValidatorOutput>({
		mutationFn: async ({ password }) => {
			const res = await resetPassword({
				newPassword: password,
				fetchOptions: {
					query: {
						token,
					},
				},
			})

			if (res.error) {
				throw new Error(res.error.message)
			}
		},
		onSuccess: async () => {
			toast({
				title: "Your password have been successfully reset",
			})
			await navigate({ to: "/sign-in" })
		},
		onError: (error) => {
			toast({
				title: "An error occured",
				description: error.message,
			})
		},
	})
	const onSubmit = useCallback<SubmitHandler<ResetPasswordValidatorOutput>>(
		(values) => {
			mutate(values)
		},
		[mutate],
	)

	return (
		<div className="p-2">
			<ResetPasswordForm onSubmit={onSubmit} />
		</div>
	)
}

export const Route = createLazyFileRoute("/reset-password")({
	component: ResetPassword,
})
