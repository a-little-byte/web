import {
	ForgotPasswordForm,
	ForgotPasswordValidatorOutput,
} from "@alittlebyte/components/forms/ForgotPasswordForm"
import { useToast } from "@alittlebyte/components/hooks/use-toast"
import { useAuthClient } from "@alittlebyte/landing/hooks/useAuthClient"
import { useMutation } from "@tanstack/react-query"
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router"
import { SubmitHandler } from "react-hook-form"

const ForgotPassword = () => {
	const { forgetPassword } = useAuthClient()
	const { toast } = useToast()
	const navigate = useNavigate()
	const { mutateAsync } = useMutation<
		unknown,
		Error,
		ForgotPasswordValidatorOutput
	>({
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
				variant: "destructive",
				title: "An error occurred",
				description: error.message,
			})
		},
	})
	const onSubmit: SubmitHandler<ForgotPasswordValidatorOutput> = async (
		values,
	) => {
		await mutateAsync(values)
	}

	return (
		<div className="p-2">
			<ForgotPasswordForm onSubmit={onSubmit} />
		</div>
	)
}

export const Route = createLazyFileRoute("/forgot-password")({
	component: ForgotPassword,
})
