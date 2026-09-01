import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as formatPrice, i as formatAmount, o as isCurrencyCode } from "./trip-duration-Dr4Tuig8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/currency-context-BjWSGzF3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CurrencyContext = (0, import_react.createContext)(null);
var STORAGE_KEY = "tmv-currency";
function CurrencyProvider({ children }) {
	const [currency, setCurrencyState] = (0, import_react.useState)("EUR");
	(0, import_react.useEffect)(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (stored && isCurrencyCode(stored)) setCurrencyState(stored);
	}, []);
	const setCurrency = (0, import_react.useCallback)((code) => {
		setCurrencyState(code);
		window.localStorage.setItem(STORAGE_KEY, code);
	}, []);
	const format = (0, import_react.useCallback)((amountEur) => formatPrice(amountEur, currency), [currency]);
	const formatApi = (0, import_react.useCallback)((amount) => formatAmount(amount, currency), [currency]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyContext.Provider, {
		value: {
			currency,
			setCurrency,
			format,
			formatApi
		},
		children
	});
}
function useCurrency() {
	const ctx = (0, import_react.useContext)(CurrencyContext);
	if (!ctx) return {
		currency: "EUR",
		setCurrency: () => {},
		format: (amount) => formatPrice(amount, "EUR"),
		formatApi: (amount) => formatAmount(amount, "EUR")
	};
	return ctx;
}
//#endregion
export { useCurrency as n, CurrencyProvider as t };
