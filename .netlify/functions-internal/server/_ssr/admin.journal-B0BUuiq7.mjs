import { i as __toESM } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn, t as Label } from "./label-Cmix8ykc.mjs";
import { o as formatDateTimeShort } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { t as Input } from "./input-HMhuwhH6.mjs";
import { a as objectType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.journal-B0BUuiq7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Lecture du journal technique, protégée par le jeton d'administration
* `ADMIN_LOGS_TOKEN` (jamais exposé au navigateur).
*/
var fetchOpsLogs = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: stringType().trim().min(8).max(200),
	kind: enumType([
		"tous",
		"travelpayouts",
		"alerte"
	]).optional(),
	onlyProblems: booleanType().optional()
}).parse(data)).handler(createSsrRpc("d7f88933f6c7450eb087ea64f7864c555e78fbac8cc4335fbef9a0c83c6f04e3"));
function AdminJournal() {
	const load = useServerFn(fetchOpsLogs);
	const [token, setToken] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("tous");
	const [onlyProblems, setOnlyProblems] = (0, import_react.useState)(false);
	const [rows, setRows] = (0, import_react.useState)(null);
	const [stats, setStats] = (0, import_react.useState)([]);
	const [refresh, setRefresh] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setPending(true);
		setError(null);
		try {
			const result = await load({ data: {
				token,
				kind,
				onlyProblems
			} });
			if (result.ok) {
				setRows(result.rows);
				setStats(result.stats);
				setRefresh(result.refresh);
			} else {
				setRows(null);
				setStats([]);
				setRefresh(null);
				setError(result.message);
			}
		} catch {
			setError("Lecture du journal impossible pour le moment.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Journal technique"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: "Suivi des appels à l'API de prix et des créations d'alertes email, pour diagnostiquer les recherches sans offre disponible. Accès réservé : renseignez le jeton d'administration."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-6 flex flex-col gap-3 sm:flex-row sm:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "admin-token",
							children: "Jeton d'administration"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "admin-token",
							type: "password",
							autoComplete: "off",
							value: token,
							onChange: (e) => setToken(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "admin-kind",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "admin-kind",
							value: kind,
							onChange: (e) => setKind(e.target.value),
							className: "h-10 rounded-md border border-input bg-background px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tous",
									children: "Tous"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "travelpayouts",
									children: "Appels de prix"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "alerte",
									children: "Alertes email"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 pb-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: onlyProblems,
							onChange: (e) => setOnlyProblems(e.target.checked)
						}), "Uniquement les échecs et zéros résultats"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: pending,
						children: pending ? "Chargement…" : "Afficher"
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
				children: error
			}),
			refresh && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-lg border border-border bg-card p-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: "Mise à jour automatique des prix Travelpayouts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-muted-foreground",
						children: [
							"Dernière mise à jour : ",
							formatDateTimeShort(refresh.lastAt),
							" (heure de Paris)",
							refresh.trigger ? ` · déclenchement ${refresh.trigger}` : "",
							" · ",
							refresh.priceCount,
							" ",
							"tarifs relevés"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-muted-foreground",
						children: [
							"Prochaine mise à jour prévue : ",
							formatDateTimeShort(refresh.nextAt),
							" (cadence horaire)"
						]
					}),
					refresh.message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-destructive",
						children: ["Dernier incident : ", refresh.message]
					})
				]
			}),
			stats.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-border bg-card p-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: stat.kind
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted-foreground",
						children: [
							stat.total,
							" évènements · ",
							stat.failures,
							" échecs · ",
							stat.emptyResults,
							" sans résultat"
						]
					})]
				}, stat.kind))
			}),
			rows && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Type"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Libellé"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Statut"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Résultats"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Durée"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Message / contexte"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "p-4 text-center text-muted-foreground",
						children: "Aucun évènement pour ces filtres."
					}) }), rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 whitespace-nowrap",
								children: new Date(row.created_at).toLocaleString("fr-FR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: row.kind
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2 font-mono",
								children: row.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: row.ok ? row.status ?? "ok" : `échec ${row.status ?? ""}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: row.result_count ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-2",
								children: row.duration_ms ? `${row.duration_ms} ms` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "max-w-[420px] p-2 font-mono break-words text-muted-foreground",
								children: [row.message ? `${row.message} · ` : "", row.context ?? ""]
							})
						]
					}, row.id))] })]
				})
			})
		]
	});
}
//#endregion
export { AdminJournal as component };
