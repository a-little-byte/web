import {
	ForgotPasswordForm,
	ForgotPasswordValidatorOutput,
} from "@alittlebyte/components/forms/ForgotPasswordForm"
import { useAuthClient } from "@alittlebyte/landing/hooks/useAuthClient"
import { useMutation } from "@tanstack/react-query"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"
import { SubmitHandler } from "react-hook-form"
import { useToast } from "@alittlebyte/components/hooks/use-toast"

const ForgotPassword = () => {
	const { forgetPassword } = useAuthClient()
	const { toast } = useToast()
	const navigate = useNavigate()
	const { mutate } = useMutation<unknown, Error, ForgotPasswordValidatorOutput>(
		{
			mutationFn: async ({ email }) => {
				const res = await forgetPassword({
					email,
					redirectTo: `${window.location.origin}/reset-password`,
				})

				if (res.error) {
					throw new Error(res.error.message)
				}
			},
			onSuccess: async () => {
				toast({
					title: "Please check your email",
					description: "An email has been sent in order to reset your password",
				})
				await navigate({ to: "/" })
			},
			onError: (error) => {
				toast({
					title: "An error occured",
					description: error.message,
				})
			},
		},
	)
	const onSubmit = useCallback<SubmitHandler<ForgotPasswordValidatorOutput>>(
		(values) => {
			mutate(values)
		},
		[mutate],
	)

	return (
		<div className="p-2">
			<ForgotPasswordForm onSubmit={onSubmit} />
		</div>
	)
}

export const Route = createLazyFileRoute("/forgot-password")({
	component: ForgotPassword,
})
