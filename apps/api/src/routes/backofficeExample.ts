import type { PublicContextVariables } from "@alittlebyte/api/utils/types"
import { Hono } from "hono"

export const backofficeExample = new Hono<{
	Variables: PublicContextVariables
}>().get("/", ({ json }) =>
	json({
		title: {
			image:
				"https://imgs.search.brave.com/ptCS5ZaCZFACSw6TGiRinWgKFqlfQFxk_tP9o2DBKRo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ0/MDUwMzU1OS9waG90/by9mb3Jlc3Qtc3Vu/bGlnaHQuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPXBaTm9O/SF9EdG8tZTlpZ2NF/UGYzbWNZZUFhdUNm/cDNTN2t5R25CUWRz/VXc9",
			subtitle: "protège votre entreprise contre les cyberattaques ",
		},
		carousel: [
			{
				title: "Prévention",
				description: "Prévention contre de cyberattaques",
				image:
					"https://imgs.search.brave.com/6Te28zpjAmVsJUC_OtA5vQ15rBDquHXBCz58Gi_2gs8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE4/MDQ5NDEzMi9waG90/by9kYW5kZWxpb24u/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PURNYUdsRmgydWlB/ZnFDRGpIb3M3NFl0/bW1tU1pqRE9UeFU5/YmpqWDMzRDg9",
			},
			{
				title: "Protection 24/7",
				description: "Protection de cyberatques",
				image:
					"https://imgs.search.brave.com/smZBszDq09Yvsmjp4S7MXDgskgPhMbQIz9O33jCSv3g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTMz/MDIzOTU2Ni9waG90/by93ZWVkcy1vbi1h/LWxha2Utc2hvcmUu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PTJ5Z2EwMms1Nk1y/TlI1VnRaaTdtcmst/ajNNOGlFX0lOMnox/V2tKVGZQUms9",
			},
			{
				title: "Réponse",
				description: "Réponse de cyberattaques",
				image:
					"https://imgs.search.brave.com/TWDy-M1-5BBGmtucKofWn2uw_njHZTxfJ-H7DWam8fA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI4/Mzg1MjY2Ny9waG90/by90b3VjaC1vZi1m/cmVzaC1tb3NzLWlu/LXRoZS1mb3Jlc3Qu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUk5MUlWX0l0X3hE/RVVsVUNPZzloY29F/dzgzeW03UTItMWhz/Q1h0Ty1sN0E9",
			},
			{
				title: "Account Takeover",
				description: "Unauthorized access to user accounts",
				image:
					"https://imgs.search.brave.com/crP9HN0mSFTROeLdUdGHVQ0D6gzrWhHPzC2EsT0TBPY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTA2/Njc4NTI1OC9waG90/by9oZW11LXZpbGxh/Z2UtaW4tYXV0dW1u/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1NX3dlSHBVOVVo/UGt6N2JTcXc3RF9V/U1FGdjZCQUZJbHZW/NDRVdEVDeUFnPQ",
			},
			{
				title: "Data Loss",
				description: "Exfiltration of data due to security misconfigurations",
				image:
					"https://imgs.search.brave.com/kaklxZp6vpWRORYLlPklCspB59GUSesTBXutqW7U0HQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM2/MDg4NDU2Ni9waG90/by9jaXR5c2NhcGUt/bWl4ZWQtd2l0aC1n/cmVlbi1wbGFudHMt/bXVsdGktbGF5ZXJl/ZC1pbWFnZS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9clcy/SmNDYVF2NDFCVEtY/X2YzSl9OUG5VRlhw/cF9TSlZwT2JGdlZO/REJHcz0",
			},
			{
				title: "Phishing",
				description: "protection contre des attaques phising",
				image:
					"https://imgs.search.brave.com/65oLuJH1pHCnQtL9pCzLL3oc42QhMfwvKKkU9cXKVWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTA4/ODE1NTkwOC9waG90/by9hcXVhLWFuZC1n/cmVlbi1wc3ljaGVk/ZWxpYy1mcmFjdGFs/LWJhY2tncm91bmQt/bGlrZS1mbG9yYWwt/cGV0YWwuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPUw0cjA1/LXEtRUNSMDBMNTRf/SnNDYWNzY0huV2I4/QTFNYVhIbDFGa2Vs/dXc9",
			},
		],
		categories: [
			{
				title: "Lorem",
				link: "/security",
				description: "lorem ipsum",
			},
			{
				title: "Lorem",
				link: "/analytics",
				description: "lorem ipsum",
			},
			{
				title: "Lorem",
				link: "/lorem",
				description: "lorem ipsum",
			},
			{
				title: "Lorem",
				link: "/lorem",
				description: "lorem ipsum",
			},
		],
	}),
)
