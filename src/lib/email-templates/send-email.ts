import * as React from "react";
import { render } from "@react-email/render";
import { sendEmail } from "@/lib/resend.server";
import { TEMPLATES } from "./registry";

// Server-only: reads RESEND_API_KEY / ALERTS_FROM_EMAIL. Never import from client components.

export type SendTemplateEmailResult = { sent: true } | { sent: false; reason: string };

export interface SendTemplateEmailOptions {
  templateData?: Record<string, unknown>;
  /** Conservé pour compatibilité ; Resend ne déduplique pas côté API REST. */
  idempotencyKey?: string;
  replyTo?: string;
}

/**
 * Rend un template enregistré et l'envoie via Resend. Un refus de l'API est
 * rendu dans le résultat ({ sent: false, reason }) ; une configuration absente
 * lève une erreur, comme avant.
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {},
): Promise<SendTemplateEmailResult> {
  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(
      `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(", ")}`,
    );
  }

  // Template-level `to` takes precedence — notification templates always
  // send to their fixed address.
  const recipient = template.to || to;
  if (!recipient) {
    throw new Error("Recipient is required (the template defines no fixed recipient)");
  }

  const templateData = options.templateData ?? {};
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function" ? template.subject(templateData) : template.subject;

  const result = await sendEmail({
    to: recipient,
    subject,
    html,
    text,
    ...(options.replyTo ? { replyTo: options.replyTo } : {}),
  });
  if (!result.sent) {
    return { sent: false, reason: `${result.status} ${result.message}` };
  }

  return { sent: true };
}
