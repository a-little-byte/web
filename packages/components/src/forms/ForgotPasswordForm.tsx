import { emailValidator } from "@alittlebyte/common/validators"
import { Form, useForm } from "@alittlebyte/components/base/Form"
import { InputField } from "@alittlebyte/components/base/InputField"
import { Button } from "@alittlebyte/components/ui/button"
import { FormProvider, SubmitHandler } from "react-hook-form"
import { z } from "zod"

export const ForgotPasswordValidator = z.object({
	email: emailValidator,
})

type TForgotPasswordValidatorInput = z.input<typeof ForgotPasswordValidator>

export type ForgotPasswordValidatorOutput = z.output<
	typeof ForgotPasswordValidator
>

export const ForgotPasswordForm = ({
	onSubmit,
}: {
	onSubmit: SubmitHandler<ForgotPasswordValidatorOutput>
}) => {
	const forgotPasswordForm = useForm(ForgotPasswordValidator, {
		defaultValues: {
			email: "",
		},
	})

	return (
		<FormProvider {...forgotPasswordForm}>
			<Form onSubmit={forgotPasswordForm.handleSubmit(onSubmit)}>
				<InputField<TForgotPasswordValidatorInput>
					control={forgotPasswordForm.control}
					name="email"
					label="Email"
					type="email"
				/>
				<Button type="submit">Submit</Button>
			</Form>
		</FormProvider>
	)
}
