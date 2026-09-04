/**
 * Photos de villes : pleine taille et vignette, aux formats servis par le site.
 *
 * Ajouter une ville dans city-photos.ts demande deux fichiers WebP aux bonnes
 * dimensions. Les produire à la main, c'est répéter le même recadrage et la
 * même compression à chaque ville — et se tromper une fois suffit à servir une
 * image pleine taille dans une vignette de 48 px, ce que la vignette distincte
 * existe précisément pour éviter.
 *
 * Génération hors ligne, comme generate-og-images.mjs : les images produites
 * sont commitées, le build de production n'exécute rien d'ici et ne dépend pas
 * de sharp. Il n'est donc pas dans package.json. Pour lancer :
 *
 *   npm i --no-save --no-package-lock sharp
 *   node scripts/generate-city-photos.mjs
 *
 * ENTRÉE — un dossier `photos-sources/` à la racine, hors dépôt, contenant par
 * ville deux fichiers de même nom :
 *
 *   AGP-malaga-alcazaba.jpg   la photo source, 1200 px de large au minimum
 *   AGP-malaga-alcazaba.txt   son texte alternatif, une ligne
 *
 * Le préfixe est le code IATA de la ville, le reste devient le nom des fichiers
 * publiés. Le nom décrit le sujet et pas seulement la ville : « malaga » seul
 * ne dit pas ce que montre l'image, et c'est ce qui distingue une photo de
 * destination d'un visuel d'illustration.
 *
 * L'ALT EST OBLIGATOIRE ET NE SE DÉDUIT PAS. Le script refuse une photo sans
 * son .txt plutôt que d'inventer « Malaga, Espagne » — un alt qui nomme la
 * ville au lieu de décrire l'image est exactement le défaut que la sélection
 * automatique par ambiance avait laissé derrière elle.
 *
 * SORTIE — les deux WebP dans public/images/, puis les entrées CITY_PHOTOS
 * prêtes à coller dans src/data/city-photos.ts. Le script n'écrit jamais dans
 * ce module : une entrée doit passer en revue de code comme le reste.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = process.env["PHOTOS_SRC"] ?? path.join(ROOT, "photos-sources");
const OUT_DIR = path.join(ROOT, "public", "images");

/**
 * 16/9 aux deux tailles, et la vignette fait la moitié de la grande.
 *
 * Ce sont les dimensions de la photo d'Oran, la seule entrée existante : les
 * cartes de destination et les bannières de guide sont déjà calées dessus.
 */
const FULL = { width: 1200, height: 675 };
const THUMB = { width: 600, height: 338 };
const QUALITE = 80;

/** Une source plus étroite que la cible serait agrandie, donc floue. */
const LARGEUR_SOURCE_MIN = FULL.width;

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

function erreur(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    erreur(`dossier source absent : ${path.relative(ROOT, SRC_DIR)}`);
    console.error("  Créez-le et déposez-y les paires <IATA>-<sujet>.jpg / .txt.");
    return;
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sources = fs
    .readdirSync(SRC_DIR)
    .filter((nom) => EXTENSIONS.has(path.extname(nom).toLowerCase()))
    .sort();

  if (sources.length === 0) {
    erreur(`aucune image dans ${path.relative(ROOT, SRC_DIR)}`);
    return;
  }

  const entrees = [];

  for (const nom of sources) {
    const base = path.basename(nom, path.extname(nom));
    const correspondance = /^([A-Za-z]{3})-(.+)$/.exec(base);
    if (!correspondance) {
      erreur(`${nom} : nom attendu « <IATA>-<sujet> », par exemple AGP-malaga-alcazaba.jpg`);
      continue;
    }
    const code = correspondance[1].toUpperCase();
    const slug = correspondance[2].toLowerCase();

    const fichierAlt = path.join(SRC_DIR, `${base}.txt`);
    if (!fs.existsSync(fichierAlt)) {
      erreur(`${nom} : ${base}.txt manquant — le texte alternatif ne se déduit pas de la ville.`);
      continue;
    }
    const alt = fs.readFileSync(fichierAlt, "utf8").trim().replace(/\s+/g, " ");
    if (alt.length < 20) {
      erreur(`${base}.txt : alt trop court (${alt.length} car.), décrivez ce que MONTRE la photo.`);
      continue;
    }

    const source = path.join(SRC_DIR, nom);
    const meta = await sharp(source).metadata();
    if ((meta.width ?? 0) < LARGEUR_SOURCE_MIN) {
      erreur(`${nom} : ${meta.width} px de large, il en faut ${LARGEUR_SOURCE_MIN} au minimum.`);
      continue;
    }

    // `cover` recadre au centre plutôt que de déformer : une skyline étirée se
    // voit immédiatement, un bord perdu presque jamais.
    const rendre = (taille, sortie) =>
      sharp(source)
        .resize({ ...taille, fit: "cover", position: "centre" })
        .webp({ quality: QUALITE })
        .toFile(sortie);

    const pleine = path.join(OUT_DIR, `${slug}.webp`);
    const vignette = path.join(OUT_DIR, `${slug}-thumb.webp`);
    const [infoPleine, infoVignette] = await Promise.all([
      rendre(FULL, pleine),
      rendre(THUMB, vignette),
    ]);

    const ko = (info) => `${Math.round(info.size / 1024)} ko`;
    console.log(
      `✓ ${code}  ${slug}.webp (${ko(infoPleine)})  ${slug}-thumb.webp (${ko(infoVignette)})`,
    );

    entrees.push({ code, slug, alt });
  }

  if (entrees.length === 0) return;

  entrees.sort((a, b) => a.code.localeCompare(b.code));
  console.log("\nÀ coller dans src/data/city-photos.ts, dans CITY_PHOTOS :\n");
  for (const { code, slug, alt } of entrees) {
    console.log(`  ${code}: {`);
    console.log(`    imageUrl: "/images/${slug}.webp",`);
    console.log(`    imageThumbUrl: "/images/${slug}-thumb.webp",`);
    console.log(`    imageAlt: ${JSON.stringify(alt)},`);
    console.log(`  },`);
  }
}

await main();
