import type { CategoryId } from "./categories";

/**
 * ============================================================
 *  PRODUCT LIST — the single place to add, edit or remove products.
 * ============================================================
 *
 * To ADD a product:
 *   1. Make a folder  public/images/products/<slug>/  and put photos in it
 *      named 1.webp, 2.webp … (or .jpg / .png — see `photos()` below).
 *   2. Copy one product block below, paste it, and change the values.
 *   3. Save. The product shows up on the Products page, in its categories,
 *      in search, and gets its own page at /products/<slug>.
 *
 * To REMOVE a product: delete its block (and optionally its photo folder).
 *
 * Rules that keep the site honest:
 *   - Leave `price` empty ("") until you have a real price. The site then
 *     shows "Price on request".
 *   - Only list colours and customisation options you actually offer.
 *   - No photos yet? Use `images: []` and a clearly marked
 *     "Photo coming soon" placeholder is shown automatically.
 */

export interface Product {
  /** Unique, lowercase, words separated by dashes. Used in the page URL. */
  slug: string;
  name: string;
  /** One or more category ids from categories.ts. The first is the main one. */
  categories: CategoryId[];
  /** One line shown on product cards. */
  shortDescription: string;
  /** Longer paragraph shown on the product page. */
  description: string;
  /** Bullet points shown on the product page. */
  highlights: string[];
  /** Photo paths inside /public. The first photo is the cover. */
  images: string[];
  /** Real price or starting price, e.g. "₹249" or "From ₹199". "" = Price on request. */
  price: string;
  /** Colours you offer for this product. Leave [] if you'd rather not list them. */
  colors: string[];
  /** true shows a "Customisable" badge and the options below. */
  customizable: boolean;
  customizationOptions: string[];
  /** Show on the home page "Featured" section. */
  featured?: boolean;
  /** Show a "New" badge. */
  isNew?: boolean;
}

/** Builds photo paths: photos("my-product", 3) → 1.webp, 2.webp, 3.webp in that folder. */
export const photos = (slug: string, count: number, ext = "webp"): string[] =>
  Array.from({ length: count }, (_, i) => `images/products/${slug}/${i + 1}.${ext}`);

