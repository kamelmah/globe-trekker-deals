import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Mail, MailCheck, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage, subscribeNewsletter } from "@/lib/contact.functions";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Contact et newsletter | TrouveMonVol";
const DESCRIPTION =
  "Contactez l'équipe TrouveMonVol à contact@trouvemonvol.fr et inscrivez-vous à la newsletter pour recevoir nos bons plans vols et guides de voyage.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: TITLE,
          url: `${SITE_URL}/contact`,
          description: DESCRIPTION,
          mainEntity: {
            "@type": "Organization",
            name: "TrouveMonVol",
            url: SITE_URL,
            email: "contact@trouvemonvol.fr",
          },
        }),
      },
    ],
  }),
  component: ContactPage,
});

type Feedback = { ok: boolean; message: string } | null;

function ContactPage() {
  const submit = useServerFn(submitContactMessage);
  const subscribe = useServerFn(subscribeNewsletter);

  const [contactFeedback, setContactFeedback] = useState<Feedback>(null);
  const [contactPending, setContactPending] = useState(false);
  const [newsletterFeedback, setNewsletterFeedback] = useState<Feedback>(null);
  const [newsletterPending, setNewsletterPending] = useState(false);

  async function onContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setContactPending(true);
    setContactFeedback(null);
    try {
      const result = await submit({
        data: {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          subject: String(data.get("subject") ?? ""),
          message: String(data.get("message") ?? ""),
        },
      });
      setContactFeedback(result);
      if (result.ok) form.reset();
    } catch (error) {
      setContactFeedback({
        ok: false,
        message:
          error instanceof Error && error.message
            ? error.message
            : "Une erreur est survenue. Réessayez dans quelques instants.",
      });
    } finally {
      setContactPending(false);
    }
  }

  async function onNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setNewsletterPending(true);
    setNewsletterFeedback(null);
    try {
      const result = await subscribe({
        data: { email: String(data.get("newsletter-email") ?? ""), source: "page-contact" },
      });
      setNewsletterFeedback(result);
      if (result.ok) form.reset();
    } catch (error) {
      setNewsletterFeedback({
        ok: false,
        message:
          error instanceof Error && error.message
            ? error.message
            : "Une erreur est survenue. Réessayez dans quelques instants.",
      });
    } finally {
      setNewsletterPending(false);
    }
  }

  return (
    <main className="container-page max-w-3xl py-12">
      <h1 className="font-display">Contact & newsletter</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Une question sur un prix affiché, un bug à signaler ou une suggestion ? Écrivez-nous à{" "}
        <a href="mailto:contact@trouvemonvol.fr" className="font-medium text-primary underline-offset-4 hover:underline">
          contact@trouvemonvol.fr
        </a>{" "}
        ou via le formulaire ci-dessous. Nous répondons sous 48 h ouvrées.
      </p>

      <section aria-labelledby="contact-form-title" className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 id="contact-form-title" className="flex items-center gap-2 text-xl font-semibold">
          <Mail className="size-5 text-primary" aria-hidden />
          Nous écrire
        </h2>
        <form onSubmit={onContactSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" name="name" required maxLength={100} autoComplete="name" placeholder="Votre nom" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                maxLength={255}
                autoComplete="email"
                placeholder="vous@exemple.fr"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="subject">Sujet</Label>
            <Input id="subject" name="subject" required maxLength={150} placeholder="Objet de votre message" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              placeholder="Décrivez votre question ou votre suggestion…"
            />
          </div>
          {contactFeedback && (
            <p
              role="status"
              className={`rounded-lg border px-4 py-3 text-sm ${
                contactFeedback.ok
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-destructive/40 bg-destructive/10 text-destructive"
              }`}
            >
              {contactFeedback.message}
            </p>
          )}
          <Button type="submit" disabled={contactPending} className="gap-1.5 sm:w-fit">
            {contactPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
            Envoyer le message
          </Button>
        </form>
      </section>

      <section aria-labelledby="newsletter-title" className="mt-8 rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
        <h2 id="newsletter-title" className="flex items-center gap-2 text-xl font-semibold">
          <MailCheck className="size-5 text-primary" aria-hidden />
          Recevoir nos bons plans
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Une fois par semaine maximum : nos nouveaux guides de destination, les baisses de prix marquantes
          que nous observons et nos conseils pour payer vos vols moins cher. Désinscription en un clic à tout
          moment, jamais de revente de votre adresse.
        </p>
        <form onSubmit={onNewsletterSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            id="newsletter-email"
            name="newsletter-email"
            type="email"
            required
            maxLength={255}
            autoComplete="email"
            placeholder="votre@email.fr"
            aria-label="Votre adresse email"
            className="sm:max-w-xs"
          />
          <Button type="submit" variant="outline" disabled={newsletterPending} className="gap-1.5">
            {newsletterPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <CheckCircle2 className="size-4" aria-hidden />
            )}
            S'inscrire à la newsletter
          </Button>
        </form>
        {newsletterFeedback && (
          <p
            role="status"
            className={`mt-3 rounded-lg border px-4 py-3 text-sm ${
              newsletterFeedback.ok
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {newsletterFeedback.message}
          </p>
        )}
      </section>
    </main>
  );
}
