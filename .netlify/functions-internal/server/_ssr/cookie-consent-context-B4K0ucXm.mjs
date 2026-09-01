import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cookie-consent-context-B4K0ucXm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "tmv-cookie-consent";
/** Recommandation CNIL : 13 mois maximum avant de redemander le consentement. */
var MAX_CONSENT_AGE_MS = 342144e5;
function readStoredConsent() {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (typeof parsed.decidedAt !== "string" || typeof parsed.maps !== "boolean") return null;
		const age = Date.now() - Date.parse(parsed.decidedAt);
		if (!Number.isFinite(age) || age > MAX_CONSENT_AGE_MS) return null;
		return {
			maps: parsed.maps,
			decidedAt: parsed.decidedAt
		};
	} catch {
		return null;
	}
}
var CookieConsentContext = (0, import_react.createContext)(null);
function CookieConsentProvider({ children }) {
	const [consent, setConsent] = (0, import_react.useState)(null);
	const [checked, setChecked] = (0, import_react.useState)(false);
	const [managerOpen, setManagerOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const stored = readStoredConsent();
		if (stored) setConsent({ maps: stored.maps });
		else setManagerOpen(true);
		setChecked(true);
	}, []);
	const persist = (0, import_react.useCallback)((categories) => {
		setConsent(categories);
		setManagerOpen(false);
		try {
			const payload = {
				...categories,
				decidedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
		} catch {}
	}, []);
	const acceptAll = (0, import_react.useCallback)(() => persist({ maps: true }), [persist]);
	const rejectAll = (0, import_react.useCallback)(() => persist({ maps: false }), [persist]);
	const savePreferences = (0, import_react.useCallback)((categories) => persist(categories), [persist]);
	const openManager = (0, import_react.useCallback)(() => setManagerOpen(true), []);
	const closeManager = (0, import_react.useCallback)(() => setManagerOpen(false), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CookieConsentContext.Provider, {
		value: {
			consent,
			managerOpen: checked && managerOpen,
			acceptAll,
			rejectAll,
			savePreferences,
			openManager,
			closeManager
		},
		children
	});
}
function useCookieConsent() {
	const ctx = (0, import_react.useContext)(CookieConsentContext);
	if (!ctx) throw new Error("useCookieConsent doit être utilisé sous CookieConsentProvider");
	return ctx;
}
//#endregion
export { useCookieConsent as n, CookieConsentProvider as t };
