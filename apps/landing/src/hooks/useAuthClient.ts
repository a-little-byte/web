import { authClient } from "@alittlebyte/components/lib/auth"
import { landingConfig } from "@alittlebyte/landing/config"

const { useSession, signIn, signOut, signUp, user } = authClient(
	landingConfig.services.auth,
)
export const useAuthClient = () => ({ signIn, signOut, signUp, user })

export { useSession }
