/**
 * Envoi d'emails transactionnels via Resend (API REST, sans SDK).
 *
 * Remplace l'API email de Lovable (`api.lovable.dev`, `LOVABLE_API_KEY`), qui
 * n'existe plus depuis la migration vers Netlify. Deux variables suffisent :
 *
 *   RESEND_API_KEY     clé `re_…` créée sur resend.com
 *   ALERTS_FROM_EMAIL  expéditeur sur le domaine vérifié chez Resend
 *
 * Server-only : ne jamais importer depuis un composant client.
 */

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  /** Nom affiché devant l'adresse d'expédition. */
  fromName?: string;
  /** En-têtes supplémentaires (ex. List-Unsubscribe). */
  headers?: Record<string, string>;
};

export type SendEmailResult =
  { sent: true; id: string | null } | { sent: false; status: number; message: string };

export class EmailNotConfiguredError extends Error {
  constructor(missing: string) {
    super(`Envoi d'email non configuré : ${missing} manquante`);
    this.name = "EmailNotConfiguredError";
  }
}

const API = "https://api.resend.com/emails";
const DEFAULT_FROM_NAME = "TrouveMonVol";

/** Vrai quand la clé et l'expéditeur sont présents dans l'environnement. */
export function isEmailConfigured(): boolean {
  return Boolean(process.env["RESEND_API_KEY"] && process.env["ALERTS_FROM_EMAIL"]);
}

function formatFrom(address: string, name: string): string {
  // Une adresse déjà au format « Nom <adresse> » est laissée telle quelle.
  return address.includes("<") ? address : `${name} <${address}>`;
}

/**
 * Envoie un email. Ne lève que si la configuration est absente ; un refus de
 * l'API est rendu dans le résultat pour que l'appelant décide quoi journaliser.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env["RESEND_API_KEY"];
  const fromAddress = process.env["ALERTS_FROM_EMAIL"];
  if (!apiKey) throw new EmailNotConfiguredError("RESEND_API_KEY");
  if (!fromAddress) throw new EmailNotConfiguredError("ALERTS_FROM_EMAIL");

  const body: Record<string, unknown> = {
    from: formatFrom(fromAddress, input.fromName ?? DEFAULT_FROM_NAME),
    to: Array.isArray(input.to) ? input.to : [input.to],
    subject: input.subject,
    html: input.html,
  };
  if (input.text) body["text"] = input.text;
  if (input.replyTo) body["reply_to"] = input.replyTo;
  if (input.headers && Object.keys(input.headers).length > 0) body["headers"] = input.headers;

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const payload = (await res.json()) as { message?: string; name?: string };
      message = payload.message ?? payload.name ?? message;
    } catch {
      // corps non JSON : on garde le statut HTTP
    }
    return { sent: false, status: res.status, message };
  }

  const payload = (await res.json().catch(() => ({}))) as { id?: string };
  return { sent: true, id: payload.id ?? null };
}
