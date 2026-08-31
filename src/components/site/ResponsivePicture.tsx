/** Image avec repli WebP → JPG, pour ne servir le format le plus lourd qu'aux navigateurs qui n'ont pas le choix. */
export function ResponsivePicture({
  src,
  webp,
  alt,
  width,
  height,
  className,
  loading,
}: {
  src: string;
  webp: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={src}
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
