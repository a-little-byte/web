import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@alittlebyte/components/ui/form"
import { Input } from "@alittlebyte/components/ui/input"
import { Control, FieldPath, FieldValues } from "react-hook-form"

export const InputField = <TFieldValues extends FieldValues>({
	control,
	name,
	placeholder,
	label,
	description,
	disabled,
	type,
}: {
	control: Control<TFieldValues>
	type?: React.HTMLInputTypeAttribute
	disabled?: boolean
	name: FieldPath<TFieldValues>
	placeholder?: string
	label: string
	description?: string
}) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							type={type}
							disabled={disabled}
							placeholder={placeholder}
							{...field}
						/>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
