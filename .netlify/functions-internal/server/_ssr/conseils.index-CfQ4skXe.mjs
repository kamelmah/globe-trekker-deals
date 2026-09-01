import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as formatDateMedium } from "./dates-DNk5GF2y.mjs";
import { t as POSTS } from "./posts-Cx690dcB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils.index-CfQ4skXe.js
var import_jsx_runtime = require_jsx_runtime();
function BlogIndex() {
	const seasonalPosts = POSTS.filter((post) => post.seasonal);
	const generalPosts = POSTS.filter((post) => !post.seasonal);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Conseils voyage"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm text-muted-foreground",
				children: "Articles courts et concrets, sans jargon, pour comprendre comment se forment les prix des billets d'avion et payer le vôtre moins cher."
			}),
			seasonalPosts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display",
						children: "Bons plans saisonniers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "Vacances scolaires, périodes de forte demande : ce qui change sur ces dates précises et comment s'y prendre."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-4 md:grid-cols-2",
						children: seasonalPosts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/conseils/$slug",
							params: { slug: post.slug },
							className: "block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-semibold",
									children: post.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: post.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: [
										post.readingMinutes,
										" min de lecture · mis à jour le",
										" ",
										formatDateMedium(post.updated)
									]
								})
							]
						}) }, post.slug))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display",
						children: "Conseils généraux"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "Quand réserver, comment fonctionnent les prix des compagnies, comment éviter les frais cachés : nos articles pratiques pour bien préparer votre voyage."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-4 md:grid-cols-2",
						children: generalPosts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/conseils/$slug",
							params: { slug: post.slug },
							className: "block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-semibold",
									children: post.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: post.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-xs text-muted-foreground",
									children: [
										post.readingMinutes,
										" min de lecture · mis à jour le",
										" ",
										formatDateMedium(post.updated)
									]
								})
							]
						}) }, post.slug))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground",
				children: [
					"Prêt à passer à la pratique ? Testez le",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mode-budget",
						search: {
							origin: "PAR",
							budget: 400,
							month: "",
							adultes: 1,
							enfants: 0,
							bebes: 0
						},
						className: "font-medium text-primary underline-offset-2 hover:underline",
						children: "mode budget"
					}),
					" ",
					"pour voir où partir avec la somme que vous avez en tête, ou consultez nos",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/comparatifs",
						className: "font-medium text-primary underline-offset-2 hover:underline",
						children: "comparatifs de destinations"
					}),
					" ",
					"si vous hésitez encore entre deux villes, ou nos",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/conseils/formalites",
						className: "font-medium text-primary underline-offset-2 hover:underline",
						children: "fiches visa et formalités"
					}),
					" ",
					"pour vérifier ce qu'il faut avant de réserver."
				]
			})
		]
	});
}
//#endregion
export { BlogIndex as component };
