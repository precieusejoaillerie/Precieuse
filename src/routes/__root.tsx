import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import ConvexProvider from '../integrations/convex/provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { getLocale } from '#/paraglide/runtime'
import { m } from '#/paraglide/messages'
import { getSite, getFooter, getContact } from '../lib/cms'
import { SITE } from '../lib/content/site'
import { SITE_URL } from '../lib/site-url'
import { footerFallback } from '../lib/content/footer'
import { contactFallback } from '../lib/content/contact'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { SplashScreen } from '../components/SplashScreen'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { BrandProvider } from '../components/brand/BrandProvider'
import { BrandToggle } from '../components/brand/BrandToggle'
import { BRAND_NO_FLASH_SCRIPT } from '../components/brand/no-flash-script'
import { ContactDrawerProvider } from '../components/contact/ContactDrawerProvider'
import { ContactDrawer } from '../components/contact/ContactDrawer'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // Other redirect strategies are possible; see
    // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  // Réglages globaux pilotés par Emeline dans Sanity (numéro WhatsApp, footer…),
  // avec repli sur les constantes/Paraglide si Sanity n'est pas configuré.
  loader: async ({ location }) => {
    // Le Studio (/studio) masque le chrome du site : inutile d'interroger Sanity
    // pour les réglages globaux. On renvoie les replis typés (aucun appel réseau)
    // → évite 3 requêtes GROQ superflues à chaque ouverture du Studio.
    if (location.pathname === '/studio' || location.pathname.startsWith('/studio/')) {
      return { site: SITE, footer: footerFallback(), contact: contactFallback() }
    }
    const locale = getLocale()
    const [site, footer, contact] = await Promise.all([
      getSite(locale),
      getFooter(locale),
      getContact(locale),
    ])
    return { site, footer, contact }
  },

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Précieuse, Joaillerie artisanale, Bordeaux' },
      // Valeurs SEO par défaut ; chaque route les écrase via seo() (src/lib/seo.ts).
      { name: 'description', content: m.seo_default_desc() },
      { name: 'theme-color', content: '#125e5e' },
      { property: 'og:site_name', content: 'Précieuse' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${SITE_URL}/picto.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      // Fonts Google en <link> direct (plus d'@import dans styles.css) : le
      // preconnect ouvre les connexions pendant que le HTML se parse.
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Spectral:wght@500;600&family=Ysabeau+Office:ital,wght@0,200;0,300;1,300&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

/** Page 404 — sur la charte (poudre/canard, accent framboise), avec retour. */
function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-poudre px-8 py-24 text-center">
      <p className="font-display text-[12px] uppercase tracking-[0.35em] text-framboise">
        {m.notfound_eyebrow()}
      </p>
      <h1 className="mt-4 font-headline text-[clamp(30px,7vw,52px)] leading-[1.05] text-canard [text-wrap:balance]">
        {m.notfound_title()}
      </h1>
      <p className="mx-auto mt-4 max-w-[44ch] font-body text-[16px] font-light leading-relaxed text-canard/80 [text-wrap:pretty]">
        {m.notfound_body()}
      </p>
      <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          to="/"
          className="inline-block bg-canard px-8 py-3.5 font-display text-[12px] uppercase tracking-[0.25em] text-poudre transition-colors duration-300 hover:bg-canard-90"
        >
          {m.notfound_cta_home()}
        </Link>
        <Link
          to="/collection"
          className="inline-block border border-canard/40 px-8 py-3.5 font-display text-[12px] uppercase tracking-[0.25em] text-canard transition-colors duration-300 hover:bg-canard hover:text-poudre"
        >
          {m.notfound_cta_collection()}
        </Link>
      </div>
    </section>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { site, footer, contact } = Route.useLoaderData()
  // Le Studio Sanity (/studio) est plein écran : on masque le chrome du site.
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isStudio = pathname === '/studio' || pathname.startsWith('/studio/')
  return (
    <html
      suppressHydrationWarning
      lang={getLocale()}
      data-brand="canard"
      data-hero-mark="logo"
      data-seal="rond"
      data-filigrane="losange"
      data-carousel="glisse"
    >
      <head>
        {/* No-flash : pose data-brand depuis localStorage avant le paint. */}
        <script dangerouslySetInnerHTML={{ __html: BRAND_NO_FLASH_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {isStudio ? (
          // Studio Sanity : plein écran, sans nav/footer/splash du site.
          children
        ) : (
          <>
            <SplashScreen tagline={site.baseline} />
            <ConvexProvider>
              <BrandProvider>
                <ContactDrawerProvider>
                  <Nav />
                  <main className="pt-16 min-h-screen">{children}</main>
                  <Footer footer={footer} />
                  <WhatsAppButton href={site.whatsapp} label={site.whatsappLabel} />
                  <ContactDrawer site={site} contact={contact} />
                  {/* Sélecteur de design réservé au dev : jamais exposé en prod. */}
                  {import.meta.env.DEV && <BrandToggle />}
                  <TanStackDevtools
                    config={{
                      position: 'bottom-right',
                    }}
                    plugins={[
                      {
                        name: 'Tanstack Router',
                        render: <TanStackRouterDevtoolsPanel />,
                      },
                      TanStackQueryDevtools,
                    ]}
                  />
                </ContactDrawerProvider>
              </BrandProvider>
            </ConvexProvider>
          </>
        )}
        <Scripts />
      </body>
    </html>
  )
}
