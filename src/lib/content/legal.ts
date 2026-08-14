/**
 * Contenu légal canonique (FR) — mentions légales, confidentialité, CGV.
 *
 * Source de vérité versionnée : `getLegalPage` (src/lib/cms/content.ts) retombe
 * sur ce contenu tant qu'aucun document `legalPage` Sanity n'existe, et il sert
 * aussi de base au seed Sanity (scripts/seed-legal.ts) pour rendre ces pages
 * éditables par Emeline dans le Studio.
 *
 * Entité légale : « Précieuse », atelier de joaillerie artisanale établi à
 * Bordeaux (France).
 * Mentions obligatoires renseignées depuis le Kbis (2026) : PRECIEUSE, EURL au
 * capital de 500 €, siège 30 rue Latapie 33650 La Brède, SIRET 107 679 151 00012
 * (RCS Bordeaux), TVA non applicable (franchise, art. 293 B CGI), tél +33 6 23 18
 * 58 87. RESTE : Emeline doit adhérer à un médiateur de la consommation (CGV) et
 * confirmer son statut TVA avec son comptable. À faire valider par un juriste
 * (notamment CGV / droit de rétractation sur le sur-mesure).
 */

export type PortableSpan = { _type: 'span'; _key: string; text: string; marks: string[] }
export type PortableBlock = {
  _type: 'block'
  _key: string
  style: string
  listItem?: 'bullet'
  level?: number
  markDefs: never[]
  children: PortableSpan[]
}

type Row = ['h2' | 'p' | 'li', string]

/** Construit un tableau Portable Text correctement clé-é à partir de lignes simples. */
function build(rows: Row[]): PortableBlock[] {
  return rows.map(([kind, text], i) => ({
    _type: 'block',
    _key: `b${i}`,
    style: kind === 'h2' ? 'h2' : 'normal',
    ...(kind === 'li' ? { listItem: 'bullet' as const, level: 1 } : {}),
    markDefs: [],
    children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
  }))
}

export type LegalDoc = { slug: string; title: string; body: PortableBlock[] }

const MENTIONS: LegalDoc = {
  slug: 'mentions-legales',
  title: 'Mentions légales',
  body: build([
    ['h2', 'Informations légales'],
    [
      'p',
      'Le site www.precieuse-joaillerie.com est édité par « Précieuse », atelier de joaillerie artisanale établi à La Brède, en Gironde (France).',
    ],
    ['li', 'Dénomination sociale : PRECIEUSE'],
    ['li', 'Forme juridique : Société à responsabilité limitée à associé unique (EURL) au capital de 500 €'],
    ['li', 'Siège social / atelier : 30 rue Latapie, 33650 La Brède, France'],
    ['li', 'SIRET : 107 679 151 00012 — RCS Bordeaux 107 679 151'],
    ['li', 'TVA : TVA non applicable, article 293 B du CGI (franchise en base)'],
    ['li', 'Téléphone : +33 6 23 18 58 87'],
    ['li', 'Email : contact@precieuse-joaillerie.com'],
    ['li', 'Responsable de la publication : Emeline Le Ray'],
    ['h2', 'Hébergement'],
    [
      'p',
      "Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com).",
    ],
    ['h2', 'Propriété intellectuelle'],
    [
      'p',
      "L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est protégé par le droit d'auteur. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation préalable.",
    ],
    ['h2', 'Protection des données'],
    [
      'p',
      "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, écrivez-nous à contact@precieuse-joaillerie.com. Pour plus de détails, consultez notre Politique de confidentialité.",
    ],
    ['h2', 'Cookies'],
    [
      'p',
      'Ce site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez désactiver leur utilisation en paramétrant votre navigateur.',
    ],
  ]),
}

