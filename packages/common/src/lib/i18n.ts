import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpBackend from "i18next-http-backend"
import ICU from "i18next-icu"
import { initReactI18next } from "react-i18next"

void i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.use(HttpBackend)
	.use(ICU)
	.init({
		backend: { loadPath: "/i18n/{{lng}}/{{ns}}.json" },
		supportedLngs: ["en", "fr"],
		fallbackLng: "en",
		detection: { order: ["navigator", "cookie", "htmlTag"] },
		ns: ["common"],
		interpolation: {
			escapeValue: false,
		},
		react: {
			transSupportBasicHtmlNodes: false,
		},
	})
