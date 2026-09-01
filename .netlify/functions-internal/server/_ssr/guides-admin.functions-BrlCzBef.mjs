import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guides-admin.functions-BrlCzBef.js
/**
* Pilotage des guides destinations souhaités (/destinations-proposes).
* Toutes ces fonctions sont protégées par le jeton d'administration
* `ADMIN_LOGS_TOKEN`, jamais exposé au navigateur.
*/
var tokenField = stringType().trim().min(8).max(200);
function slugifyCity(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
async function db() {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	return supabaseAdmin;
}
function guard(token) {
	const expected = process.env["ADMIN_LOGS_TOKEN"];
	if (!expected) return {
		ok: false,
		message: "Jeton d'administration non configuré côté serveur."
	};
	if (token !== expected) return {
		ok: false,
		message: "Jeton invalide."
	};
	return { ok: true };
}
function mapRow(row) {
	const draft = row.draft;
	return {
		id: row.id,
		slug: row.slug,
		city: row.city,
		country: row.country,
		origin: row.origin,
		destination: row.destination,
		routeSlug: row.route_slug,
		status: row.status ?? "souhaite",
		hasDraft: Boolean(draft?.intro),
		draftTitle: draft?.title ?? null,
		draftIntro: draft?.intro ?? null,
		generatedAt: row.generated_at,
		publishedAt: row.published_at,
		errorMessage: row.error_message,
		createdAt: row.created_at
	};
}
var ROW_SELECT = "id,slug,city,country,origin,destination,route_slug,status,draft,generated_at,published_at,error_message,created_at";
async function readAll() {
	const { data, error } = await (await db()).from("guide_requests").select(ROW_SELECT).order("created_at", { ascending: false });
	if (error) throw error;
	return (data ?? []).map((row) => mapRow(row));
}
var listGuideRequests_createServerFn_handler = createServerRpc({
	id: "269668aa3ec2e4614526e3700457f0259c032c5077289e8d15f223478e2ef417",
	name: "listGuideRequests",
	filename: "src/lib/guides-admin.functions.ts"
}, (opts) => listGuideRequests.__executeServer(opts));
var listGuideRequests = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ token: tokenField }).parse(data)).handler(listGuideRequests_createServerFn_handler, async ({ data }) => {
	const check = guard(data.token);
	if (!check.ok) return {
		ok: false,
		message: check.message
	};
	try {
		return {
			ok: true,
			rows: await readAll()
		};
	} catch (error) {
		console.error("Lecture des demandes de guides impossible", error);
		return {
			ok: false,
			message: "Lecture impossible pour le moment."
		};
	}
});
var addGuideRequest_createServerFn_handler = createServerRpc({
	id: "c6274edf2ef2d7f2f6ec560f03d4fed2303ecfff4444508de0e2468d7a92c484",
	name: "addGuideRequest",
	filename: "src/lib/guides-admin.functions.ts"
}, (opts) => addGuideRequest.__executeServer(opts));
var addGuideRequest = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: tokenField,
	city: stringType().trim().min(2).max(60),
	country: stringType().trim().min(2).max(60),
	destination: stringType().trim().toUpperCase().regex(/^[A-Z]{3}$/, "Code IATA à 3 lettres attendu")
}).parse(data)).handler(addGuideRequest_createServerFn_handler, async ({ data }) => {
	const check = guard(data.token);
	if (!check.ok) return {
		ok: false,
		message: check.message
	};
	const slug = slugifyCity(data.city);
	if (!slug) return {
		ok: false,
		message: "Nom de ville invalide."
	};
	try {
		const { getCityGuide } = await import("./city-guides-B563V5AS.mjs").then((n) => n.n);
		if (getCityGuide(slug)) return {
			ok: false,
			message: `Un guide existe déjà pour ${data.city}.`
		};
		const { error } = await (await db()).from("guide_requests").insert({
			slug,
			city: data.city,
			country: data.country,
			origin: "PAR",
			destination: data.destination,
			route_slug: `paris-${slug}`,
			status: "souhaite"
		});
		if (error) {
			if (error.code === "23505" || error.code === "23000" || error.code === "23001") throw error;
			if (error.message.includes("duplicate")) return {
				ok: false,
				message: `${data.city} est déjà dans la liste.`
			};
			throw error;
		}
		return {
			ok: true,
			rows: await readAll()
		};
	} catch (error) {
		console.error("Ajout d'une ville impossible", error);
		return {
			ok: false,
			message: "Ajout impossible pour le moment."
		};
	}
});
var deleteGuideRequest_createServerFn_handler = createServerRpc({
	id: "d6bbe90e9ce3034e85d18529fc2f0c4f94ab0f9f97f61acc29d569ffb739015d",
	name: "deleteGuideRequest",
	filename: "src/lib/guides-admin.functions.ts"
}, (opts) => deleteGuideRequest.__executeServer(opts));
var deleteGuideRequest = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: tokenField,
	id: stringType().uuid()
}).parse(data)).handler(deleteGuideRequest_createServerFn_handler, async ({ data }) => {
	const check = guard(data.token);
	if (!check.ok) return {
		ok: false,
		message: check.message
	};
	try {
		const { error } = await (await db()).from("guide_requests").delete().eq("id", data.id);
		if (error) throw error;
		return {
			ok: true,
			rows: await readAll()
		};
	} catch (error) {
		console.error("Suppression impossible", error);
		return {
			ok: false,
			message: "Suppression impossible pour le moment."
		};
	}
});
var draftSchema = objectType({
	title: stringType().trim().min(10).max(160),
	metaTitle: stringType().trim().min(10).max(160),
	description: stringType().trim().min(60).max(320),
	intro: stringType().trim().min(120),
	readingMinutes: numberType().int().min(3).max(15),
	practical: objectType({
		monnaie: stringType().trim().min(5),
		langue: stringType().trim().min(3),
		visa: stringType().trim().min(5),
		transport: stringType().trim().min(5),
		budgetJour: stringType().trim().min(5)
	}),
	sections: arrayType(objectType({
		heading: stringType().trim().min(8).max(140),
		paragraphs: arrayType(stringType().trim().min(80)).min(2).max(4)
	})).min(3).max(6)
});
var generateGuideDraft_createServerFn_handler = createServerRpc({
	id: "9cd836b56319662ee67f13416227da0b8a7696fd48d097e91d857b01d7f7b1dc",
	name: "generateGuideDraft",
	filename: "src/lib/guides-admin.functions.ts"
}, (opts) => generateGuideDraft.__executeServer(opts));
var generateGuideDraft = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: tokenField,
	id: stringType().uuid()
}).parse(data)).handler(generateGuideDraft_createServerFn_handler, async ({ data }) => {
	const check = guard(data.token);
	if (!check.ok) return {
		ok: false,
		message: check.message
	};
	const apiKey = process.env["LOVABLE_API_KEY"];
	if (!apiKey) return {
		ok: false,
		message: "Clé de génération indisponible côté serveur."
	};
	const supabase = await db();
	const { data: row, error: readError } = await supabase.from("guide_requests").select(ROW_SELECT).eq("id", data.id).maybeSingle();
	if (readError || !row) return {
		ok: false,
		message: "Ville introuvable."
	};
	const request = mapRow(row);
	const prompt = `Rédige un guide voyage pratique en français pour ${request.city} (${request.country}), destiné à des voyageurs français partant de Paris.
Contraintes :
- Ton factuel et concret, aucune formule promotionnelle, aucun superlatif creux.
- N'invente JAMAIS de prix de billet d'avion ni de date : les prix des vols sont affichés séparément par le site.
- Les budgets sur place peuvent être donnés en fourchettes réalistes (repas, nuitée, transports).
- 4 sections : meilleure période, quartiers ou lieux à voir, budget sur place, transports et formalités.
- Chaque section : 2 à 3 paragraphes de 3 à 5 phrases.
Réponds uniquement en JSON, sans texte autour, avec ce schéma exact :
{"title":string,"metaTitle":string,"description":string,"intro":string,"readingMinutes":number,"practical":{"monnaie":string,"langue":string,"visa":string,"transport":string,"budgetJour":string},"sections":[{"heading":string,"paragraphs":[string]}]}`;
	try {
		const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "google/gemini-2.5-flash",
				messages: [{
					role: "system",
					content: "Tu rédiges des guides de voyage factuels en français pour un comparateur de vols. Tu réponds uniquement en JSON valide."
				}, {
					role: "user",
					content: prompt
				}]
			})
		});
		if (!response.ok) {
			const detail = (await response.text()).slice(0, 200);
			const message = response.status === 429 ? "Quota de génération atteint, réessayez plus tard." : `Génération refusée (HTTP ${response.status}).`;
			await supabase.from("guide_requests").update({ error_message: detail }).eq("id", request.id);
			return {
				ok: false,
				message
			};
		}
		const raw = (await response.json()).choices?.[0]?.message?.content ?? "";
		const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
		const parsed = draftSchema.safeParse(JSON.parse(json));
		if (!parsed.success) {
			await supabase.from("guide_requests").update({ error_message: parsed.error.issues[0]?.message ?? "Format inattendu" }).eq("id", request.id);
			return {
				ok: false,
				message: "Le brouillon généré est incomplet, relancez la génération."
			};
		}
		const draft = {
			...parsed.data,
			originCity: "Paris",
			updated: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
		};
		const { error: writeError } = await supabase.from("guide_requests").update({
			draft,
			status: request.status === "publie" ? "publie" : "brouillon",
			generated_at: (/* @__PURE__ */ new Date()).toISOString(),
			error_message: null
		}).eq("id", request.id);
		if (writeError) throw writeError;
		return {
			ok: true,
			rows: await readAll()
		};
	} catch (error) {
		console.error("Génération du brouillon impossible", error);
		return {
			ok: false,
			message: "Génération impossible pour le moment."
		};
	}
});
var setGuidePublication_createServerFn_handler = createServerRpc({
	id: "017ce9fbca13885dcda1ac055ecb3c09c95c388541cbbd3bc6eb5d136a2f2cac",
	name: "setGuidePublication",
	filename: "src/lib/guides-admin.functions.ts"
}, (opts) => setGuidePublication.__executeServer(opts));
var setGuidePublication = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: tokenField,
	id: stringType().uuid(),
	publish: booleanType()
}).parse(data)).handler(setGuidePublication_createServerFn_handler, async ({ data }) => {
	const check = guard(data.token);
	if (!check.ok) return {
		ok: false,
		message: check.message
	};
	try {
		const supabase = await db();
		if (data.publish) {
			const { data: row } = await supabase.from("guide_requests").select("draft").eq("id", data.id).maybeSingle();
			if (!(row?.draft)?.intro) return {
				ok: false,
				message: "Générez d'abord un brouillon."
			};
		}
		const { error } = await supabase.from("guide_requests").update({
			status: data.publish ? "publie" : "brouillon",
			published_at: data.publish ? (/* @__PURE__ */ new Date()).toISOString() : null
		}).eq("id", data.id);
		if (error) throw error;
		return {
			ok: true,
			rows: await readAll()
		};
	} catch (error) {
		console.error("Publication impossible", error);
		return {
			ok: false,
			message: "Publication impossible pour le moment."
		};
	}
});
//#endregion
export { addGuideRequest_createServerFn_handler, deleteGuideRequest_createServerFn_handler, generateGuideDraft_createServerFn_handler, listGuideRequests_createServerFn_handler, setGuidePublication_createServerFn_handler };
