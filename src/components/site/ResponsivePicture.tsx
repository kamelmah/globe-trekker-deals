/**
 * Image avec repli WebP → JPG, pour ne servir le format le plus lourd qu'aux
 * navigateurs qui n'ont pas le choix. `srcSet`/`webpSrcSet`/`sizes` sont
 * optionnels : à fournir pour qu'un mobile ne télécharge pas l'image pleine
 * résolution destinée au grand écran (cas du hero, affiché en 100vw).
 */
export function ResponsivePicture({
  src,
  webp,
  alt,
  width,
  height,
  className,
  loading,
  srcSet,
  webpSrcSet,
  sizes,
}: {
  src: string;
  webp: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
  srcSet?: string;
  webpSrcSet?: string;
  sizes?: string;
}) {
  return (
    <picture>
      <source srcSet={webpSrcSet ?? webp} sizes={sizes} type="image/webp" />
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        {...(loading ? { loading } : {})}
        className={className}
      />
    </picture>
  );
}
