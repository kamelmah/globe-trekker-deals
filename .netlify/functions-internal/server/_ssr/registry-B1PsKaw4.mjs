import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Body } from "../_libs/react-email__body.mjs";
import { t as Container } from "../_libs/react-email__container.mjs";
import { t as Head } from "../_libs/react-email__head.mjs";
import { t as Heading } from "../_libs/react-email__heading.mjs";
import { t as Hr } from "../_libs/react-email__hr.mjs";
import { t as Html } from "../_libs/react-email__html.mjs";
import { t as Link } from "../_libs/react-email__link.mjs";
import { t as Preview } from "../_libs/react-email__preview.mjs";
import { t as Section } from "../_libs/react-email__section.mjs";
import { t as Text } from "../_libs/react-email__text.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var Email = ({ name, email, subject, message, receivedAt }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Html, {
	lang: "fr",
	dir: "ltr",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preview, { children: `Nouveau message de ${name || "un visiteur"} : ${subject || "sans sujet"}` }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Body, {
			style: main,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Container, {
				style: container,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: brand,
						children: "TrouveMonVol"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						style: heading,
						children: "Nouveau message du formulaire de contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						style: card,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: label,
									children: "Nom : "
								}), name || "Non renseigné"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: label,
									children: "Email : "
								}), email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									href: `mailto:${email}`,
									style: link,
									children: email
								}) : "Non renseigné"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: label,
									children: "Sujet : "
								}), subject || "Sans sujet"]
							}),
							receivedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Text, {
								style: row,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: label,
									children: "Reçu le : "
								}), receivedAt]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						as: "h2",
						style: subheading,
						children: "Message"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: messageStyle,
						children: message || "Message vide"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hr, { style: hr }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
						style: footer,
						children: "Répondez directement à cet email pour contacter l'expéditeur."
					})
				]
			})
		})
	]
});
var template = {
	component: Email,
	subject: (data) => `Contact TrouveMonVol : ${data?.["subject"] || "nouveau message"}`,
	displayName: "Notification de message de contact",
	to: "contact@trouvemonvol.fr",
	previewData: {
		name: "Camille Dupont",
		email: "camille.dupont@exemple.fr",
		subject: "Question sur un prix affiché",
		message: "Bonjour, j'ai vu un vol Paris–Marrakech à 89 € mais le prix a changé au moment de réserver. Pouvez-vous m'aider ?",
		receivedAt: "31 août 2026 à 01:45"
	}
};
var main = {
	backgroundColor: "#ffffff",
	fontFamily: "Arial, Helvetica, sans-serif"
};
var container = {
	padding: "24px 28px",
	maxWidth: "600px"
};
var brand = {
	fontSize: "13px",
	fontWeight: 700,
	letterSpacing: "1px",
	color: "#0f766e",
	margin: "0 0 8px"
};
var heading = {
	fontSize: "22px",
	lineHeight: "30px",
	color: "#0f172a",
	margin: "0 0 18px"
};
var subheading = {
	fontSize: "15px",
	color: "#0f172a",
	margin: "22px 0 8px"
};
var card = {
	border: "1px solid #e2e8f0",
	borderRadius: "10px",
	padding: "14px 18px",
	backgroundColor: "#f8fafc"
};
var row = {
	fontSize: "14px",
	lineHeight: "22px",
	color: "#334155",
	margin: "4px 0"
};
var label = {
	color: "#0f172a",
	fontWeight: 700
};
var link = { color: "#0f766e" };
var messageStyle = {
	fontSize: "15px",
	lineHeight: "24px",
	color: "#1e293b",
	whiteSpace: "pre-wrap",
	margin: "0"
};
var hr = {
	borderColor: "#e2e8f0",
	margin: "26px 0 14px"
};
var footer = {
	fontSize: "12px",
	lineHeight: "18px",
	color: "#64748b",
	margin: "0"
};
/**
* Template registry — maps template names to their React Email components.
* Import and register new templates here after creating them in this directory.
*
* Example:
*   import { template as welcomeTemplate } from './welcome'
*   // then add to TEMPLATES: 'welcome': welcomeTemplate
*/
var TEMPLATES = { "contact-notification": template };
//#endregion
export { TEMPLATES as t };
