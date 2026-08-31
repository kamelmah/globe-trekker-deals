import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fait apparaître son contenu (fade + léger slide-up) quand il entre dans le
 * viewport, une seule fois. Plus discret que l'entrée du hero : déclenché
 * section par section au fil du scroll, pas tout d'un bloc au chargement.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className={`reveal ${visible ? "reveal-visible" : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}