const CONFIDENTIALITE: LegalDoc = {
  slug: 'confidentialite',
  title: 'Politique de confidentialité',
  body: build([
    ['h2', '1. Introduction'],
    [
      'p',
      "La présente politique de confidentialité a pour but de vous informer de manière claire et transparente sur la manière dont « Précieuse » (atelier de joaillerie artisanale établi à La Brède, en Gironde, France ; dénomination sociale PRECIEUSE, SIRET 107 679 151 00012) collecte, utilise et protège vos données personnelles lorsque vous utilisez le site www.precieuse-joaillerie.com.",
    ],
    [
      'p',
      "En accédant à ce site, vous acceptez la présente politique. Elle peut être mise à jour à tout moment, en fonction des évolutions législatives ou techniques.",
    ],
    ['h2', '2. Identité du responsable du traitement'],
    ['li', 'Précieuse — dénomination sociale : PRECIEUSE'],
    ['li', 'Siège social / atelier : 30 rue Latapie, 33650 La Brède, France'],
    ['li', 'SIRET : 107 679 151 00012'],
    ['li', 'Email : contact@precieuse-joaillerie.com'],
    ['li', 'Responsable du traitement : Emeline Le Ray'],
    ['h2', '3. Données collectées'],
    [
      'p',
      'Nous collectons uniquement les données strictement nécessaires à la finalité poursuivie. Ces données peuvent inclure :',
    ],
    ['li', 'Nom et prénom'],
    ['li', 'Adresse email'],
    ['li', 'Numéro de téléphone'],
    ['li', 'Adresse postale (lors de commandes ou livraisons)'],
    ['li', 'Informations de paiement (traitées de manière sécurisée via nos prestataires)'],
    ['li', 'Données de navigation et cookies (voir section 6)'],
    ['p', "Nous ne collectons aucune donnée sensible (origine raciale, opinion politique, santé, etc.)."],
    ['h2', '4. Finalités du traitement'],
    ['p', 'Vos données sont collectées pour :'],
    ['li', 'Répondre à vos demandes (formulaire de contact, demande de devis, etc.)'],
    ['li', 'Traiter vos commandes et assurer leur suivi'],
    ['li', 'Vous envoyer notre newsletter (si vous y avez consenti)'],
    ['li', "Analyser la fréquentation du site pour améliorer son ergonomie et ses performances"],
    ['h2', '5. Base légale du traitement'],
    ['p', 'Le traitement de vos données repose sur :'],
    ['li', 'Votre consentement (inscription newsletter, cookies, formulaire)'],
    ['li', "L'exécution d'un contrat (commande sur le site)"],
    ['li', "Notre intérêt légitime (amélioration du site, protection contre les fraudes)"],
    ['h2', '6. Cookies et traceurs'],
    ['p', 'Le site utilise des cookies pour :'],
    ['li', 'Analyser le trafic (via Google Analytics ou outil équivalent)'],
    ['li', 'Améliorer votre navigation (mémorisation du panier, langue, etc.)'],
    ['li', 'Vous proposer du contenu adapté'],
    [
      'p',
      'Vous pouvez paramétrer vos préférences à tout moment via la bannière cookie ou les réglages de votre navigateur.',
    ],
    ['h2', '7. Durée de conservation'],
    ['p', 'Nous conservons vos données uniquement pour la durée nécessaire à la finalité poursuivie :'],
    ['li', 'Jusqu’à 3 ans après le dernier contact pour les données marketing'],
    ['li', "Jusqu'à 10 ans pour les données liées à une commande (obligations comptables)"],
    ['li', "Jusqu'à votre demande de suppression"],
    ['h2', '8. Destinataires des données'],
    [
      'p',
      'Les données collectées sont destinées exclusivement à « Précieuse » et à ses prestataires de confiance (hébergement, paiement, logistique), strictement dans le cadre de leurs missions.',
    ],
    ['p', 'Nous ne vendons, ne louons et ne cédons jamais vos données à des tiers à des fins commerciales.'],
    ['h2', '9. Sécurité'],
    [
      'p',
      'Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour assurer la confidentialité, l’intégrité et la sécurité de vos données personnelles (certificat SSL, hébergement sécurisé, limitation des accès…).',
    ],
    ['h2', '10. Vos droits'],
    ['p', 'Conformément au RGPD, vous disposez des droits suivants :'],
    ['li', "Droit d'accès : connaître les données que nous détenons sur vous"],
    ['li', 'Droit de rectification : corriger vos informations'],
    ['li', "Droit d'effacement : demander la suppression de vos données"],
    ['li', 'Droit à la portabilité : recevoir vos données dans un format structuré'],
    ['li', "Droit d'opposition ou de limitation du traitement"],
    ['li', 'Droit de retirer votre consentement à tout moment'],
    [
      'p',
      'Vous pouvez exercer ces droits en nous contactant à contact@precieuse-joaillerie.com. Vous avez également le droit d’introduire une réclamation auprès de la CNIL (Commission Nationale de l’Informatique et des Libertés — France, www.cnil.fr) si vous estimez que vos droits ne sont pas respectés.',
    ],
    ['h2', '11. Contact'],
    [
      'p',
      'Pour toute question relative à la protection de vos données : contact@precieuse-joaillerie.com.',
    ],
  ]),
}

