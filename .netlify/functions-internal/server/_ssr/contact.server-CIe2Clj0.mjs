import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as formatDateTimeLong } from "./dates-DNk5GF2y.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { t as logOps } from "./ops-log.server-rlNyfr2_.mjs";
import { t as render } from "../_libs/@react-email/render+[...].mjs";
import { t as TEMPLATES } from "./registry-B1PsKaw4.mjs";
import { n as sendLovableEmail, t as EmailAPIError } from "../_libs/lovable.dev__email-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact.server-CIe2Clj0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var SITE_NAME = "Budget Flights Finder";
var SENDER_DOMAIN = "notify.trouvemonvol.fr";
var FROM_DOMAIN = "notify.trouvemonvol.fr";
/**
* Renders a registered template and sends it through Lovable's managed email
* API. Suppression, retries, and rate limits are enforced by Lovable
* server-side. A suppressed recipient is an expected outcome
* ({ sent: false }); any other failure throws — EmailAPIError exposes
* .code and .status for branching.
*/
async function sendTemplateEmail(templateName, to, options = {}) {
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");
	const template = TEMPLATES[templateName];
	if (!template) throw new Error(`Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(", ")}`);
	const recipient = template.to || to;
	if (!recipient) throw new Error("Recipient is required (the template defines no fixed recipient)");
	const templateData = options.templateData ?? {};
	const element = import_react.createElement(template.component, templateData);
	const html = await render(element);
	const text = await render(element, { plainText: true });
	const subject = typeof template.subject === "function" ? template.subject(templateData) : template.subject;
	try {
		await sendLovableEmail({
			to: recipient,
			from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
			sender_domain: SENDER_DOMAIN,
			subject,
			html,
			text,
			purpose: "transactional",
			label: templateName,
			idempotency_key: options.idempotencyKey || crypto.randomUUID(),
			...options.replyTo ? { reply_to: options.replyTo } : {}
		}, {
			apiKey,
			sendUrl: process.env["LOVABLE_SEND_URL"]
		});
	} catch (error) {
		if (error instanceof EmailAPIError && error.code === "recipient_suppressed") return {
			sent: false,
			reason: "recipient_suppressed"
		};
		throw error;
	}
	return { sent: true };
}
var emailSchema = stringType().trim().toLowerCase().email("Adresse email invalide").max(255, "Email trop long");
var contactInputSchema = objectType({
	name: stringType().trim().min(1, "Nom requis").max(100, "Nom trop long"),
	email: emailSchema,
	subject: stringType().trim().min(1, "Sujet requis").max(150, "Sujet trop long"),
	message: stringType().trim().min(10, "Message trop court").max(2e3, "Message trop long")
});
var newsletterInputSchema = objectType({
	email: emailSchema,
	source: stringType().trim().max(80).optional()
});
async function admin() {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	return supabaseAdmin;
}
/** Notifie l'équipe par email ; renvoie false si l'email n'a pas pu partir. */
async function notifyContactTeam(input, messageId) {
	try {
		const result = await sendTemplateEmail("contact-notification", "contact@trouvemonvol.fr", {
			templateData: {
				name: input.name,
				email: input.email,
				subject: input.subject,
				message: input.message,
				receivedAt: formatDateTimeLong((/* @__PURE__ */ new Date()).toISOString())
			},
			idempotencyKey: `contact-notification-${messageId}`,
			replyTo: input.email
		});
		if (!result.sent) {
			logOps({
				kind: "contact",
				label: "email-notification",
				ok: false,
				message: `envoi bloqué: ${result.reason}`
			});
			return false;
		}
		logOps({
			kind: "contact",
			label: "email-notification",
			ok: true
		});
		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : "erreur inconnue";
		console.error("Erreur envoi email notification contact", error);
		logOps({
			kind: "contact",
			label: "email-notification",
			ok: false,
			message
		});
		return false;
	}
}
var UNAVAILABLE_MESSAGE = "Votre message n'a pas pu être enregistré. Réessayez dans quelques instants ou écrivez-nous directement à contact@trouvemonvol.fr.";
async function saveContactMessage(input) {
	let insertedId;
	try {
		const { data, error } = await (await admin()).from("contact_messages").insert({
			name: input.name,
			email: input.email,
			subject: input.subject,
			message: input.message
		}).select("id").single();
		if (error) {
			console.error("Erreur enregistrement message contact", error);
			logOps({
				kind: "contact",
				label: "message",
				ok: false,
				message: error.message
			});
			return {
				ok: false,
				message: UNAVAILABLE_MESSAGE
			};
		}
		insertedId = data?.id;
	} catch (error) {
		const message = error instanceof Error ? error.message : "erreur inconnue";
		console.error("Base de données indisponible (message de contact)", error);
		logOps({
			kind: "contact",
			label: "message",
			ok: false,
			message
		});
		return {
			ok: false,
			message: UNAVAILABLE_MESSAGE
		};
	}
	logOps({
		kind: "contact",
		label: "message",
		ok: true,
		message: `sujet: ${input.subject}`
	});
	if (!await notifyContactTeam(input, insertedId ?? crypto.randomUUID())) return {
		ok: false,
		message: "Votre message a bien été enregistré, mais la notification par email à notre équipe n'a pas pu être envoyée. Pour être sûr d'une réponse rapide, écrivez-nous directement à contact@trouvemonvol.fr."
	};
	return {
		ok: true,
		message: "Votre message a bien été envoyé, nous vous répondrons rapidement (sous 48 h ouvrées)."
	};
}
async function saveNewsletterSubscriber(input) {
	const failMessage = "L'inscription n'a pas pu être enregistrée. Réessayez dans quelques instants.";
	try {
		const { error } = await (await admin()).from("newsletter_subscribers").upsert({
			email: input.email,
			source: input.source ?? null,
			active: true
		}, { onConflict: "email" });
		if (error) {
			console.error("Erreur inscription newsletter", error);
			logOps({
				kind: "newsletter",
				label: "inscription",
				ok: false,
				message: error.message
			});
			return {
				ok: false,
				message: failMessage
			};
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : "erreur inconnue";
		console.error("Base de données indisponible (inscription newsletter)", error);
		logOps({
			kind: "newsletter",
			label: "inscription",
			ok: false,
			message
		});
		return {
			ok: false,
			message: failMessage
		};
	}
	logOps({
		kind: "newsletter",
		label: "inscription",
		ok: true
	});
	return {
		ok: true,
		message: "Inscription confirmée ! Vous recevrez nos bons plans vols et nos guides de voyage."
	};
}
//#endregion
export { saveNewsletterSubscriber as i, newsletterInputSchema as n, saveContactMessage as r, contactInputSchema as t };
