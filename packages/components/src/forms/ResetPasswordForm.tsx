import { passwordValidator } from "@alittlebyte/common/validators"
import { Form, useForm } from "@alittlebyte/components/base/Form"
import { InputField } from "@alittlebyte/components/base/InputField"
import { Button } from "@alittlebyte/components/ui/button"
import { FormProvider, SubmitHandler } from "react-hook-form"
import { z } from "zod"

export const ResetPasswordValidator = z
	.object({
		password: passwordValidator,
		confirmPassword: passwordValidator,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})

type TResetPasswordValidatorInput = z.input<typeof ResetPasswordValidator>

export type ResetPasswordValidatorOutput = z.output<
	typeof ResetPasswordValidator
>

export const ResetPasswordForm = ({
	onSubmit,
}: {
	onSubmit: SubmitHandler<ResetPasswordValidatorOutput>
}) => {
	const resetPasswordForm = useForm(ResetPasswordValidator, {
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	})

	return (
		<FormProvider {...resetPasswordForm}>
			<Form onSubmit={resetPasswordForm.handleSubmit(onSubmit)}>
				<InputField<TResetPasswordValidatorInput>
					control={resetPasswordForm.control}
					name="password"
					label="new Password"
					type="password"
				/>
				<InputField<TResetPasswordValidatorInput>
					control={resetPasswordForm.control}
					name="confirmPassword"
					label="confirm  Password"
					type="password"
				/>
				<Button type="submit">Submit</Button>
			</Form>
		</FormProvider>
	)
}
