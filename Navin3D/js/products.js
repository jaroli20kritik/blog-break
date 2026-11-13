/* =====================================================================
   NAVIN 3D DESIGNS & CREATIONS — PRODUCT DATA
   ---------------------------------------------------------------------
   This file IS the "database". No server or database is needed.

   ➜ To add a new product:
       1. Put its photos in  images/products/
       2. Copy one block below, paste it at the end of the PRODUCTS list,
          and change the values.
     OR open  admin.html  in your browser, fill in the form and it will
     generate the block (or a whole new products.js) for you.

   Field guide
     id          unique, lowercase, dashes only  (used in the page link)
     name        product name shown on the site
     category    main group — a new name automatically creates a new filter
     tags        small labels shown under the name
     isNew       true shows the "NEW" badge
     featured    true shows it in the hero / featured strip
     price       leave "" for "Price on request", or e.g. "₹299"
     images      first image is the cover; add as many as you like
     highlights  bullet points shown in the product view
     description optional short paragraph
   ===================================================================== */

window.SITE = {
  name: "Navin 3D Designs & Creations",
  tagline: "Handcrafted 3D-printed décor, idols, planters, desk accessories & keychains",
  // Fill these in to switch on the WhatsApp / e-mail / Instagram buttons.
  whatsapp: "916375411047", // country code + number, digits only
  email: "jaroli20kritik@gmail.com",
  instagram: "",         // e.g. "navin3d.designs" (without @)
  phone: "+91 63754 11047",
  location: "India",
  catalogue: "downloads/Navin3D-Product-Catalogue.pdf", // PDF people can download; replace the file to update it
};

