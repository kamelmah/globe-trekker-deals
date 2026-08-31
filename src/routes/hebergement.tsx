import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Stay22Map } from "@/components/stay/Stay22Map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Trouver un hébergement — hôtels et locations sur une carte | TrouveMonVol";
const DESCRIPTION =
  "Cherchez un hôtel, un appartement ou une auberge dans la ville de votre choix, affichés sur une carte interactive avec leurs prix, même sans avoir encore réservé de vol.";

export const Route = createFileRoute("/hebergement")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/hebergement` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/hebergement` }],
  }),
  component: HebergementPage,
});

function HebergementPage() {
  const [input, setInput] = useState("Paris");
  const [city, setCity] = useState("Paris");

  return (
    <div className="container-page py-10">
      <h1 className="font-display leading-tight">
        Votre hôtel, avant même d'avoir choisi votre vol
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
        Comparez les prix réels sur la carte, sans attendre d'avoir votre billet en poche : hôtels,
        appartements et auberges, avec leurs tarifs issus directement des plateformes de réservation.
      </p>

      <form
        className="mt-6 flex max-w-md flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const value = input.trim();
          if (value) setCity(value);
        }}
      >
        <label htmlFor="ville-hebergement" className="sr-only">
          Ville ou destination
        </label>
        <Input
          id="ville-hebergement"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ex. Marrakech, Lisbonne, Bangkok…"
          className="flex-1"
        />
        <Button type="submit">Afficher la carte</Button>
      </form>

      <Stay22Map
        className="mt-10"
        city={city}
        title={`Hébergements à ${city}`}
        description="Carte interactive des hôtels et locations, via notre partenaire Stay22. Les prix affichés proviennent des plateformes de réservation."
      />
    </div>
  );
}
