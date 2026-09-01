import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { i as saveNewsletterSubscriber, n as newsletterInputSchema, r as saveContactMessage, t as contactInputSchema } from "./contact.server-CIe2Clj0.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact.functions-C1aMgs_M.js
var submitContactMessage_createServerFn_handler = createServerRpc({
	id: "6791d96029119711fff64366333434540863937081e92a2093993c6c31f4287b",
	name: "submitContactMessage",
	filename: "src/lib/contact.functions.ts"
}, (opts) => submitContactMessage.__executeServer(opts));
var submitContactMessage = createServerFn({ method: "POST" }).inputValidator((data) => contactInputSchema.parse(data)).handler(submitContactMessage_createServerFn_handler, async ({ data }) => saveContactMessage(data));
var subscribeNewsletter_createServerFn_handler = createServerRpc({
	id: "d8878570d2412b37574827ac00790557048edb80c0327d610455b9af9f5ea41c",
	name: "subscribeNewsletter",
	filename: "src/lib/contact.functions.ts"
}, (opts) => subscribeNewsletter.__executeServer(opts));
var subscribeNewsletter = createServerFn({ method: "POST" }).inputValidator((data) => newsletterInputSchema.parse(data)).handler(subscribeNewsletter_createServerFn_handler, async ({ data }) => saveNewsletterSubscriber(data));
//#endregion
export { submitContactMessage_createServerFn_handler, subscribeNewsletter_createServerFn_handler };
