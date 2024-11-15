import React from "react"
import {
	Body,
	Container,
	Heading,
	Button,
	Html,
	Preview,
	Text,
} from "@react-email/components"
import { render } from "@react-email/render"

const main = {
	fontFamily: "Arial, sans-serif",
	backgroundColor: "#f6f6f6",
	padding: "20px",
}
const container = {
	maxWidth: "600px",
	margin: "0 auto",
	backgroundColor: "#ffffff",
	padding: "20px",
	borderRadius: "5px",
	boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
}
const heading = {
	fontSize: "24px",
	marginBottom: "20px",
}
const text = {
	fontSize: "16px",
	margin: "10px 0",
}
const button = {
	display: "inline-block",
	fontSize: "16px",
	backgroundColor: "#007bff",
	color: "#ffffff",
	padding: "10px 20px",
	textDecoration: "none",
	borderRadius: "5px",
}
const linkText = {
	fontSize: "14px",
	color: "#007bff",
}

type TForgotPassword = {
	resetLink: string
}

const ForgotPassword: React.FC<TForgotPassword> = ({ resetLink }) => (
	<Html>
		<Preview>Password Reset Request</Preview>
		<Body style={main}>
			<Container style={container}>
				<Heading style={heading}>Reset Your Password</Heading>
				<Text style={text}>
					We received a request to reset your password. Click the button below
					to proceed. If you did not make this request, please ignore this
					email.
				</Text>
				<Button href={resetLink} style={button}>
					Reset Password
				</Button>
				<Text style={text}>
					If the button above doesn’t work, copy and paste the link below into
					your browser:
				</Text>
				<Text style={linkText}>{resetLink}</Text>
			</Container>
		</Body>
	</Html>
)

export const forgotPasswordTemplate = async (resetLink: string) =>
	await render(<ForgotPassword resetLink={resetLink} />, {
		pretty: true,
	})
