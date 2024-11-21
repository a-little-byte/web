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
	link: string
}

const ForgotPassword: React.FC<TForgotPassword> = ({ link }) => (
	<Html>
		<Preview>Verify Email</Preview>
		<Body style={main}>
			<Container style={container}>
				<Heading style={heading}>Verify Your Password</Heading>
				<Text style={text}>
					We recived a request to verify your email, please click on the button
					below in order to verify you email. If you did not make this request,
					please ignore this email.
				</Text>
				<Button href={link} style={button}>
					Verify Email
				</Button>
				<Text style={text}>
					If the button above doesn’t work, copy and paste the link below into
					your browser:
				</Text>
				<Text style={linkText}>{link}</Text>
			</Container>
		</Body>
	</Html>
)

export const verifyEmailTemplate = async (link: string) =>
	await render(<ForgotPassword link={link} />, {
		pretty: true,
	})
