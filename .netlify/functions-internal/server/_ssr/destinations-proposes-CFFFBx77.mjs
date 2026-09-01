import { i as __toESM } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn, t as Label } from "./label-Cmix8ykc.mjs";
import { o as formatDateTimeShort } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { t as Input } from "./input-HMhuwhH6.mjs";
import { a as objectType, n as booleanType, o as stringType } from "../_libs/zod.mjs";
import { t as AIRPORTS } from "./airports-DEvng4YS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/destinations-proposes-CFFFBx77.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Pilotage des guides destinations souhaités (/destinations-proposes).
* Toutes ces fonctions sont protégées par le jeton d'administration
* `ADMIN_LOGS_TOKEN`, jamais exposé au navigateur.
*/
var tokenField = stringType().trim().min(8).max(200);
var listGuideRequests = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ token: tokenField }).parse(data)).handler(createSsrRpc("269668aa3ec2e4614526e3700457f0259c032c5077289e8d15f223478e2ef417"));
var addGuideRequest = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: tokenField,
	city: stringType().trim().min(2).max(60),
	country: stringType().trim().min(2).max(60),
	destination: stringType().trim().toUpperCase().regex(/^[A-Z]{3}$/, "Code IATA à 3 lettres attendu")
}).parse(data)).handler(createSsrRpc("c6274edf2ef2d7f2f6ec560f03d4fed2303ecfff4444508de0e2468d7a92c484"));
var deleteGuideRequest = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: tokenField,
	id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("d6bbe90e9ce3034e85d18529fc2f0c4f94ab0f9f97f61acc29d569ffb739015d"));
