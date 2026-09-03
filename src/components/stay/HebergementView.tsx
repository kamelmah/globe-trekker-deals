import { Link } from "@tanstack/react-router";
import { BedDouble, Map as MapIcon, Plane, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { PriceDatePicker } from "@/components/search/DepartureDatePicker";
import { FondAnime } from "@/components/site/FondAnime";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { LienHotelsCom } from "@/components/stay/LienHotelsCom";
import { Stay22Map } from "@/components/stay/Stay22Map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cityLabel } from "@/data/airports";
import { useCurrency } from "@/lib/currency-context";
import { formatDateLong, formatDateRangeShort } from "@/lib/dates";
import { getDestinationImage } from "@/lib/destination-images";
import { FEATURED_HOTEL_CITIES, type HebergementSearch, type VilleHotel } from "@/lib/hotel-cities";
import { readLastFlightSearch, todayPlus, type DerniereRecherche } from "@/lib/search-params";

/** Ancre de la carte : elle est aussi la cible de l'onglet « Hôtels ». */
const ANCRE_CARTE = "hebergement";

const ETAPES = [
  {
    Icone: MapIcon,
    titre: "Le prix sur la carte est le prix chez le vendeur",
    texte:
      "Nous n'ajoutons aucun frais et ne modifions aucun tarif : ce que la carte affiche pour une nuit est ce que la plateforme de réservation demande.",
  },
  {
    Icone: Plane,
    titre: "Vos dates de vol sont reprises",
    texte:
      "Depuis une page de vol ou une recherche, les dates du séjour arrivent déjà remplies. Vous pouvez les changer ici sans repasser par la recherche de vol.",
  },
  {
    Icone: BedDouble,
    titre: "Réservation chez le partenaire",
    texte:
      "Vous réservez directement sur le site de la plateforme, jamais chez nous. TrouveMonVol touche une commission qui ne change pas votre prix.",
  },
];

function afficherCarteEtDefiler() {
  const cible = document.getElementById(ANCRE_CARTE);
  cible?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HebergementView({
  search,
  villeFixee = null,
  prixVols,
}: {
  search: HebergementSearch;
  /** Ville imposée par l'URL /hebergement/<ville>, sinon null. */
  villeFixee?: VilleHotel | null;
  /** Plancher déjà relevé par code IATA, pour les tuiles. Jamais estimé. */
  prixVols: Record<string, number>;
}) {
  const { format } = useCurrency();
  const villeInitiale = villeFixee?.ville || search.ville || "Paris";

  const [ville, setVille] = useState(villeInitiale);
  const [arrivee, setArrivee] = useState(search.arrivee ?? "");
  const [depart, setDepart] = useState(search.depart ?? "");
  const [voyageurs, setVoyageurs] = useState(search.voyageurs ?? 1);

  /** Ce que la carte montre réellement : mis à jour à la soumission, pas à la frappe. */
  const [carte, setCarte] = useState({
    ville: villeInitiale,
    arrivee: search.arrivee ?? "",
    depart: search.depart ?? "",
  });

  /**
   * Dernière recherche de vol, lue APRÈS le montage.
   *
   * Le localStorage n'existe pas au rendu serveur : le lire pendant le rendu
   * ferait diverger le HTML envoyé et celui reconstruit par React. On rend donc
   * la page sans l'encart, puis on l'ajoute si le navigateur a quelque chose.
   */
  const [derniere, setDerniere] = useState<DerniereRecherche | null>(null);
  useEffect(() => setDerniere(readLastFlightSearch()), []);

  const villeDerniere = derniere ? cityLabel(derniere.destination) : "";
  // `cityLabel` renvoie le code brut quand la ville est inconnue : chercher des
  // hôtels à « ORN » n'aurait aucun sens, l'encart disparaît alors.
  const derniereUtilisable = Boolean(derniere && villeDerniere !== derniere.destination);

  function appliquer(next: { ville: string; arrivee: string; depart: string }) {
    setCarte(next);
    // Le défilement attend la peinture : la carte peut n'exister qu'après le
    // changement d'état (première ouverture d'une ville).
    requestAnimationFrame(afficherCarteEtDefiler);
  }

  function reprendreDerniereRecherche() {
    if (!derniere || !derniereUtilisable) return;
    setVille(villeDerniere);
    setArrivee(derniere.depart);
    setDepart(derniere.retour);
    setVoyageurs(derniere.adultes);
    appliquer({ ville: villeDerniere, arrivee: derniere.depart, depart: derniere.retour });
  }

  const datesCompletes = Boolean(carte.arrivee && carte.depart);
  const titreDates = datesCompletes
    ? ` · du ${formatDateLong(carte.arrivee)} au ${formatDateLong(carte.depart)}`
    : "";

  return (
    <div>
      {/* Skyline de nuit plutôt que l'avion de l'accueil : ici on cherche une
          ville où dormir, pas un vol. */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <FondAnime variante="hotels" />

        {/*
          `pb-40 sm:pb-10` : sur une colonne, le formulaire opaque descend
          jusqu'au bas du héros et masquait toute la skyline. Cette bande lui
          rend une ligne d'horizon visible sous la carte.
        */}
        <div className="container-page grid gap-8 py-10 pb-40 sm:pb-10 lg:grid-cols-2 lg:items-start lg:py-14">
          <div>
            <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
              <Link to="/" className="hover:text-foreground">
                Accueil
              </Link>{" "}
              /{" "}
              {villeFixee ? (
                <>
                  <Link to="/hebergement" className="hover:text-foreground">
                    Hébergement
                  </Link>{" "}
                  / {villeFixee.ville}
                </>
              ) : (
                "Hébergement"
              )}
            </nav>

            <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <BedDouble className="size-4" aria-hidden />
              Hébergement
            </p>
            {/* Un H1 par page, et un seul : sur une page de ville il la nomme,
                sinon Google verrait le même titre sur toutes. */}
            <h1 className="mt-3 font-display leading-tight">
              {villeFixee
                ? `Votre hôtel à ${villeFixee.ville}, au prix affiché.`
                : "Votre hôtel, au prix affiché, dans la ville de votre vol."}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Une fois le vol trouvé, comparez hôtels et appartements sur la carte : prix par nuit
              tel qu'il apparaît chez nos partenaires de réservation, et réservation directement
              chez eux.
            </p>

            {derniere && derniereUtilisable && (
              <div className="mt-6 rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Votre dernière recherche de vol
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {cityLabel(derniere.origin)} → {villeDerniere}
                  {derniere.depart && (
                    <> · {formatDateRangeShort(derniere.depart, derniere.retour)}</>
                  )}{" "}
                  · {derniere.adultes} adulte{derniere.adultes > 1 ? "s" : ""}
                </p>
                <button
                  type="button"
                  onClick={reprendreDerniereRecherche}
                  className="mt-2 text-sm font-medium text-primary underline-offset-2 hover:underline"
                >
                  Voir les hôtels à {villeDerniere} →
                </button>
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const nom = ville.trim();
              if (!nom) return;
              appliquer({ ville: nom, arrivee, depart });
            }}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 [&_input]:h-11"
            aria-label="Recherche d'hébergement"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                {/*
                  Champ texte libre, et non l'autocomplétion des vols : celle-ci
                  ne renvoie que des codes IATA d'aéroports. Un hôtel se cherche
                  par nom de ville ou de quartier — « Alger Centre » n'a pas de
                  code IATA.
                */}
                <Label htmlFor="ville">Ville ou quartier</Label>
                <Input
                  id="ville"
                  value={ville}
                  onChange={(event) => setVille(event.target.value)}
                  placeholder="Ex. Oran, Lisbonne, Marrakech…"
                  autoComplete="off"
                />
              </div>

              <PriceDatePicker
                id="arrivee"
                label="Arrivée"
                value={arrivee}
                onChange={(date) => {
                  setArrivee(date);
                  // Un départ antérieur à l'arrivée n'est pas un séjour.
                  if (depart && depart <= date) setDepart("");
                }}
                origin=""
                destination=""
                tripDuration={0}
                minDate={todayPlus(0)}
                hint="Choisissez la nuit d'arrivée à l'hôtel."
              />
              <PriceDatePicker
                id="depart"
                label="Départ"
                value={depart}
                onChange={setDepart}
                origin=""
                destination=""
                tripDuration={0}
                minDate={arrivee || todayPlus(1)}
                hint="Choisissez le jour où vous libérez la chambre."
              />

              {/*
                Pas de champ « budget par nuit » : ni la carte ni la recherche
                du partenaire n'acceptent de plafond de prix que nous puissions
                leur transmettre. Un champ qui ne filtre rien promet un tri qui
                n'existe pas.
              */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="voyageurs">Voyageurs</Label>
                <Input
                  id="voyageurs"
                  type="number"
                  min={1}
                  max={9}
                  inputMode="numeric"
                  className="sm:max-w-40"
                  value={voyageurs}
                  onChange={(event) =>
                    setVoyageurs(Math.min(9, Math.max(1, Number(event.target.value) || 1)))
                  }
                />
              </div>
            </div>

            {/* Action principale : la recherche complète chez le partenaire, avec
                la ville, les dates et le nombre de voyageurs saisis ici. */}
            <LienHotelsCom
              className="mt-5"
              ville={ville.trim() || villeInitiale}
              sid="hebergement"
              arrivee={arrivee}
              depart={depart}
              voyageurs={voyageurs}
              libelle="Voir les hôtels sur Hotels.com"
              size="lg"
              mention
            />

            <Button type="submit" variant="outline" className="mt-3 h-11 w-full gap-2">
              <Search className="size-4" aria-hidden />
              Explorer sur la carte
            </Button>

            <p className="mt-3 text-xs text-muted-foreground">
              Aucun frais ajouté par TrouveMonVol · vous réservez chez le vendeur.
            </p>
          </form>
        </div>
      </section>

      <div className="container-page py-10">
        {/*
          Une seule colonne aujourd'hui. La colonne de résultats à droite de la
          carte (liste triable des hébergements) viendra ici, en `lg:grid-cols-
          [1fr_360px]` : la carte n'a alors pas besoin de bouger.
        */}
        <div className="grid gap-6">
          <Stay22Map
            id={ANCRE_CARTE}
            city={carte.ville}
            {...(carte.arrivee ? { checkin: carte.arrivee } : {})}
            {...(carte.depart ? { checkout: carte.depart } : {})}
            hauteur="h-[360px] sm:h-[520px]"
            title={`Hôtels à ${carte.ville}${titreDates}`}
            description="Prix par nuit affichés par nos partenaires de réservation."
          />
        </div>
      </div>

      <section className="border-y border-border py-12">
        <div className="container-page">
          <h2 className="font-display">Hôtels dans les villes que vous cherchez le plus</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Nos destinations les plus demandées. Le prix indiqué est celui du vol, quand un relevé
            existe au départ de Paris — jamais celui de la chambre, que seul le partenaire affiche.
          </p>

          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {FEATURED_HOTEL_CITIES.map((item) => {
              const image = getDestinationImage(item.code, item.ville);
              const prix = prixVols[item.code];
              return (
                <li
                  key={item.code}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
                >
                  <Link
                    to="/hebergement/$ville"
                    params={{ ville: item.slug }}
                    className="transition-colors hover:bg-secondary"
                  >
                    <ResponsivePicture
                      src={image.thumb}
                      webp={image.thumbWebp}
                      alt={image.alt}
                      loading="lazy"
                      width={256}
                      height={192}
                      className="h-24 w-full object-cover sm:h-32"
                    />
                    <span className="block p-3 sm:p-4">
                      <span className="block text-sm font-semibold">Hôtels à {item.ville}</span>
                      {prix !== undefined && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          vols dès {format(prix)}
                        </span>
                      )}
                    </span>
                  </Link>
                  <div className="mt-auto flex flex-col gap-2 p-3 pt-0 sm:flex-row sm:p-4 sm:pt-0">
                    <LienHotelsCom
                      ville={item.ville}
                      sid={`hebergement-${item.slug}`}
                      libelle="Sur Hotels.com"
                      variant="secondary"
                      size="sm"
                      className="sm:flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="sm:flex-1"
                      onClick={() => {
                        setVille(item.ville);
                        appliquer({ ville: item.ville, arrivee, depart });
                      }}
                    >
                      Carte
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-card py-12">
        <div className="container-page">
          <h2 className="font-display">Comment ça marche</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {ETAPES.map(({ Icone, titre, texte }) => (
              <li key={titre} className="rounded-xl border border-border bg-background p-5">
                <Icone className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-base font-semibold">{titre}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
