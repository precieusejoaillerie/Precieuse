import { m } from '#/paraglide/messages'

/**
 * Contrat de données de la page Sur-mesure. Les composants `Bespoke*` sont
 * présentationnels : ils reçoivent une tranche de `BespokePageData` et la
 * rendent. Le contenu vient de Sanity (`surMesurePage`) quand il est rempli,
 * sinon du repli `bespokePageFallback()` ci-dessous — qui lit les clés Paraglide
 * (donc traduites FR/EN/PT) + les photos par défaut. Cf. `getBespokePage`.
 */

/** Résout une clé de message Paraglide sans paramètre (utilisé par le repli). */
export function bespokeMessage(key: string): string {
  const table = m as unknown as Record<string, (() => string) | undefined>
  const fn = table[key]
  return typeof fn === 'function' ? fn() : key
}

/** Icônes (SVG) des 4 étapes du procédé — structurelles, non éditables. */
export const BESPOKE_STEP_SVGS = [
  '/images/process/etape-1.svg',
  '/images/process/etape-2.svg',
  '/images/process/etape-3.svg',
  '/images/process/etape-4.svg',
] as const

export type BespokeImg = { src: string; alt: string; position?: string }
export type BespokeStepData = { title: string; body: string }
export type BespokePiece = {
  name: string
  material: string
  atelier: BespokeImg
  portee: BespokeImg
}
export type BespokeVoice = {
  initial: string
  quote: string
  name: string
  city: string
}

export type BespokePageData = {
  hero: {
    kicker: string
    title: string
    titleAccent: string
    sub: string
    cta: string
    photo: BespokeImg
    /** Vidéo plein cadre (moitié gauche du héro). URL de l'asset. */
    video: string
    /** Image de remplacement de la vidéo (poster, visible en reduced-motion). */
    poster: string
  }
  marquee: string[]
  atelier: {
    titleLead: string
    titleAccent: string
    titleTail: string
    body: string
    link: string
    badge: string
    images: BespokeImg[]
  }
  steps: BespokeStepData[]
  manifeste: { lead: string; accent: string }
  split: {
    eyebrow: string
    titleLead: string
    titleAccent: string
    titleTail: string
    body: string
    link: string
    image: BespokeImg
  }
  realisations: {
    eyebrow: string
    title: string
    intro: string
    tagAtelier: string
    tagPortee: string
    pieces: BespokePiece[]
  }
  voices: { title: string; items: BespokeVoice[] }
  /** Métadonnées SEO (titre + description) de la page, éditables par page. */
  seo: { title: string; description: string }
}

/**
 * Repli statique de la page Sur-mesure : valeurs i18n (Paraglide, traduites
 * FR/EN/PT) + photos par défaut. Servi tel quel tant que le document Sanity
 * `surMesurePage` n'est pas rempli ; sinon `getBespokePage` fusionne Sanity
 * par-dessus, champ par champ. Conserve EXACTEMENT le contenu actuel des
 * composants (zéro régression).
 */
export function bespokePageFallback(): BespokePageData {
  return {
    hero: {
      kicker: m.sm_hero_kicker(),
      title: m.sm_hero_title(),
      titleAccent: m.sm_hero_title_accent(),
      sub: m.sm_hero_sub(),
      cta: m.sm_hero_cta(),
      photo: {
        src: '/images/real/bague-main-chaise-thelma.webp',
        alt: m.sm_hero_photo_alt(),
      },
      video: '/images/video/ring-box.mp4',
      // Poster = 1re image de la video (extraite via ffmpeg) → bascule invisible.
      poster: '/images/video/ring-box-poster.webp',
    },
    marquee: [
      m.sm_marquee_1(),
      m.sm_marquee_2(),
      m.sm_marquee_3(),
      m.sm_marquee_4(),
      m.sm_marquee_5(),
    ],
    atelier: {
      titleLead: m.sm_about_title_lead(),
      titleAccent: m.sm_about_title_accent(),
      titleTail: m.sm_about_title_tail(),
      body: m.sm_about_body(),
      link: m.sm_about_link(),
      badge: m.sm_about_badge(),
      images: [
        {
          src: '/images/emeline/emeline-atelier.jpg',
          alt: "Emeline à l'établi, dans son atelier de Bordeaux",
        },
        {
          src: '/images/atelier/bague-en-fabrication.jpg',
          alt: "Bague en cours de fabrication, fixée à l'étau",
        },
        {
          src: '/images/real/main-poche-josephine.webp',
          alt: 'Bague Joséphine portée, main glissée dans la poche',
        },
      ],
    },
    steps: [
      { title: m.sm_step1_title(), body: m.sm_step1_body() },
      { title: m.sm_step2_title(), body: m.sm_step2_body() },
      { title: m.sm_step3_title(), body: m.sm_step3_body() },
      { title: m.sm_step4_title(), body: m.sm_step4_body() },
    ],
    manifeste: { lead: m.sm_manifeste_lead(), accent: m.sm_manifeste_accent() },
    split: {
      eyebrow: m.sm_split_eyebrow(),
      titleLead: m.sm_split_title_lead(),
      titleAccent: m.sm_split_title_accent(),
      titleTail: m.sm_split_title_tail(),
      body: m.sm_split_body(),
      link: m.sm_split_link(),
      image: {
        src: '/images/atelier/esquisses-amethyste.jpg',
        alt: m.sm_split_img_alt(),
      },
    },
    realisations: {
      eyebrow: m.sm_real_eyebrow(),
      title: m.sm_real_title(),
      intro: m.sm_real_intro(),
      tagAtelier: m.sm_real_tag_atelier(),
      tagPortee: m.sm_real_tag_portee(),
      pieces: [
        {
          name: 'Joséphine',
          material: m.sm_real_mat_josephine(),
          atelier: {
            src: '/images/real/bague-entouree-josephine.webp',
            alt: "Bague Joséphine photographiée à l'atelier",
          },
          portee: {
            src: '/images/real/main-chaise-josephine.webp',
            alt: 'Bague Joséphine portée, main posée sur une chaise',
          },
        },
        {
          name: 'Aurore',
          material: m.sm_real_mat_aurore(),
          atelier: {
            src: '/images/real/bague-pierre-aurore.webp',
            alt: "Bague Aurore photographiée à l'atelier",
          },
          portee: {
            src: '/images/real/bague-main-chaise-aurore.webp',
            alt: 'Bague Aurore portée, main posée sur une chaise',
          },
        },
        {
          name: 'Thelma',
          material: m.sm_real_mat_thelma(),
          atelier: {
            src: '/images/real/bague-boule-thelma.webp',
            alt: "Bague Thelma photographiée à l'atelier",
          },
          portee: {
            src: '/images/real/mains-poche-thelma.webp',
            alt: 'Bague Thelma portée, mains glissées dans les poches',
          },
        },
      ],
    },
    voices: {
      title: m.sm_voices_title(),
      items: [
        { initial: 'M', quote: m.sm_voice1_quote(), name: 'Martine B.', city: 'Bordeaux' },
        { initial: 'S', quote: m.sm_voice2_quote(), name: 'Sandrine L.', city: 'Lyon' },
        { initial: 'C', quote: m.sm_voice3_quote(), name: 'Camille R.', city: 'Paris' },
      ],
    },
    seo: { title: m.seo_surmesure_title(), description: m.seo_surmesure_desc() },
  }
}
