/**
 * Product categories. The `id` is used in links (/products?category=keychains)
 * and in each product's `categories` list in products.ts.
 * To add a category: add an entry here, then use its id on products.
 */

export const categories = [
  {
    id: "keychains",
    name: "Customized Keychains",
    short: "Keychains",
    description: "Devotional, fidget and fun keychains on sturdy metal rings, plus name keychains made to order.",
    cover: "images/products/bal-krishna-flute-keychain/1.webp",
  },
  {
    id: "home-decor",
    name: "Home Decor & Planters",
    short: "Home & Planters",
    description: "Idols, busts and planters with fine detail for mandirs, desks and living rooms.",
    cover: "images/products/adiyogi-shiva-bust/1.webp",
  },
  {
    id: "festival",
    name: "Festival & Occasion Products",
    short: "Festive",
    description: "Pooja essentials and festive décor for Diwali, Janmashtami, Shivaratri and new beginnings.",
    cover: "images/products/shubh-labh-lotus-decor/1.webp",
  },
  {
    id: "personalized",
    name: "Personalized Gifts",
    short: "Personalized",
    description: "Gifts printed with a name, an initial or your own profile link — made for one person.",
    cover: "images/products/custom-name-keychain/1.webp",
  },
  {
    id: "mobile",
    name: "Mobile Accessories",
    short: "Mobile",
    description: "Folding phone stands that fit on a keyring and go wherever you go.",
    cover: "images/products/tripod-phone-stand-keychain/1.webp",
  },
  {
    id: "desk",
    name: "Utility & Desk Accessories",
    short: "Desk & Utility",
    description: "Practical pieces for your workspace, built to be used every day.",
    cover: "images/products/adjustable-desk-phone-stand/1.webp",
  },
] as const;

export type Category = (typeof categories)[number];
export type CategoryId = Category["id"];

export const categoryById = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);
