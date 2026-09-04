import { useState } from "react";

import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { photoVille } from "@/data/city-photos";
import type { DestinationImage } from "@/lib/destination-images";

/**
 * Photo relevée automatiquement pour la ville, visuel local sinon.
 *
 * POURQUOI. Les pages générées n'ont de photo de leur ville que si quelqu'un
 * l'a déposée dans `city-photos` : une entrée aujourd'hui, pour près de sept
 * cents destinations. Partout ailleurs, elles tombent sur le visuel neutre.
 * `city-image.server.ts` relève une photo de CETTE ville à la génération, et ce
 * composant l'affiche.
 *
 * ORDRE, du plus sûr au moins sûr :
 *   1. la photo de `city-photos`, choisie et légendée à la main — un relevé
 *      automatique ne passe jamais devant un choix humain, même récent ;
 *   2. l'URL relevée, quand la ville n'a pas d'entrée à la main ;
 *   3. le visuel local (curé, puis neutre), inchangé.
 *
 * L'URL relevée n'est pas hébergée par nous (Wikimedia, Pexels) : elle peut
 * disparaître entre la génération et l'affichage. `onError` ramène alors le
 * visuel local, plutôt qu'un cadre vide avec une icône d'image cassée.
 */
export function CityPicture({
  imageUrl,
  fallback,
  code,
  city,
  width,
  height,
  className,
  loading,
  vignette,
}: {
  imageUrl?: string | null | undefined;
  fallback: DestinationImage;
  /** Code IATA de la ville : sert à savoir si une photo est déjà choisie à la main. */
  code?: string | null | undefined;
  city: string;
  width: number;
  height: number;
  className?: string | undefined;
  loading?: "lazy" | "eager" | undefined;
  /** Reprend la version allégée du visuel local, pour les listes. */
  vignette?: boolean | undefined;
}) {
  const [enEchec, setEnEchec] = useState(false);

  // Une photo déposée dans `city-photos` a été regardée, choisie et légendée par
  // quelqu'un : elle vaut mieux que la première image de l'article Wikipédia,
  // et son alt décrit ce qu'elle montre, ce que le relevé ne sait pas faire.
  const choisieALaMain = photoVille(code) !== null;

  if (!imageUrl || choisieALaMain || enEchec) {
    return (
      <ResponsivePicture
        src={vignette ? fallback.thumb : fallback.src}
        webp={vignette ? fallback.thumbWebp : fallback.webp}
        alt={fallback.alt}
        width={width}
        height={height}
        {...(className ? { className } : {})}
        {...(loading ? { loading } : {})}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      /*
       * L'alt nomme la ville sans décrire la scène, à rebours de la règle que
       * suit `city-photos`. C'est le maximum de ce que le relevé sait : la photo
       * vient de l'article de CETTE ville, donc elle la montre — mais personne
       * ne l'a regardée, et écrire ce qu'on y voit reviendrait à l'inventer.
       * Une entrée dans `city-photos` reprend la main dès qu'elle existe, et
       * l'alt redevient une description.
       *
       * La ville est en tête pour éviter l'élision : « Vue de Annaba » se lit
       * mal, et `withPreposition` ne traite pas les initiales voyelles.
       */
      alt={`${city}, vue de la ville`}
      width={width}
      height={height}
      decoding="async"
      {...(loading ? { loading } : {})}
      className={className}
      onError={() => setEnEchec(true)}
    />
  );
}
