/**
 * Seed des pages légales dans Sanity (mentions légales, confidentialité, CGV)
 * + uniformisation de l'email de contact sur les singletons existants.
 *
 * Ciblé et idempotent (createOrReplace sur des _id déterministes) : NE touche
 * QUE les documents légaux et l'email — ne réécrit pas le reste du contenu
 * (contrairement à seed-sanity.ts qui réinitialise tout).
 *
 * Lancer :  node_modules/.bin/tsx scripts/seed-legal.ts
 * Requiert dans .env : VITE_SANITY_PROJECT_ID, SANITY_WRITE_TOKEN (rôle Editor).
 */
import { createClient } from '@sanity/client'
import { LEGAL_PAGES } from '../src/lib/content/legal'

// Charge .env dans process.env (Node 22).
try {
  ;(process as unknown as { loadEnvFile: (p: string) => void }).loadEnvFile('.env')
} catch {
  /* déjà chargé via --env-file, ou indisponible */
}

const CONTACT_EMAIL = 'contact@precieuse-joaillerie.com'
const WHATSAPP_URL = 'https://wa.me/33623185887' // vrai numéro FR d'Emeline

const projectId = process.env.VITE_SANITY_PROJECT_ID
const token = process.env.SANITY_WRITE_TOKEN
const dataset = process.env.VITE_SANITY_DATASET || 'production'
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2026-05-01'

if (!projectId || !token) {
  console.error('❌ VITE_SANITY_PROJECT_ID et/ou SANITY_WRITE_TOKEN manquant(s) dans .env')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

async function main() {
  // 1. Pages légales : un document legalPage par slug (contenu FR ; EN/PT à traduire).
  const legalDocs = Object.values(LEGAL_PAGES).map((doc) => ({
    _id: `legal-${doc.slug}`,
    _type: 'legalPage',
    title: { _type: 'localizedString', fr: doc.title },
    slug: { _type: 'slug', current: doc.slug },
    body: { _type: 'localizedPortableText', fr: doc.body },
  }))

  const tx = client.transaction()
  for (const d of legalDocs) tx.createOrReplace(d)
  await tx.commit()
  console.log(`✓ ${legalDocs.length} pages légales seedées : ${legalDocs.map((d) => d._id).join(', ')}`)

  // 2. Uniformise l'email + le WhatsApp sur les singletons existants (best-effort).
  const patches: Array<[string, Record<string, string>]> = [
    ['siteSettings', { email: CONTACT_EMAIL, whatsapp: WHATSAPP_URL }],
    ['footer', { email: CONTACT_EMAIL }],
  ]
  for (const [id, fields] of patches) {
    try {
      await client.patch(id).set(fields).commit()
      console.log(`✓ ${id} mis à jour : ${Object.keys(fields).join(', ')}`)
    } catch {
      console.log(`• ${id} absent ou non modifiable — ignoré (repli code en place)`)
    }
  }
}

main().catch((err) => {
  console.error('❌ Seed légal échoué :', err)
  process.exit(1)
})