const CGV: LegalDoc = {
  slug: 'cgv',
  title: 'Conditions générales de vente',
  body: build([
    ['h2', '1. Objet'],
    [
      'p',
      "Les présentes conditions générales de vente (CGV) régissent les ventes de bijoux et créations sur-mesure proposés par « Précieuse » (SARL à associé unique au capital de 500 €, SIRET 107 679 151 00012, siège 30 rue Latapie, 33650 La Brède). Toute commande implique l'acceptation pleine et entière des présentes CGV.",
    ],
    ['h2', '2. Produits et créations sur-mesure'],
    [
      'p',
      "Précieuse propose une collection de pièces ainsi que des créations sur-mesure réalisées à la main, en or 18 carats. Chaque pièce étant fabriquée artisanalement, de légères variations (teinte de l'or, aspect des pierres) peuvent exister et ne constituent pas un défaut.",
    ],
    ['h2', '3. Prix et devis'],
    [
      'p',
      "Les créations sont proposées sur devis personnalisé, établi après un échange avec l'atelier. Le devis, exprimé en euros, précise le détail de la création, le délai estimé et les modalités de paiement. Il est valable 30 jours.",
    ],
    ['h2', '4. Commande'],
    [
      'p',
      "La commande est confirmée après validation du devis par le client. Pour les créations sur-mesure, la fabrication ne débute qu'après accord du client sur l'esquisse finale et, le cas échéant, versement d'un acompte.",
    ],
    ['h2', '5. Paiement'],
    [
      'p',
      "Le règlement s'effectue par virement bancaire ou via PayPal, selon les modalités indiquées sur le devis. Aucun paiement n'est traité directement sur le site : il intervient après échange avec l'atelier. La création demeure la propriété de Précieuse jusqu'à complet paiement.",
    ],
    ['h2', '6. Délais de fabrication et livraison'],
    [
      'p',
      "Le délai de fabrication d'une création est généralement de 4 à 8 semaines après validation, communiqué à titre indicatif. La livraison est assurée par envoi sécurisé et assuré, accompagné d'un certificat d'authenticité.",
    ],
    ['h2', '7. Droit de rétractation'],
    [
      'p',
      "Conformément à la législation applicable, le droit de rétractation de 14 jours ne s'applique pas aux biens confectionnés sur-mesure ou personnalisés selon les spécifications du client. Pour les pièces de collection non personnalisées, le droit de rétractation s'exerce dans les conditions légales.",
    ],
    [
      'p',
      "À titre commercial, Précieuse offre une possibilité de retour sous 30 jours pour les pièces non personnalisées rendues dans leur état d'origine, ainsi qu'une mise à taille offerte. Les modalités précises sont confirmées lors de l'échange.",
    ],
    ['h2', '8. Garanties'],
    [
      'p',
      'Les créations bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés. Les diamants et pierres précieuses sont, le cas échéant, accompagnés d’un certificat GIA ou HRD.',
    ],
    ['h2', '9. Données personnelles'],
    [
      'p',
      'Les données collectées dans le cadre d’une commande sont traitées conformément à notre Politique de confidentialité.',
    ],
    ['h2', '10. Droit applicable et litiges'],
    [
      'p',
      "Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité ; à défaut, les juridictions françaises compétentes pourront être saisies. Conformément aux articles L.612-1 et suivants du Code de la consommation, le client peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige ; les coordonnées du médiateur compétent sont disponibles sur simple demande à contact@precieuse-joaillerie.com.",
    ],
    ['h2', '11. Contact'],
    [
      'p',
      'Pour toute question relative à votre commande : contact@precieuse-joaillerie.com — téléphone +33 6 23 18 58 87.',
    ],
  ]),
}

export const LEGAL_PAGES: Record<string, LegalDoc> = {
  'mentions-legales': MENTIONS,
  confidentialite: CONFIDENTIALITE,
  cgv: CGV,
}

/** Contenu légal statique par slug (repli versionné). */
export function getStaticLegal(slug: string): LegalDoc | undefined {
  return LEGAL_PAGES[slug]
}
