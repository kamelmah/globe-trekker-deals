import { i as __toESM } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn, t as Label } from "./label-Cmix8ykc.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { t as Input } from "./input-HMhuwhH6.mjs";
import { E as CircleCheck, S as LoaderCircle, b as MailCheck, l as Send, y as Mail } from "../_libs/lucide-react.mjs";
import { n as newsletterInputSchema, t as contactInputSchema } from "./contact.server-CIe2Clj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-DyRVUiad.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var submitContactMessage = createServerFn({ method: "POST" }).inputValidator((data) => contactInputSchema.parse(data)).handler(createSsrRpc("6791d96029119711fff64366333434540863937081e92a2093993c6c31f4287b"));
var subscribeNewsletter = createServerFn({ method: "POST" }).inputValidator((data) => newsletterInputSchema.parse(data)).handler(createSsrRpc("d8878570d2412b37574827ac00790557048edb80c0327d610455b9af9f5ea41c"));
function ContactPage() {
	const submit = useServerFn(submitContactMessage);
	const subscribe = useServerFn(subscribeNewsletter);
	const [contactFeedback, setContactFeedback] = (0, import_react.useState)(null);
	const [contactPending, setContactPending] = (0, import_react.useState)(false);
	const [newsletterFeedback, setNewsletterFeedback] = (0, import_react.useState)(null);
	const [newsletterPending, setNewsletterPending] = (0, import_react.useState)(false);
	async function onContactSubmit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		setContactPending(true);
		setContactFeedback(null);
		try {
			const result = await submit({ data: {
				name: String(data.get("name") ?? ""),
				email: String(data.get("email") ?? ""),
				subject: String(data.get("subject") ?? ""),
				message: String(data.get("message") ?? "")
			} });
			setContactFeedback(result);
			if (result.ok) form.reset();
		} catch (error) {
			setContactFeedback({
				ok: false,
				message: error instanceof Error && error.message ? error.message : "Une erreur est survenue. Réessayez dans quelques instants."
			});
		} finally {
			setContactPending(false);
		}
	}
	async function onNewsletterSubmit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		setNewsletterPending(true);
		setNewsletterFeedback(null);
		try {
			const result = await subscribe({ data: {
				email: String(data.get("newsletter-email") ?? ""),
				source: "page-contact"
			} });
			setNewsletterFeedback(result);
			if (result.ok) form.reset();
		} catch (error) {
			setNewsletterFeedback({
				ok: false,
				message: error instanceof Error && error.message ? error.message : "Une erreur est survenue. Réessayez dans quelques instants."
			});
		} finally {
			setNewsletterPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "container-page max-w-3xl py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display",
				children: "Contact & newsletter"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-2xl text-muted-foreground",
				children: [
					"Une question sur un prix affiché, un bug à signaler ou une suggestion ? Écrivez-nous à",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:contact@trouvemonvol.fr",
						className: "font-medium text-primary underline-offset-4 hover:underline",
						children: "contact@trouvemonvol.fr"
					}),
					" ",
					"ou via le formulaire ci-dessous. Nous répondons sous 48 h ouvrées."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "contact-form-title",
				className: "mt-10 rounded-2xl border border-border bg-card p-6 md:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					id: "contact-form-title",
					className: "flex items-center gap-2 text-xl font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
						className: "size-5 text-primary",
						"aria-hidden": true
					}), "Nous écrire"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: onContactSubmit,
					className: "mt-5 grid gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Nom"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									name: "name",
									required: true,
									maxLength: 100,
									autoComplete: "name",
									placeholder: "Votre nom"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									name: "email",
									type: "email",
									required: true,
									maxLength: 255,
									autoComplete: "email",
									placeholder: "vous@exemple.fr"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "subject",
								children: "Sujet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "subject",
								name: "subject",
								required: true,
								maxLength: 150,
								placeholder: "Objet de votre message"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "message",
								children: "Message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "message",
								name: "message",
								required: true,
								minLength: 10,
								maxLength: 2e3,
								rows: 6,
								placeholder: "Décrivez votre question ou votre suggestion…"
							})]
						}),
						contactFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "status",
							className: `rounded-lg border px-4 py-3 text-sm ${contactFeedback.ok ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-destructive/40 bg-destructive/10 text-destructive"}`,
							children: contactFeedback.message
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: contactPending,
							className: "gap-1.5 sm:w-fit",
							children: [contactPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "size-4 animate-spin",
								"aria-hidden": true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
								className: "size-4",
								"aria-hidden": true
							}), "Envoyer le message"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "newsletter-title",
				className: "mt-8 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						id: "newsletter-title",
						className: "flex items-center gap-2 text-xl font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, {
							className: "size-5 text-primary",
							"aria-hidden": true
						}), "Recevoir nos bons plans"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Une fois par semaine maximum : nos nouveaux guides de destination, les baisses de prix marquantes que nous observons et nos conseils pour payer vos vols moins cher. Désinscription en un clic à tout moment, jamais de revente de votre adresse."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onNewsletterSubmit,
						className: "mt-4 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "newsletter-email",
							name: "newsletter-email",
							type: "email",
							required: true,
							maxLength: 255,
							autoComplete: "email",
							placeholder: "votre@email.fr",
							"aria-label": "Votre adresse email",
							className: "sm:max-w-xs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							variant: "outline",
							disabled: newsletterPending,
							className: "gap-1.5",
							children: [newsletterPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "size-4 animate-spin",
								"aria-hidden": true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
								className: "size-4",
								"aria-hidden": true
							}), "S'inscrire à la newsletter"]
						})]
					}),
					newsletterFeedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						role: "status",
						className: `mt-3 rounded-lg border px-4 py-3 text-sm ${newsletterFeedback.ok ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-destructive/40 bg-destructive/10 text-destructive"}`,
						children: newsletterFeedback.message
					})
				]
			})
		]
	});
}
//#endregion
export { ContactPage as component };