window.PRODUCTS = [
  {
    id: "ganesha-kumkum-chawal-dibbi",
    name: "Ganesha Kumkum Chawal Dibbi",
    category: "Pooja Essentials",
    tags: ["Pooja Essentials"],
    isNew: true,
    featured: true,
    price: "",
    images: [
      "images/products/ganesha-kumkum-chawal-dibbi-1.jpg",
      "images/products/ganesha-kumkum-chawal-dibbi-2.jpg",
      "images/products/ganesha-kumkum-chawal-dibbi-3.jpg",
      "images/products/ganesha-kumkum-chawal-dibbi-4.jpg",
    ],
    highlights: [
      "Twin bowls for kumkum and chawal",
      "Intricate crown, jewellery and lotus-scroll carving",
      "Available in ivory or red & white two-tone",
      "Ideal for pooja thalis, mandirs and festive gifting",
    ],
  },
  {
    id: "baby-hanuman-idol",
    name: "Baby Hanuman Idol",
    category: "Idols & Figurines",
    tags: ["Idols & Figurines"],
    isNew: false,
    featured: true,
    price: "",
    images: [
      "images/products/baby-hanuman-idol-1.jpg",
      "images/products/baby-hanuman-idol-2.jpg",
      "images/products/baby-hanuman-idol-3.jpg",
      "images/products/baby-hanuman-idol-4.jpg",
    ],
    highlights: [
      "Fine detailing on crown, jewellery and base",
      "Expressive eye and brow detailing",
      "Perfect for car dashboards, study desks and mandirs",
      "A thoughtful gift for festivals and pujas",
    ],
  },
  {
    id: "parshvanath-bhagwan-idol",
    name: "Parshvanath Bhagwan Idol",
    category: "Idols & Figurines",
    tags: ["Idols & Figurines"],
    isNew: true,
    featured: false,
    price: "",
    images: [
      "images/products/parshvanath-bhagwan-idol-1.jpg",
      "images/products/parshvanath-bhagwan-idol-2.jpg",
      "images/products/parshvanath-bhagwan-idol-3.jpg",
      "images/products/parshvanath-bhagwan-idol-4.jpg",
    ],
    highlights: [
      "Layered serpent-hood canopy",
      "Calm meditative posture with hands in dhyana mudra",
      "Serpent emblem carved on the base",
      "A meaningful gift for Paryushan and Jain festivals",
    ],
  },
  {
    id: "adiyogi-shiva-bust",
    name: "Adiyogi Shiva Bust",
    category: "Idols & Figurines",
    tags: ["Idols & Figurines"],
    isNew: false,
    featured: true,
    price: "",
    images: [
      "images/products/adiyogi-shiva-bust-1.jpg",
      "images/products/adiyogi-shiva-bust-2.jpg",
      "images/products/adiyogi-shiva-bust-3.jpg",
      "images/products/adiyogi-shiva-bust-4.jpg",
    ],
    highlights: [
      "Deep black finish with a white crescent moon accent",
      "Detailed hair, face and mala",
      "Ideal for desks, car dashboards and meditation corners",
      "A meaningful gift for Maha Shivaratri and housewarmings",
    ],
  },
  {
    id: "ganesha-keychain",
    name: "Ganesha Keychain",
    category: "Keychains",
    tags: ["Keychains", "Idols"],
    isNew: true,
    featured: true,
    price: "",
    images: [
      "images/products/ganesha-keychain-1.jpg",
      "images/products/ganesha-keychain-2.jpg",
      "images/products/ganesha-keychain-3.jpg",
      "images/products/ganesha-keychain-4.jpg",
    ],
    highlights: [
      "Smiling Bal Ganesha with blessing hand and modak",
      "Fine detailing on crown, tilak and necklace",
      "Sturdy metal key ring",
      "A lucky charm for new keys, homes and vehicles",
    ],
  },
  {
    id: "bal-krishna-flute-keychain",
    name: "Bal Krishna Flute Keychain",
    category: "Keychains",
    tags: ["Keychains", "Idols"],
    isNew: true,
    featured: true,
    price: "",
    images: [
      "images/products/bal-krishna-flute-keychain-1.jpg",
      "images/products/bal-krishna-flute-keychain-2.jpg",
      "images/products/bal-krishna-flute-keychain-3.jpg",
      "images/products/bal-krishna-flute-keychain-4.jpg",
    ],
    highlights: [
      "Detailed flute, curls and mor-pankh crown",
      "Doubles as a mini desk figurine",
      "Metal key ring and chain",
      "A sweet gift for Janmashtami",
    ],
  },
  {
    id: "flexi-octopus-keychain",
    name: "Flexi Octopus Keychain",
    category: "Keychains",
    tags: ["Keychains", "Fidget"],
    isNew: false,
    featured: true,
    price: "",
    images: [
      "images/products/flexi-octopus-keychain-1.jpg",
      "images/products/flexi-octopus-keychain-2.jpg",
      "images/products/flexi-octopus-keychain-3.jpg",
      "images/products/flexi-octopus-keychain-4.jpg",
    ],
    highlights: [
      "Eight jointed, flexible tentacles",
      "Cute face with eye detailing",
      "Comes on a metal key ring",
      "Loved by kids and collectors alike",
    ],
  },
  {
    id: "flexi-shark-keychain",
    name: "Flexi Shark Keychain",
    category: "Keychains",
    tags: ["Keychains", "Fidget"],
    isNew: false,
    featured: false,
    price: "",
    images: [
      "images/products/flexi-shark-keychain-1.jpg",
      "images/products/flexi-shark-keychain-2.jpg",
      "images/products/flexi-shark-keychain-3.jpg",
      "images/products/flexi-shark-keychain-4.jpg",
    ],
    highlights: [
      "Articulated body that swishes and swims",
      "Fins and tail sculpted in detail",
      "Sturdy metal key ring and chain",
      "Great as a return gift or bag charm",
    ],
  },
  {
    id: "hexagon-spiral-fidget-keychain",
    name: "Hexagon Spiral Fidget Keychain",
    category: "Keychains",
    tags: ["Keychains", "Fidget"],
    isNew: false,
    featured: false,
    price: "",
    images: [
      "images/products/hexagon-spiral-fidget-keychain-1.jpg",
      "images/products/hexagon-spiral-fidget-keychain-2.jpg",
      "images/products/hexagon-spiral-fidget-keychain-3.jpg",
      "images/products/hexagon-spiral-fidget-keychain-4.jpg",
    ],
    highlights: [
      "Telescoping layers pop out and push back",
      "Clean geometric design",
      "Lightweight, pocket-friendly size",
      "Comes on a metal key ring and chain",
    ],
  },
  {
    id: "gyro-spinner-keychain",
    name: "Gyro Spinner Keychain",
    category: "Keychains",
    tags: ["Keychains", "Fidget"],
    isNew: false,
    featured: false,
    price: "",
    images: [
      "images/products/gyro-spinner-keychain-1.jpg",
      "images/products/gyro-spinner-keychain-2.jpg",
      "images/products/gyro-spinner-keychain-3.jpg",
      "images/products/gyro-spinner-keychain-4.jpg",
    ],
    highlights: [
      "Multiple free-spinning rings",
      "Folds flat for easy carrying",
      "Smooth, matte-finish rings",
      "Comes on a metal key ring and chain",
    ],
  },
  {
    id: "dragon-scale-gyro-spinner",
    name: "Dragon Scale Gyro Spinner",
    category: "Keychains",
    tags: ["Keychains", "Fidget"],
    isNew: false,
    featured: false,
    price: "",
    images: [
      "images/products/dragon-scale-gyro-spinner-1.jpg",
      "images/products/dragon-scale-gyro-spinner-2.jpg",
      "images/products/dragon-scale-gyro-spinner-3.jpg",
      "images/products/dragon-scale-gyro-spinner-4.jpg",
    ],
    highlights: [
      "Raised dragon-scale texture on the outer ring",
      "Free-spinning nested rings",
      "Folds flat to pocket size",
      "Bold red finish that stands out",
    ],
  },
  {
    id: "phone-stand-keychain",
    name: "Phone Stand Keychain",
    category: "Keychains",
    tags: ["Keychains", "Utility"],
    isNew: false,
    featured: false,
    price: "",
    images: [
      "images/products/phone-stand-keychain-1.jpg",
      "images/products/phone-stand-keychain-2.jpg",
      "images/products/phone-stand-keychain-3.jpg",
      "images/products/phone-stand-keychain-4.jpg",
    ],
    highlights: [
      "Folding support with grip ridges",
      "Holds your phone at a comfortable viewing angle",
      "Folds flat to keychain size",
      "Practical gift for travellers and students",
    ],
  },
  {
    id: "tripod-phone-stand-keychain",
    name: "Tripod Phone Stand Keychain",
    category: "Keychains",
    tags: ["Keychains", "Utility"],
    isNew: true,
    featured: false,
    price: "",
    images: [
      "images/products/tripod-phone-stand-keychain-1.jpg",
      "images/products/tripod-phone-stand-keychain-2.jpg",
      "images/products/tripod-phone-stand-keychain-3.jpg",
      "images/products/tripod-phone-stand-keychain-4.jpg",
    ],
    highlights: [
      "Unfolds into a stable three-leg stand",
      "Hinged cradle holds the phone securely",
      "Legs fold flat for carrying",
      "Comes on a metal key ring and chain",
    ],
  },
  {
    id: "custom-name-keychain",
    name: "Custom Name Keychain",
    category: "Personalised Gifts",
    tags: ["Keychains", "Personalised"],
    isNew: true,
    featured: true,
    price: "",
    images: [
      "images/products/custom-name-keychain-1.jpg",
      "images/products/custom-name-keychain-2.jpg",
      "images/products/custom-name-keychain-3.jpg",
      "images/products/custom-name-keychain-4.jpg",
    ],
    highlights: [
      "Personalised with any name",
      "Two-colour raised lettering",
      "Choose from a range of colour pairs",
      "Ideal for return gifts, school bags and teams",
    ],
  },
  {
    id: "initial-name-keychain",
    name: "Initial & Name Keychain",
    category: "Personalised Gifts",
    tags: ["Keychains", "Personalised"],
    isNew: true,
    featured: true,
    price: "",
    images: [
      "images/products/initial-name-keychain-1.jpg",
      "images/products/initial-name-keychain-2.jpg",
      "images/products/initial-name-keychain-3.jpg",
      "images/products/initial-name-keychain-4.jpg",
    ],
    highlights: [
      "Big initial letter with the full name in flowing script",
      "Two-colour design, printed to order",
      "Choose your own initial, name and colours",
      "A personal gift for birthdays, couples and friends",
    ],
  },
  {
    id: "tree-of-life-heart-keychain",
    name: "Tree of Life Heart Keychain",
    category: "Keychains",
    tags: ["Keychains", "Gifting"],
    isNew: true,
    featured: false,
    price: "",
    images: [
      "images/products/tree-of-life-heart-keychain-1.jpg",
      "images/products/tree-of-life-heart-keychain-2.jpg",
      "images/products/tree-of-life-heart-keychain-3.jpg",
      "images/products/tree-of-life-heart-keychain-4.jpg",
    ],
    highlights: [
      "Fine filigree tree-of-life cut-out",
      "Multiple tree designs available",
      "Light and slim for keys or bags",
      "Lovely for anniversaries and friendship days",
    ],
  },
  {
    id: "nfc-instagram-keychain",
    name: "NFC Instagram Keychain",
    category: "Personalised Gifts",
    tags: ["Keychains", "Smart"],
    isNew: true,
    featured: true,
    price: "",
    images: [
      "images/products/nfc-instagram-keychain-1.jpg",
      "images/products/nfc-instagram-keychain-2.jpg",
      "images/products/nfc-instagram-keychain-3.jpg",
      "images/products/nfc-instagram-keychain-4.jpg",
    ],
    highlights: [
      "Built-in NFC chip, programmed with your profile link",
      "Tap to open your Instagram profile on any NFC phone",
      "No app or battery needed",
      "Available in black & white or red & white",
    ],
  },
  {
    id: "shubh-labh-lotus-decor",
    name: "Shubh Labh Lotus Décor",
    category: "Festive Décor",
    tags: ["Festive Décor"],
    isNew: false,
    featured: true,
    price: "",
    images: [
      "images/products/shubh-labh-lotus-decor-1.jpg",
      "images/products/shubh-labh-lotus-decor-2.jpg",
      "images/products/shubh-labh-lotus-decor-3.jpg",
      "images/products/shubh-labh-lotus-decor-4.jpg",
    ],
    highlights: [
      "Set of two matching pieces",
      "Deep lotus and leaf relief detailing",
      "Ideal for Diwali, housewarmings and new shop openings",
      "Lightweight and easy to mount",
    ],
  },
  {
    id: "adjustable-desk-phone-stand",
    name: "Adjustable Desk Phone Stand",
    category: "Desk Accessories",
    tags: ["Desk Accessories"],
    isNew: false,
    featured: false,
    price: "",
    images: [
      "images/products/adjustable-desk-phone-stand-1.jpg",
      "images/products/adjustable-desk-phone-stand-2.jpg",
      "images/products/adjustable-desk-phone-stand-3.jpg",
      "images/products/adjustable-desk-phone-stand-4.jpg",
    ],
    highlights: [
      "Viewing angle adjusts with the side knob",
      "Ribbed grip surfaces keep your phone steady",
      "Charging-cable slot in the front ledge",
      "Wide rounded base for stability on any desk",
    ],
  },
  {
    id: "voronoi-planter",
    name: "Voronoi Planter",
    category: "Home & Garden",
    tags: ["Home & Garden"],
    isNew: true,
    featured: false,
    price: "",
    images: [
      "images/products/voronoi-planter-1.jpg",
      "images/products/voronoi-planter-2.jpg",
      "images/products/voronoi-planter-3.jpg",
      "images/products/voronoi-planter-4.jpg",
    ],
    highlights: [
      "Stone-like textured outer finish",
      "Organic Voronoi lattice base",
      "Drainage hole to keep roots healthy",
      "Sized for succulents, cacti and desk plants",
    ],
  },

  /* ➜ ADD NEW PRODUCTS BELOW THIS LINE (copy a block from above) */
];
