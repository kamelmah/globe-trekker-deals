import { useEffect, useRef, useState } from "react";

/** Identifiant d'affiliation Stay22 (Let Me Allez). */
export const STAY22_LMA_ID = "6a94b04440e01477bf8d234c";

/**
 * Carte d'hébergement Stay22, pré-configurée sur une ville (et des dates si connues).
 * Le chargement de l'iframe est différé jusqu'à ce que la section entre dans le viewport,
 * afin de ne pas ralentir l'affichage initial de la page.
 */
export function Stay22Map({
  city,
  checkin,
  checkout,
  title,
  description,
  className,
  id = "hebergement",
}: {
  city: string;
  checkin?: string;
  checkout?: string;
  title: string;
  description?: string;
  className?: string;
  id?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  const params = new URLSearchParams({
    aid: STAY22_LMA_ID,
    address: city,
    hidefooter: "true",
  });
  if (checkin) params.set("checkin", checkin);
  if (checkout) params.set("checkout", checkout);
  const src = `https://www.stay22.com/embed/gm?${params.toString()}`;

  return (
    <section ref={containerRef} id={id} className={`scroll-mt-24 ${className ?? ""}`}>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {visible ? (
          <iframe
            src={src}
            title={title}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full border-0 sm:h-[520px]"
          />
        ) : (
          <div className="flex h-[420px] w-full items-center justify-center text-sm text-muted-foreground sm:h-[520px]">
            Chargement de la carte des hébergements…
          </div>
        )}
      </div>
    </section>
  );
}
