import { useServerFn } from "@tanstack/react-start";
import { BellRing } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { subscribeToAlert } from "@/lib/flights.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AlertForm({
  origin,
  destination,
  departDate,
  returnDate,
  referencePrice,
}: {
  origin: string;
  destination: string;
  departDate?: string;
  returnDate?: string;
  referencePrice?: number | null;
}) {
  const subscribe = useServerFn(subscribeToAlert);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email) return;
    setPending(true);
    setFeedback(null);
    try {
      const result = await subscribe({
        data: {
          email,
          origin,
          destination,
          departDate: departDate ?? null,
          returnDate: returnDate ?? null,
          referencePrice: referencePrice ?? null,
        },
      });
      if (result.ok) {
        toast.success(result.message);
        setFeedback({ ok: true, message: result.message });
        setEmail("");
      } else {
        toast.error(result.message);
        setFeedback({ ok: false, message: result.message });
      }
    } catch {
      const message = "L'enregistrement de l'alerte a échoué. Merci de réessayer.";
      toast.error(message);
      setFeedback({ ok: false, message });
    } finally {
      setPending(false);
    }
  }


  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-border bg-card p-5"
      aria-label="Alerte prix par email"
    >
      <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
        <BellRing className="size-4 text-primary" aria-hidden />
        Être alerté si le prix baisse sur ce trajet
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Votre email suffit, aucun compte à créer. Nous vérifions le prix une fois par jour et nous ne
        vous écrivons que s'il baisse. Désinscription en un clic.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor={`alert-email-${origin}-${destination}`}>Votre email</Label>
          <Input
            id={`alert-email-${origin}-${destination}`}
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : "Me prévenir"}
        </Button>
      </div>
    </form>
  );
}
