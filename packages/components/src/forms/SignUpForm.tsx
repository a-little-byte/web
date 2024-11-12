import {
	emailValidator,
	firstNameValidator,
	lastNameValidator,
	passwordValidator,
} from "@alittlebyte/common/validators"
import { Form, useForm } from "@alittlebyte/components/base/Form"
import { InputField } from "@alittlebyte/components/base/InputField"
import { Button } from "@alittlebyte/components/ui/button"
import { FormProvider, SubmitHandler } from "react-hook-form"
import { z } from "zod"

export const signUpValidator = z.object({
	firstName: firstNameValidator,
	lastName: lastNameValidator,
	email: emailValidator,
	password: passwordValidator,
})

type TSignUpValidatorInput = z.input<typeof signUpValidator>

export type SignUpValidatorOutput = z.output<typeof signUpValidator>

export const SignUpForm = ({
	onSubmit,
}: {
	onSubmit: SubmitHandler<SignUpValidatorOutput>
}) => {
	const signUpForm = useForm(signUpValidator, {
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	})

	return (
		<FormProvider {...signUpForm}>
			<Form onSubmit={signUpForm.handleSubmit(onSubmit)}>
				<InputField<TSignUpValidatorInput>
					control={signUpForm.control}
					name="firstName"
					label="First name"
				/>
				<InputField<TSignUpValidatorInput>
					control={signUpForm.control}
					name="lastName"
					label="Last name"
				/>
				<InputField<TSignUpValidatorInput>
					control={signUpForm.control}
					name="email"
					label="email"
					type="email"
				/>
				<InputField<TSignUpValidatorInput>
					control={signUpForm.control}
					name="password"
					label="password"
					type="password"
				/>
				<Button type="submit">Submit</Button>
			</Form>
		</FormProvider>
	)
}
