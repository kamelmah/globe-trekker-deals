import { z } from "zod";

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

export async function saveContactMessage(
  input: ContactInput,
): Promise<{ ok: boolean; message: string }> {
  const db = await admin();
  const { error } = await db.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
  });
  if (error) {
    console.error("Erreur enregistrement message contact", error);
    logOps({
      kind: "contact",
      label: "message",
      ok: false,
      message: error.message,
    });
    return {
      ok: false,
      message: "Votre message n'a pas pu être enregistré. Réessayez dans quelques instants ou écrivez-nous directement à contact@trouvemonvol.fr.",
    };
  }
  logOps({ kind: "contact", label: "message", ok: true, message: `sujet: ${input.subject}` });
  return {
    ok: true,
    message: "Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 48 h ouvrées.",
  };
}

export async function saveNewsletterSubscriber(
  input: NewsletterInput,
): Promise<{ ok: boolean; message: string }> {
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
    return {
      ok: false,
      message: "L'inscription n'a pas pu être enregistrée. Réessayez dans quelques instants.",
    };
  }
  logOps({ kind: "newsletter", label: "inscription", ok: true });
  return {
    ok: true,
    message: "Inscription confirmée ! Vous recevrez nos bons plans vols et nos guides de voyage.",
  };
}
