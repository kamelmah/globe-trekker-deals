import { useState } from "react";

import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import type { DestinationImage } from "@/lib/destination-images";

/**
 * Photo de la ville quand nous en avons relevé une, visuel d'ambiance sinon.
 *
 * POURQUOI. Les pages générées n'avaient que le visuel d'ambiance de
 * `getDestinationImage` : cohérent avec la région, mais jamais avec la ville.
 * `src/lib/city-image.server.ts` relève désormais une photo de la ville à la
 * génération, et ce composant l'affiche — sans jamais laisser une page sans
 * image si l'URL manque ou ne charge pas.
 *
 * L'URL distante n'est pas hébergée par nous (Wikimedia, Pexels) : elle peut
 * disparaître entre la génération et l'affichage. `onError` ramène alors le
 * visuel local, plutôt qu'un cadre vide avec une icône d'image cassée.
 */
export function CityPicture({
  imageUrl,
  fallback,
  city,
  width,
  height,
  className,
  loading,
  vignette,
}: {
  imageUrl?: string | null | undefined;
  fallback: DestinationImage;
  city: string;
  width: number;
  height: number;
  className?: string | undefined;
  loading?: "lazy" | "eager" | undefined;
  /** Reprend la version allégée du visuel local, pour les listes. */
  vignette?: boolean | undefined;
}) {
  const [enEchec, setEnEchec] = useState(false);

  if (!imageUrl || enEchec) {
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
      // Le libellé reste sobre : nous savons que la photo illustre cette ville,
      // pas ce qu'elle montre. Décrire une scène que nous n'avons pas vue
      // reviendrait à l'inventer.
      alt={`Vue de ${city}`}
      width={width}
      height={height}
      decoding="async"
      {...(loading ? { loading } : {})}
      className={className}
      onError={() => setEnEchec(true)}
    />
  );
}
