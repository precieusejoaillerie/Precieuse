/**
 * Génère un jeu de favicons de marque à partir de public/picto.png (la fleur
 * Précieuse, canard sur fond transparent).
 *
 * Sorties (public/) :
 *   favicon-16.png, favicon-32.png, favicon-48.png  → transparents (onglet)
 *   favicon.ico                                     → 16/32/48 empaquetés
 *   apple-touch-icon.png (180)                      → fond ivoire opaque, marge
 *   icon-192.png, icon-512.png                      → PWA, fond ivoire opaque
 *
 * Outils : jimp + png-to-ico (devDeps temporaires, retirées après génération).
 * Lancer : node_modules/.bin/tsx scripts/gen-favicons.mjs   (ou `node`)
 */
import Jimp from 'jimp'
import pngToIco from 'png-to-ico'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const PUBLIC = join(process.cwd(), 'public')
const IVOIRE = 0xf4ece4ff // fond opaque premium, lisible en onglet clair ET sombre

const src = await Jimp.read(join(PUBLIC, 'picto.png'))

/** Icône transparente à la taille voulue (fleur seule). */
async function transparent(size) {
  const img = src.clone().resize(size, size)
  return img.getBufferAsync(Jimp.MIME_PNG)
}

/** Icône sur fond ivoire opaque, fleur centrée avec marge (~14 %). */
async function onIvoire(size) {
  const bg = new Jimp(size, size, IVOIRE)
  const inner = Math.round(size * 0.72)
  const flower = src.clone().resize(inner, inner)
  const offset = Math.round((size - inner) / 2)
  bg.composite(flower, offset, offset)
  return bg.getBufferAsync(Jimp.MIME_PNG)
}

const p16 = await transparent(16)
const p32 = await transparent(32)
const p48 = await transparent(48)
writeFileSync(join(PUBLIC, 'favicon-16.png'), p16)
writeFileSync(join(PUBLIC, 'favicon-32.png'), p32)
writeFileSync(join(PUBLIC, 'favicon-48.png'), p48)

writeFileSync(join(PUBLIC, 'apple-touch-icon.png'), await onIvoire(180))
writeFileSync(join(PUBLIC, 'icon-192.png'), await onIvoire(192))
writeFileSync(join(PUBLIC, 'icon-512.png'), await onIvoire(512))

const ico = await pngToIco([p16, p32, p48])
writeFileSync(join(PUBLIC, 'favicon.ico'), ico)

console.log('✅ favicons générés dans public/ (16/32/48, .ico, apple-touch 180, 192, 512)')
