import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn, t as Label } from "./label-Cmix8ykc.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as Input } from "./input-HMhuwhH6.mjs";
import { a as subscribeToAlert } from "./flights.functions-2XDL4V6N.mjs";
import { I as BellRing } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AlertForm-C4olTnID.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AlertForm({ origin, destination, departDate, returnDate, referencePrice }) {
	const subscribe = useServerFn(subscribeToAlert);
	const [email, setEmail] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	async function submit(event) {
		event.preventDefault();
		if (!email) return;
		setPending(true);
		setFeedback(null);
		try {
			const result = await subscribe({ data: {
				email,
				origin,
				destination,
				departDate: departDate ?? null,
				returnDate: returnDate ?? null,
				referencePrice: referencePrice ?? null
			} });
			if (result.ok) {
				toast.success(result.message);
				setFeedback({
					ok: true,
					message: result.message
				});
				setEmail("");
			} else {
				toast.error(result.message);
				setFeedback({
					ok: false,
					message: result.message
				});
			}
		} catch {
			const message = "L'enregistrement de l'alerte a échoué. Merci de réessayer.";
			toast.error(message);
			setFeedback({
				ok: false,
				message
			});
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "rounded-xl border border-border bg-card p-5",
		"aria-label": "Alerte prix par email",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "inline-flex items-center gap-2 font-display text-lg font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellRing, {
					className: "size-4 text-primary",
					"aria-hidden": true
				}), "Être alerté si le prix baisse sur ce trajet"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-muted-foreground",
				children: "Votre email suffit, aucun compte à créer. Nous vérifions le prix une fois par jour et nous ne vous écrivons que s'il baisse. Désinscription en un clic."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-3 sm:flex-row sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: `alert-email-${origin}-${destination}`,
						children: "Votre email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: `alert-email-${origin}-${destination}`,
						type: "email",
						required: true,
						autoComplete: "email",
						placeholder: "vous@exemple.fr",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: pending,
					children: pending ? "Enregistrement…" : "Me prévenir"
				})]
			}),
			feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				role: "status",
				"aria-live": "polite",
				className: feedback.ok ? "mt-3 rounded-md border border-primary/40 bg-primary/10 p-3 text-sm text-foreground" : "mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
				children: [feedback.ok ? "✅ " : "⚠️ ", feedback.message]
			})
		]
	});
}
//#endregion
export { AlertForm as t };
