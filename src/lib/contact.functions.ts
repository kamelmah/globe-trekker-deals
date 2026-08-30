import { createServerFn } from "@tanstack/react-start";

import {
  contactInputSchema,
  newsletterInputSchema,
  saveContactMessage,
  saveNewsletterSubscriber,
} from "@/lib/contact.server";

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data) => contactInputSchema.parse(data))
  .handler(async ({ data }) => saveContactMessage(data));

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data) => newsletterInputSchema.parse(data))
  .handler(async ({ data }) => saveNewsletterSubscriber(data));
