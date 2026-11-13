/**
 * ============================================================
 *  BUSINESS DETAILS — edit this file to change contact info.
 * ============================================================
 * Anything left as an empty string ("") is hidden on the website,
 * so you never show a fake or half-finished detail.
 */

export const site = {
  name: "Navin 3D Design and Creations",
  shortName: "Navin 3D",
  tagline: "3D designs, customised products and personalised gifts",
  description:
    "Navin 3D Design and Creations makes 3D-designed idols, festive décor, planters, desk accessories, keychains and personalised gifts in Udaipur, Rajasthan. Retail, wholesale and custom orders welcome.",

  /** Public website address once deployed, e.g. "https://navin3d.in" (used for share links / SEO). */
  url: "",

  contact: {
    /** Shown on the site and used for the "Call" button. */
    phone: "+91 63754 11047",
    /** Digits only, with country code (91 for India), no "+" or spaces. */
    whatsapp: "916375411047",
    email: "jaroli20kritik@gmail.com",
    location: "Udaipur, Rajasthan, India",
    /** Optional Google Maps link for the location. Leave "" to hide. */
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Udaipur%2C+Rajasthan",
    /** Optional business hours text. Leave "" to hide. */
    hours: "",
  },

  /** Social profiles — paste the full profile URL. Empty ones are hidden. */
  social: {
    instagram: "", // e.g. "https://instagram.com/navin3d"
    facebook: "",
    youtube: "",
  },

  /**
   * PDF catalogue. To update it, replace the file in public/catalogue/
   * (keep the same file name), or change `file` below.
   */
  catalogue: {
    file: "catalogue/Navin3D-Product-Catalogue.pdf",
    downloadName: "Navin3D-Product-Catalogue.pdf",
    edition: "Collection 2026 · Updated edition",
    pages: 24,
    sizeLabel: "about 4 MB",
    previews: [
      "catalogue/preview-1.webp",
      "catalogue/preview-2.webp",
      "catalogue/preview-3.webp",
      "catalogue/preview-4.webp",
    ],
  },

  /** Text shown wherever a product has no price set. */
  priceOnRequest: "Price on request",
};

export type Site = typeof site;
