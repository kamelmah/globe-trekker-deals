export type FaqItem = { question: string; answer: string };

/**
 * Questions fréquentes, en `<details>`/`<summary>` natifs.
 *
 * POURQUOI PAS UN ACCORDÉON RADIX. Le composant précédent ne montait le
 * contenu d'un panneau qu'à son ouverture : sur le HTML servi, les questions
 * étaient là et AUCUNE réponse ne l'était. Une section « Questions fréquentes »
 * dont les réponses n'existent que dans le navigateur ne répond à personne — ni
 * au robot qui lit la page, ni au lecteur sans JavaScript, ni à la recherche
 * dans la page (Ctrl+F ne trouve pas ce qui n'est pas monté).
 *
 * `<details>` n'a aucun de ces défauts : le contenu est dans le document,
 * simplement replié. Le pliage, le clavier, le rôle ARIA et l'ouverture par
 * Ctrl+F sont assurés par le navigateur — sans une ligne de JavaScript.
 *
 * Les réponses restent donc identiques, au caractère près, à ce que balise le
 * bloc JSON-LD FAQPage de la page : les deux lisent le même tableau.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
      {items.map((item) => (
        <details key={item.question} className="group px-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold hover:underline [&::-webkit-details-marker]:hidden">
            {item.question}
            {/*
              Chevron dessiné ici plutôt qu'importé : le marqueur natif est
              masqué (il ne se stylise pas d'un navigateur à l'autre), et
              `group-open` le fait pivoter sans JavaScript.
            */}
            <svg
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
