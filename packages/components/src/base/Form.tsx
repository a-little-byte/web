import { cn } from "@alittlebyte/components/lib/cn"
import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormProps, useForm as useReactForm } from "react-hook-form"
import { z } from "zod"

export const useForm = (
	validator: z.ZodSchema,
	formProps: UseFormProps<z.input<typeof validator>>,
) =>
	useReactForm<z.input<typeof validator>, unknown, z.output<typeof validator>>({
		mode: "onTouched",
		reValidateMode: "onChange",
		criteriaMode: "all",
		resolver: zodResolver(validator),
		...formProps,
	})

export const Form = ({
	className,
	...otherProps
}: React.HTMLAttributes<HTMLFormElement>) => (
	<form
		noValidate
		className={cn("flex flex-col gap-2", className)}
		{...otherProps}
	/>
)
