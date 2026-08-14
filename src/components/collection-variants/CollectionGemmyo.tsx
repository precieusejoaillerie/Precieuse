import { Link } from '@tanstack/react-router'
import { m } from '#/paraglide/messages'
import { PRODUCTS } from '../../lib/content/products'
import type { Product } from '../../lib/content/products'
import { objectPositionStyle } from '../framing/framing'
import { CollectionIntro } from './collection-intro'

/**
 * Variante E — Damier « porté + packshot » (système façon Gemmyo).
 * Chaque bague = deux cellules côte à côte : une photo PORTÉE plein cadre et,
 * en regard, une cellule claire centrée avec nom (large tracking), tagline,
 * PACKSHOT de la bague et bouton « Découvrir ». L'alternance gauche/droite
 * se fait à chaque rangée. Charte Précieuse conservée (poudre/canard).
 */

// Les images de la grille (photo portée + packshot détouré) sont désormais
// pilotées par Sanity via `getProducts` (champs `photoPortee` / `packshot`), avec
// repli sur les chemins statiques de `products.ts`. Plus de map codée en dur ici.

function WornCell({
  product,
  reversed,
  eager,
}: {
  product: Product
  reversed: boolean
  eager?: boolean
}) {
  const worn = product.photoPortee ?? '/images/placeholder-piece.svg'
  return (
    <div className={`relative min-h-[46vh] overflow-hidden bg-canard-10 ${reversed ? 'lg:order-2' : ''}`}>
      <img
        src={worn}
        alt={product.photoPorteeAlt ?? product.imageAlt}
        style={objectPositionStyle(product.photoPorteePosition)}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}

function InfoCell({ product, reversed }: { product: Product; reversed: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-poudre px-8 py-8 text-center lg:px-14 ${reversed ? 'lg:order-1' : ''}`}>
      <h2 className="font-display text-[clamp(32px,3.2vw,48px)] text-canard leading-[1.05]">
        {product.name}
      </h2>
      <p className="mt-4 font-body italic font-light text-[clamp(17px,1.6vw,21px)] text-canard/75">
        {product.tagline}
      </p>
      <p className="mt-6 max-w-[46ch] font-body font-light text-[15px] md:text-[14px] leading-relaxed text-canard/60">
        {product.description}
      </p>

      {/* Packshot détouré — optionnel : masqué si la pièce n'en a pas (ex. une
          pièce dessinée dont le croquis tient déjà le grand visuel). */}
      {product.packshot ? (
        <div className="my-4 flex h-[130px] w-full items-center justify-center lg:my-5 lg:h-[160px]">
          <img
            src={product.packshot}
            alt={product.packshotAlt ?? `${product.name} — ${product.tagline}`}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-[190px] object-contain"
          />
        </div>
      ) : (
        <div className="my-5" aria-hidden="true" />
      )}

      <Link
        to="/collection/$slug"
        params={{ slug: product.slug }}
        className="bg-canard px-10 py-3.5 font-display text-[11px] uppercase tracking-[0.28em] text-poudre transition-colors duration-300 hover:bg-canard-90"
      >
        {m.series_discover()}
      </Link>
    </div>
  )
}

export function CollectionGemmyo({
  products = PRODUCTS,
  title,
}: {
  products?: Product[]
  title?: string
}) {
  return (
    <section className="bg-poudre">
      <CollectionIntro products={products} title={title} />

      {products.map((product, i) => {
        // On affiche la rangée dès qu'il y a un visuel « porté » OU un packshot.
        // Sans aucun des deux → on saute (évite une cellule vide).
        if (!product.packshot && !product.photoPortee) return null
        const reversed = i % 2 === 1
        return (
          <div
            key={product.slug}
            id={`piece-${product.slug}`}
            className="grid scroll-mt-20 grid-cols-1 lg:min-h-[46vh] lg:grid-cols-2"
          >
            <WornCell product={product} reversed={reversed} eager={i === 0} />
            <InfoCell product={product} reversed={reversed} />
          </div>
        )
      })}
    </section>
  )
}
