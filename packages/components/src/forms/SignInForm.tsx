import {
	emailValidator,
	passwordValidator,
} from "@alittlebyte/common/validators"
import { Form, useForm } from "@alittlebyte/components/base/Form"
import { InputField } from "@alittlebyte/components/base/InputField"
import { Button } from "@alittlebyte/components/ui/button"
import { FormProvider, SubmitHandler } from "react-hook-form"
import { z } from "zod"

export const signInValidator = z.object({
	email: emailValidator,
	password: passwordValidator,
})

type TSignInValidatorInput = z.input<typeof signInValidator>

export type SignInValidatorOutput = z.output<typeof signInValidator>

export const SignInForm = ({
	onSubmit,
}: {
	onSubmit: SubmitHandler<SignInValidatorOutput>
}) => {
	const signInForm = useForm(signInValidator, {
		defaultValues: {
			email: "",
			password: "",
		},
	})

	return (
		<FormProvider {...signInForm}>
			<Form onSubmit={void signInForm.handleSubmit(onSubmit)}>
				<InputField<TSignInValidatorInput>
					control={signInForm.control}
					name="email"
					label="Email"
					type="email"
				/>
				<InputField<TSignInValidatorInput>
					control={signInForm.control}
					name="password"
					label="Password"
					type="password"
				/>
				<Button type="submit">Submit</Button>
			</Form>
		</FormProvider>
	)
}
