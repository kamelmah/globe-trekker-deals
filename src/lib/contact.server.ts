import { z } from "zod";
import { formatDateTimeLong } from "@/lib/dates";

import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import { logOps } from "@/lib/ops-log.server";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Adresse email invalide")
  .max(255, "Email trop long");

export const contactInputSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(100, "Nom trop long"),
  email: emailSchema,
  subject: z.string().trim().min(1, "Sujet requis").max(150, "Sujet trop long"),
  message: z.string().trim().min(10, "Message trop court").max(2000, "Message trop long"),
});

export const newsletterInputSchema = z.object({
  email: emailSchema,
  source: z.string().trim().max(80).optional(),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
export type NewsletterInput = z.infer<typeof newsletterInputSchema>;

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/** Notifie l'équipe par email ; renvoie false si l'email n'a pas pu partir. */
async function notifyContactTeam(input: ContactInput, messageId: string): Promise<boolean> {
  try {
    const result = await sendTemplateEmail("contact-notification", "contact@trouvemonvol.fr", {
      templateData: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        receivedAt: formatDateTimeLong(new Date().toISOString()),
      },
      idempotencyKey: `contact-notification-${messageId}`,
      replyTo: input.email,
    });
    if (!result.sent) {
      logOps({
        kind: "contact",
        label: "email-notification",
        ok: false,
        message: `envoi bloqué: ${result.reason}`,
      });
      return false;
    }
    logOps({ kind: "contact", label: "email-notification", ok: true });
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "erreur inconnue";
    console.error("Erreur envoi email notification contact", error);
    logOps({ kind: "contact", label: "email-notification", ok: false, message });
    return false;
  }
}

const UNAVAILABLE_MESSAGE =
  "Votre message n'a pas pu être enregistré. Réessayez dans quelques instants ou écrivez-nous directement à contact@trouvemonvol.fr.";

export async function saveContactMessage(
  input: ContactInput,
): Promise<{ ok: boolean; message: string }> {
  let insertedId: string | undefined;
  try {
    const db = await admin();
    const { data, error } = await db
      .from("contact_messages")
      .insert({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      })
      .select("id")
      .single();
    if (error) {
      console.error("Erreur enregistrement message contact", error);
      logOps({ kind: "contact", label: "message", ok: false, message: error.message });
      return { ok: false, message: UNAVAILABLE_MESSAGE };
    }
    insertedId = data?.id;
  } catch (error) {
    // Config manquante (ex. Supabase non connecté côté Lovable Cloud) : on ne
    // laisse jamais planter la page, juste un message clair pour l'utilisateur.
    const message = error instanceof Error ? error.message : "erreur inconnue";
    console.error("Base de données indisponible (message de contact)", error);
    logOps({ kind: "contact", label: "message", ok: false, message });
    return { ok: false, message: UNAVAILABLE_MESSAGE };
  }
  logOps({ kind: "contact", label: "message", ok: true, message: `sujet: ${input.subject}` });

  const emailSent = await notifyContactTeam(input, insertedId ?? crypto.randomUUID());
  if (!emailSent) {
    return {
      ok: false,
      message:
        "Votre message a bien été enregistré, mais la notification par email à notre équipe n'a pas pu être envoyée. Pour être sûr d'une réponse rapide, écrivez-nous directement à contact@trouvemonvol.fr.",
    };
  }

  return {
    ok: true,
    message:
      "Votre message a bien été envoyé, nous vous répondrons rapidement (sous 48 h ouvrées).",
  };
}

export async function saveNewsletterSubscriber(
  input: NewsletterInput,
): Promise<{ ok: boolean; message: string }> {
  const failMessage =
    "L'inscription n'a pas pu être enregistrée. Réessayez dans quelques instants.";
  try {
    const db = await admin();
    const { error } = await db.from("newsletter_subscribers").upsert(
      {
        email: input.email,
        source: input.source ?? null,
        active: true,
      },
      { onConflict: "email" },
    );
    if (error) {
      console.error("Erreur inscription newsletter", error);
      logOps({ kind: "newsletter", label: "inscription", ok: false, message: error.message });
      return { ok: false, message: failMessage };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "erreur inconnue";
    console.error("Base de données indisponible (inscription newsletter)", error);
    logOps({ kind: "newsletter", label: "inscription", ok: false, message });
    return { ok: false, message: failMessage };
  }
  logOps({ kind: "newsletter", label: "inscription", ok: true });
  return {
    ok: true,
    message: "Inscription confirmée ! Vous recevrez nos bons plans vols et nos guides de voyage.",
  };
}
