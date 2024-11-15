import grpc from "@grpc/grpc-js"
import protoLoader from "@grpc/proto-loader"
import path from "path"

type EmailResponse = {
	success: boolean
	message: string
}

type EmailServiceClient = {
	sendEmail(
		request: { to: string; subject: string; body: string },
		callback: (error: grpc.ServiceError, response: EmailResponse) => void,
	): void
} & grpc.Client

type ProtoDescriptor = {
	EmailService: new (
		address: string,
		credentials: grpc.ChannelCredentials,
	) => EmailServiceClient
} & grpc.ProtobufTypeDefinition

const packageDefinition = protoLoader.loadSync(
	path.resolve(__dirname, "./email.proto"),
	{
		keepCase: true,
		longs: String,
		enums: String,
		defaults: true,
		oneofs: true,
	},
)
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const { EmailService } = protoDescriptor.proto as ProtoDescriptor
const client = new EmailService(
	"localhost:9000",
	grpc.credentials.createInsecure(),
)

export const sendEmail = async (
	to: string,
	subject: string,
	body: string,
): Promise<EmailResponse> =>
	await new Promise((resolve, reject) => {
		client.sendEmail(
			{ to, subject, body },
			(err: grpc.ServiceError, response: EmailResponse) => {
				if (response.success) {
					resolve(response)
				} else {
					reject(err)
				}
			},
		)
	})
