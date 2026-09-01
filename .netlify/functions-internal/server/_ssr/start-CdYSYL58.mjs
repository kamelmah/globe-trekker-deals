import { n as createMiddleware, t as createCsrfMiddleware } from "./createCsrfMiddleware-B2To0gPJ.mjs";
import { n as describeError, t as renderErrorPage } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-CdYSYL58.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
var createStart = (getOptions) => {
	return {
		getOptions: async () => {
			const options = await getOptions();
			if (options.serializationAdapters) {
				const deduped = /* @__PURE__ */ new Set();
				dedupeSerializationAdapters(deduped, options.serializationAdapters);
				options.serializationAdapters = Array.from(deduped);
			}
			return options;
		},
		createMiddleware
	};
};
/** Les routes /lovable/* s'authentifient elles-mêmes : aucun middleware ne doit les intercepter. */
function isLovableRoute(request) {
	return new URL(request.url).pathname.startsWith("/lovable/");
}
var errorMiddleware = createMiddleware().server(async ({ next, request }) => {
	if (isLovableRoute(request)) return next();
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(describeError(error)), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var csrfMiddleware = createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" && !isLovableRoute(ctx.request) });
var startInstance = createStart(() => ({ requestMiddleware: [errorMiddleware, csrfMiddleware] }));
//#endregion
export { startInstance };
