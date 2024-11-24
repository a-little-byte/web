import { authClient } from "@alittlebyte/components/lib/auth"
import { landingConfig } from "@alittlebyte/landing/config"

const {
	useSession,
	sendVerificationEmail,
	signIn,
	signOut,
	signUp,
	forgetPassword,
	resetPassword,
} = authClient(landingConfig.services.auth)

export const useAuthClient = () => ({
	signIn,
	signOut,
	signUp,
	forgetPassword,
	sendVerificationEmail,
	resetPassword,
})

export { useSession }
