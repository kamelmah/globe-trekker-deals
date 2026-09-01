// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "node:path";

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

// Charge toutes les variables d'environnement (y compris celles sans préfixe VITE_)
// dans process.env pour le code serveur uniquement. Elles ne sont jamais injectées
// dans le bundle client.
const serverEnv = loadEnv(process.env["NODE_ENV"] ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  /**
   * Cible de déploiement : Netlify.
   *
   * Le paquet de configuration ne force Cloudflare que lorsqu'il détecte le bac
   * à sable Lovable ; partout ailleurs, `defaultPreset` n'est qu'un repli et un
   * `preset` explicite l'emporte. Une seule ligne suffit donc à changer de
   * cible, sans réécrire la chaîne de build.
   *
   * Sortir complètement de `@lovable.dev/vite-tanstack-config` reste à faire —
   * il apporte aussi les devtools, l'injection des VITE_*, l'alias `@` et la
   * déduplication React. C'est un second chantier, à mener une fois le site en
   * ligne sur Netlify, pas la veille de la bascule.
   */
  nitro: { preset: "netlify" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        // React Email exige entities 4.5.0 : on force la copie hoistée pour éviter
        // une copie imbriquée plus récente qui casse le rendu SSR.
        "entities/lib/decode.js": path.resolve(
          import.meta.dirname,
          "node_modules/entities/lib/decode.js",
        ),
        "entities/lib/encode.js": path.resolve(
          import.meta.dirname,
          "node_modules/entities/lib/encode.js",
        ),
        entities: path.resolve(import.meta.dirname, "node_modules/entities"),
      },
    },
  },
});