var generateGuideDraft = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: tokenField,
	id: stringType().uuid()
}).parse(data)).handler(createSsrRpc("9cd836b56319662ee67f13416227da0b8a7696fd48d097e91d857b01d7f7b1dc"));
var setGuidePublication = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: tokenField,
	id: stringType().uuid(),
	publish: booleanType()
}).parse(data)).handler(createSsrRpc("017ce9fbca13885dcda1ac055ecb3c09c95c388541cbbd3bc6eb5d136a2f2cac"));
var STATUS_LABEL = {
	souhaite: "Souhaité",
	brouillon: "Brouillon à valider",
	publie: "Publié"
};
function ProposedDestinations() {
	const load = useServerFn(listGuideRequests);
	const add = useServerFn(addGuideRequest);
	const generate = useServerFn(generateGuideDraft);
	const publish = useServerFn(setGuidePublication);
	const remove = useServerFn(deleteGuideRequest);
	const [token, setToken] = (0, import_react.useState)("");
	const [unlocked, setUnlocked] = (0, import_react.useState)(false);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [city, setCity] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("");
	const [destination, setDestination] = (0, import_react.useState)("");
	function apply(result, successMessage) {
		if (result.ok) {
			setRows(result.rows);
			setUnlocked(true);
			setError(null);
			setNotice(successMessage ?? null);
		} else {
			setError(result.message);
			setNotice(null);
		}
	}
	async function run(key, action, onDone) {
		setPending(key);
		try {
			onDone(await action());
		} catch {
			setError("Action impossible pour le moment.");
		} finally {
			setPending(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Destinations proposées"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: "Listez ici les villes dont vous voulez un guide conseils. Le bouton « Générer le brouillon » rédige automatiquement la fiche ; elle reste invisible du public jusqu'à ce que vous la publiiez. Accès réservé : renseignez le jeton d'administration."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => {
					event.preventDefault();
					run("load", () => load({ data: { token } }), (result) => apply(result));
				},
				className: "mt-6 flex flex-col gap-3 sm:flex-row sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "guides-token",
						children: "Jeton d'administration"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "guides-token",
						type: "password",
						autoComplete: "off",
						value: token,
						onChange: (event) => setToken(event.target.value),
						required: true
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: pending === "load",
					children: pending === "load" ? "Chargement…" : "Afficher la liste"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive",
				children: error
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				className: "mt-4 rounded-lg bg-secondary p-3 text-sm text-foreground",
				children: notice
			}),
			unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Ajouter une ville"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (event) => {
						event.preventDefault();
						run("add", () => add({ data: {
							token,
							city,
							country,
							destination
						} }), (result) => {
							apply(result, result.ok ? `${city} ajoutée à la liste.` : void 0);
							if (result.ok) {
								setCity("");
								setCountry("");
								setDestination("");
							}
						});
					},
					className: "mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_140px_auto] sm:items-end",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "guide-city",
								children: "Ville"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "guide-city",
								value: city,
								onChange: (event) => setCity(event.target.value),
								placeholder: "Porto",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "guide-country",
								children: "Pays"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "guide-country",
								value: country,
								onChange: (event) => setCountry(event.target.value),
								placeholder: "Portugal",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "guide-iata",
									children: "Code aéroport"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "guide-iata",
									list: "guide-iata-list",
									value: destination,
									onChange: (event) => setDestination(event.target.value.toUpperCase()),
									placeholder: "OPO",
									maxLength: 3,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
									id: "guide-iata-list",
									children: AIRPORTS.map((airport) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: airport.code,
										children: [
											airport.city,
											" — ",
											airport.country
										]
									}, airport.code))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: pending === "add",
							children: pending === "add" ? "Ajout…" : "Ajouter"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-lg font-semibold",
					children: [
						"Villes en attente de guide (",
						rows.length,
						")"
					]
				}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Aucune ville dans la liste pour le moment."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-4",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-base font-semibold",
									children: [
										row.city,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["· ", row.country]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-secondary px-2.5 py-1 text-xs",
									children: STATUS_LABEL[row.status]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"/conseils/destinations/",
									row.slug,
									" · vols /vols/",
									row.routeSlug,
									" · aéroport",
									" ",
									row.destination
								]
							}),
							row.generatedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Brouillon généré le ",
									formatDateTimeShort(row.generatedAt),
									row.publishedAt ? ` · publié le ${formatDateTimeShort(row.publishedAt)}` : ""
								]
							}),
							row.draftTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-medium",
								children: row.draftTitle
							}),
							row.draftIntro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-4 text-sm text-muted-foreground",
								children: row.draftIntro
							}),
							row.errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-destructive",
								children: row.errorMessage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "secondary",
										disabled: pending === `gen-${row.id}`,
										onClick: () => void run(`gen-${row.id}`, () => generate({ data: {
											token,
											id: row.id
										} }), (result) => apply(result, result.ok ? `Brouillon rédigé pour ${row.city}.` : void 0)),
										children: pending === `gen-${row.id}` ? "Rédaction…" : row.hasDraft ? "Régénérer le brouillon" : "Générer le brouillon"
									}),
									row.hasDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										disabled: pending === `pub-${row.id}`,
										onClick: () => void run(`pub-${row.id}`, () => publish({ data: {
											token,
											id: row.id,
											publish: row.status !== "publie"
										} }), (result) => apply(result, result.ok ? row.status === "publie" ? `${row.city} dépubliée.` : `${row.city} publiée sur /conseils/destinations/${row.slug}.` : void 0)),
										children: row.status === "publie" ? "Dépublier" : "Publier la fiche"
									}),
									row.status === "publie" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
											href: `/conseils/destinations/${row.slug}`,
											target: "_blank",
											rel: "noreferrer",
											children: "Voir la fiche"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										disabled: pending === `del-${row.id}`,
										onClick: () => void run(`del-${row.id}`, () => remove({ data: {
											token,
											id: row.id
										} }), (result) => apply(result, result.ok ? `${row.city} retirée.` : void 0)),
										children: "Retirer"
									})
								]
							})
						]
					}, row.id))
				})]
			})] })
		]
	});
}
//#endregion
export { ProposedDestinations as component };