export const products: Product[] = [
  {
    slug: "ganesha-kumkum-chawal-dibbi",
    name: "Ganesha Kumkum Chawal Dibbi",
    categories: ["festival", "home-decor"],
    shortDescription: "Ganesha idol with twin bowls for kumkum and chawal.",
    description:
      "A seated Ganesha flanked by two bowls for kumkum and chawal, carved with an intricate crown, jewellery and lotus-scroll base. Made for pooja thalis, home mandirs and festive gifting.",
    highlights: [
      "Twin bowls for kumkum and chawal",
      "Intricate crown, jewellery and lotus-scroll carving",
      "Available in ivory or red & white two-tone",
      "Ideal for pooja thalis, mandirs and festive gifting",
    ],
    images: photos("ganesha-kumkum-chawal-dibbi", 4),
    price: "",
    colors: ["Ivory", "Red & white"],
    customizable: true,
    customizationOptions: ["Choice of ivory or red & white two-tone finish", "Bulk orders for festive gifting"],
    featured: true,
    isNew: true,
  },
  {
    slug: "baby-hanuman-idol",
    name: "Baby Hanuman Idol",
    categories: ["home-decor", "festival"],
    shortDescription: "Bal Hanuman with fine crown, jewellery and expressive eyes.",
    description:
      "A charming seated Bal Hanuman with fine detailing on the crown, jewellery and base, and painted eye and brow detail. Sized for car dashboards, study desks and home mandirs.",
    highlights: [
      "Fine detailing on crown, jewellery and base",
      "Expressive eye and brow detailing",
      "Perfect for car dashboards, study desks and mandirs",
      "A thoughtful gift for festivals and pujas",
    ],
    images: photos("baby-hanuman-idol", 4),
    price: "",
    colors: ["Orange"],
    customizable: false,
    customizationOptions: [],
    featured: true,
  },
  {
    slug: "parshvanath-bhagwan-idol",
    name: "Parshvanath Bhagwan Idol",
    categories: ["home-decor", "festival"],
    shortDescription: "Meditative Parshvanath under a layered serpent-hood canopy.",
    description:
      "Parshvanath Bhagwan seated in dhyana mudra beneath a layered serpent-hood canopy, with the serpent emblem carved on the base. A calm, meaningful piece for home altars and Jain festivals.",
    highlights: [
      "Layered serpent-hood canopy",
      "Calm meditative posture with hands in dhyana mudra",
      "Serpent emblem carved on the base",
      "A meaningful gift for Paryushan and Jain festivals",
    ],
    images: photos("parshvanath-bhagwan-idol", 4),
    price: "",
    colors: ["Black"],
    customizable: false,
    customizationOptions: [],
    isNew: true,
  },
  {
    slug: "adiyogi-shiva-bust",
    name: "Adiyogi Shiva Bust",
    categories: ["home-decor", "festival"],
    shortDescription: "Deep black Adiyogi bust with a white crescent moon.",
    description:
      "An Adiyogi Shiva bust in a deep black finish with a white crescent-moon accent and detailed hair, face and mala. Suits desks, car dashboards and meditation corners.",
    highlights: [
      "Deep black finish with a white crescent moon accent",
      "Detailed hair, face and mala",
      "Ideal for desks, car dashboards and meditation corners",
      "A meaningful gift for Maha Shivaratri and housewarmings",
    ],
    images: photos("adiyogi-shiva-bust", 4),
    price: "",
    colors: ["Black with white moon"],
    customizable: false,
    customizationOptions: [],
    featured: true,
  },
  {
    slug: "ganesha-keychain",
    name: "Ganesha Keychain",
    categories: ["keychains", "festival"],
    shortDescription: "Smiling Bal Ganesha charm for new keys, homes and vehicles.",
    description:
      "A smiling Bal Ganesha with blessing hand and modak, finely detailed on the crown, tilak and necklace, on a sturdy metal key ring. A lucky charm for new keys, homes and vehicles.",
    highlights: [
      "Smiling Bal Ganesha with blessing hand and modak",
      "Fine detailing on crown, tilak and necklace",
      "Sturdy metal key ring",
      "A lucky charm for new keys, homes and vehicles",
    ],
    images: photos("ganesha-keychain", 4),
    price: "",
    colors: ["Ivory"],
    customizable: false,
    customizationOptions: [],
    featured: true,
    isNew: true,
  },
  {
    slug: "bal-krishna-flute-keychain",
    name: "Bal Krishna Flute Keychain",
    categories: ["keychains", "festival"],
    shortDescription: "Bal Krishna with flute and mor-pankh crown on a metal ring.",
    description:
      "Bal Krishna playing the flute, with detailed curls and a mor-pankh crown. Hangs on a metal key ring and chain, and stands on its own base as a mini desk figurine.",
    highlights: [
      "Detailed flute, curls and mor-pankh crown",
      "Doubles as a mini desk figurine",
      "Metal key ring and chain",
      "A sweet gift for Janmashtami",
    ],
    images: photos("bal-krishna-flute-keychain", 4),
    price: "",
    colors: ["Ivory"],
    customizable: false,
    customizationOptions: [],
    featured: true,
    isNew: true,
  },
  {
    slug: "flexi-octopus-keychain",
    name: "Flexi Octopus Keychain",
    categories: ["keychains"],
    shortDescription: "Eight jointed tentacles that wiggle and flex.",
    description:
      "A cute octopus with eight jointed, flexible tentacles and eye detailing, printed in one piece with moving joints. Comes on a metal key ring.",
    highlights: [
      "Eight jointed, flexible tentacles",
      "Cute face with eye detailing",
      "Comes on a metal key ring",
      "Loved by kids and collectors alike",
    ],
    images: photos("flexi-octopus-keychain", 4),
    price: "",
    colors: ["Orange"],
    customizable: false,
    customizationOptions: [],
  },
  {
    slug: "flexi-shark-keychain",
    name: "Flexi Shark Keychain",
    categories: ["keychains"],
    shortDescription: "Articulated shark that swishes and swims.",
    description:
      "An articulated shark whose body swishes from side to side, with sculpted fins and tail, on a sturdy metal key ring and chain.",
    highlights: [
      "Articulated body that swishes and swims",
      "Fins and tail sculpted in detail",
      "Sturdy metal key ring and chain",
      "Great as a return gift or bag charm",
    ],
    images: photos("flexi-shark-keychain", 4),
    price: "",
    colors: ["Orange"],
    customizable: false,
    customizationOptions: [],
  },
  {
    slug: "hexagon-spiral-fidget-keychain",
    name: "Hexagon Spiral Fidget Keychain",
    categories: ["keychains"],
    shortDescription: "Telescoping hexagon layers that pop out and push back.",
    description:
      "A geometric fidget keychain whose telescoping hexagon layers pop out into a spiral and push back flat. Light, pocket-sized and satisfying to play with.",
    highlights: [
      "Telescoping layers pop out and push back",
      "Clean geometric design",
      "Lightweight, pocket-friendly size",
      "Comes on a metal key ring and chain",
    ],
    images: photos("hexagon-spiral-fidget-keychain", 4),
    price: "",
    colors: ["Orange"],
    customizable: false,
    customizationOptions: [],
  },
  {
    slug: "gyro-spinner-keychain",
    name: "Gyro Spinner Keychain",
    categories: ["keychains"],
    shortDescription: "Nested rings that spin freely and fold flat.",
    description:
      "Multiple free-spinning, matte-finish rings nested inside each other. Spin them in any direction, then fold flat to carry on a metal key ring and chain.",
    highlights: [
      "Multiple free-spinning rings",
      "Folds flat for easy carrying",
      "Smooth, matte-finish rings",
      "Comes on a metal key ring and chain",
    ],
    images: photos("gyro-spinner-keychain", 4),
    price: "",
    colors: ["Orange"],
    customizable: false,
    customizationOptions: [],
  },
  {
    slug: "dragon-scale-gyro-spinner",
    name: "Dragon Scale Gyro Spinner",
    categories: ["keychains"],
    shortDescription: "Gyro spinner with a raised dragon-scale outer ring.",
    description:
      "A gyro spinner with a raised dragon-scale texture on the outer ring and free-spinning nested rings inside, in a bold red finish. Folds flat to pocket size.",
    highlights: [
      "Raised dragon-scale texture on the outer ring",
      "Free-spinning nested rings",
      "Folds flat to pocket size",
      "Bold red finish that stands out",
    ],
    images: photos("dragon-scale-gyro-spinner", 4),
    price: "",
    colors: ["Red"],
    customizable: false,
    customizationOptions: [],
  },
  {
    slug: "phone-stand-keychain",
    name: "Phone Stand Keychain",
    categories: ["mobile", "keychains"],
    shortDescription: "Folding phone stand that clips onto your keys.",
    description:
      "A keychain that unfolds into a phone stand, with grip ridges that hold your phone at a comfortable viewing angle. Folds flat again to keychain size.",
    highlights: [
      "Folding support with grip ridges",
      "Holds your phone at a comfortable viewing angle",
      "Folds flat to keychain size",
      "Practical gift for travellers and students",
    ],
    images: photos("phone-stand-keychain", 4),
    price: "",
    colors: ["Orange", "Red"],
    customizable: false,
    customizationOptions: [],
  },
  {
    slug: "tripod-phone-stand-keychain",
    name: "Tripod Phone Stand Keychain",
    categories: ["mobile", "keychains"],
    shortDescription: "Unfolds into a stable three-leg phone stand.",
    description:
      "A keychain that unfolds into a stable three-leg stand, with a hinged cradle that holds your phone securely. The legs fold flat for carrying on a metal key ring and chain.",
    highlights: [
      "Unfolds into a stable three-leg stand",
      "Hinged cradle holds the phone securely",
      "Legs fold flat for carrying",
      "Comes on a metal key ring and chain",
    ],
    images: photos("tripod-phone-stand-keychain", 4),
    price: "",
    colors: ["Red"],
    customizable: false,
    customizationOptions: [],
    isNew: true,
  },
  {
    slug: "custom-name-keychain",
    name: "Custom Name Keychain",
    categories: ["personalized", "keychains"],
    shortDescription: "Any name in two-colour raised lettering.",
    description:
      "Your name, or anyone's, printed in bold two-colour raised lettering. Choose from a range of colour pairs. Popular for return gifts, school bags and teams.",
    highlights: [
      "Personalised with any name",
      "Two-colour raised lettering",
      "Choose from a range of colour pairs",
      "Ideal for return gifts, school bags and teams",
    ],
    images: photos("custom-name-keychain", 4),
    price: "",
    colors: ["Blue & white", "Orange & white"],
    customizable: true,
    customizationOptions: ["Any name", "Choice of colour pair", "Bulk orders for return gifts, schools and teams"],
    featured: true,
    isNew: true,
  },
  {
    slug: "initial-name-keychain",
    name: "Initial & Name Keychain",
    categories: ["personalized", "keychains"],
    shortDescription: "Big initial letter with the full name in flowing script.",
    description:
      "A bold initial letter with the full name in flowing script across it, printed to order in two colours. You choose the initial, the name and the colours.",
    highlights: [
      "Big initial letter with the full name in flowing script",
      "Two-colour design, printed to order",
      "Choose your own initial, name and colours",
      "A personal gift for birthdays, couples and friends",
    ],
    images: photos("initial-name-keychain", 4),
    price: "",
    colors: ["Red & grey"],
    customizable: true,
    customizationOptions: ["Your initial", "Your name", "Your choice of two colours"],
    featured: true,
    isNew: true,
  },
  {
    slug: "tree-of-life-heart-keychain",
    name: "Tree of Life Heart Keychain",
    categories: ["personalized", "keychains"],
    shortDescription: "Heart with a fine filigree tree-of-life cut-out.",
    description:
      "A slim heart-shaped keychain with a fine filigree tree-of-life cut-out. Several tree designs are available. Light enough for keys or bags.",
    highlights: [
      "Fine filigree tree-of-life cut-out",
      "Multiple tree designs available",
      "Light and slim for keys or bags",
      "Lovely for anniversaries and friendship days",
    ],
    images: photos("tree-of-life-heart-keychain", 4),
    price: "",
    colors: ["Red"],
    customizable: true,
    customizationOptions: ["Choice of tree design"],
    isNew: true,
  },
  {
    slug: "nfc-instagram-keychain",
    name: "NFC Instagram Keychain",
    categories: ["personalized", "mobile", "keychains"],
    shortDescription: "Tap it on a phone to open your Instagram profile.",
    description:
      "A keychain with a built-in NFC chip programmed with your Instagram profile link. Tap it on any NFC-enabled phone to open your profile. No app or battery needed.",
    highlights: [
      "Built-in NFC chip, programmed with your profile link",
      "Tap to open your Instagram profile on any NFC phone",
      "No app or battery needed",
      "Available in black & white or red & white",
    ],
    images: photos("nfc-instagram-keychain", 4),
    price: "",
    colors: ["Black & white", "Red & white"],
    customizable: true,
    customizationOptions: ["Programmed with your own profile link", "Choice of black & white or red & white"],
    featured: true,
    isNew: true,
  },
  {
    slug: "shubh-labh-lotus-decor",
    name: "Shubh Labh Lotus Décor",
    categories: ["festival", "home-decor"],
    shortDescription: "Matching Shubh Labh pair rising from lotus relief.",
    description:
      "A set of two matching Shubh Labh pieces rising from deep lotus-and-leaf relief. Lightweight and easy to mount for Diwali, housewarmings and new shop openings.",
    highlights: [
      "Set of two matching pieces",
      "Deep lotus and leaf relief detailing",
      "Ideal for Diwali, housewarmings and new shop openings",
      "Lightweight and easy to mount",
    ],
    images: photos("shubh-labh-lotus-decor", 4),
    price: "",
    colors: ["Red"],
    customizable: false,
    customizationOptions: [],
    featured: true,
  },
  {
    slug: "adjustable-desk-phone-stand",
    name: "Adjustable Desk Phone Stand",
    categories: ["desk", "mobile"],
    shortDescription: "Angle-adjustable stand with a charging-cable slot.",
    description:
      "A desk phone stand whose viewing angle adjusts with a side knob. Ribbed grip surfaces keep the phone steady, a slot in the front ledge lets the charging cable through, and the wide rounded base keeps it stable.",
    highlights: [
      "Viewing angle adjusts with the side knob",
      "Ribbed grip surfaces keep your phone steady",
      "Charging-cable slot in the front ledge",
      "Wide rounded base for stability on any desk",
    ],
    images: photos("adjustable-desk-phone-stand", 4),
    price: "",
    colors: ["White & orange"],
    customizable: false,
    customizationOptions: [],
  },
  {
    slug: "voronoi-planter",
    name: "Voronoi Planter",
    categories: ["home-decor", "desk"],
    shortDescription: "Stone-textured pot on an organic Voronoi lattice base.",
    description:
      "A square planter with a stone-like textured finish, sitting on an organic Voronoi lattice base. Has a drainage hole and is sized for succulents, cacti and desk plants.",
    highlights: [
      "Stone-like textured outer finish",
      "Organic Voronoi lattice base",
      "Drainage hole to keep roots healthy",
      "Sized for succulents, cacti and desk plants",
    ],
    images: photos("voronoi-planter", 4),
    price: "",
    colors: ["White & red"],
    customizable: false,
    customizationOptions: [],
    isNew: true,
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
