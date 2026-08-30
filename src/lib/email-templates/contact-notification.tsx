import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  subject?: string
  message?: string
  receivedAt?: string
}

const Email = ({ name, email, subject, message, receivedAt }: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>{`Nouveau message de ${name || 'un visiteur'} : ${subject || 'sans sujet'}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>TrouveMonVol</Text>
        <Heading style={heading}>Nouveau message du formulaire de contact</Heading>

        <Section style={card}>
          <Text style={row}>
            <span style={label}>Nom : </span>
            {name || 'Non renseigné'}
          </Text>
          <Text style={row}>
            <span style={label}>Email : </span>
            {email ? <Link href={`mailto:${email}`} style={link}>{email}</Link> : 'Non renseigné'}
          </Text>
          <Text style={row}>
            <span style={label}>Sujet : </span>
            {subject || 'Sans sujet'}
          </Text>
          {receivedAt && (
            <Text style={row}>
              <span style={label}>Reçu le : </span>
              {receivedAt}
            </Text>
          )}
        </Section>

        <Heading as="h2" style={subheading}>
          Message
        </Heading>
        <Text style={messageStyle}>{message || 'Message vide'}</Text>

        <Hr style={hr} />
        <Text style={footer}>
          Répondez directement à cet email pour contacter l&apos;expéditeur.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    `Contact TrouveMonVol : ${data?.['subject'] || 'nouveau message'}`,
  displayName: 'Notification de message de contact',
  to: 'contact@trouvemonvol.fr',
  previewData: {
    name: 'Camille Dupont',
    email: 'camille.dupont@exemple.fr',
    subject: 'Question sur un prix affiché',
    message:
      "Bonjour, j'ai vu un vol Paris–Marrakech à 89 € mais le prix a changé au moment de réserver. Pouvez-vous m'aider ?",
    receivedAt: '31 août 2026 à 01:45',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '600px' }
const brand = { fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#0f766e', margin: '0 0 8px' }
const heading = { fontSize: '22px', lineHeight: '30px', color: '#0f172a', margin: '0 0 18px' }
const subheading = { fontSize: '15px', color: '#0f172a', margin: '22px 0 8px' }
const card = {
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '14px 18px',
  backgroundColor: '#f8fafc',
}
const row = { fontSize: '14px', lineHeight: '22px', color: '#334155', margin: '4px 0' }
const label = { color: '#0f172a', fontWeight: 700 }
const link = { color: '#0f766e' }
const messageStyle = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#1e293b',
  whiteSpace: 'pre-wrap' as const,
  margin: '0',
}
const hr = { borderColor: '#e2e8f0', margin: '26px 0 14px' }
const footer = { fontSize: '12px', lineHeight: '18px', color: '#64748b', margin: '0' }
