import { PropertyType } from "@prisma/client";

export const siteConfig = {
  name: "The Shivara Group",
  shortName: "Shivara",
  tagline: "Bespoke Real Estate Strategies",
  brandLine: "Defining Legacies, One Address at a Time.",
  description:
    "Bespoke real estate strategy and portfolio guidance for premium homes, plots, villas, off-market opportunities, and investment-led property decisions across Bareilly and Delhi NCR.",
  phone: "+91 7060788407",
  phoneHref: "tel:+917060788407",
  whatsapp: "917060788407",
  whatsappHref:
    "https://wa.me/917060788407?text=Hi%20The%20Shivara%20Group%2C%20I%20want%20to%20book%20a%20property%20consultation.",
  instagram: "https://www.instagram.com/theshivaragroup",
  instagramHandle: "@theshivaragroup",
  founderInstagram: "https://www.instagram.com/the_shivamsahani",
  founderInstagramHandle: "@the_shivamsahani",
  location: "Bareilly, Uttar Pradesh",
  coverage: "Bareilly • Delhi NCR",
  email: "",
  address: "",
  mapsUrl: "",
  workingHours: "",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Properties", href: "/properties" },
  { label: "Contact", href: "/contact" },
] as const;

export const publicStats = [
  { value: "15", label: "public Instagram posts", note: "brand content source" },
  { value: "6+", label: "priority asset classes", note: "Homes, villas, plots & portfolios" },
  { value: "2", label: "high-intent markets", note: "Bareilly + Delhi NCR" },
  { value: "1", label: "direct consultant number", note: "Call or WhatsApp" },
];

export const propertyCategories = [
  "Luxury Residences",
  "Premium Kothis",
  "3 BHK Homes",
  "Residential Plots",
  "Villa Communities",
  "Commercial Spaces",
  "Off-Market Portfolios",
];

export const categoryShowcase = [
  {
    title: "Luxury Residences",
    description: "Premium apartments and residences with modern amenities, better views, and guided site visits.",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?type=APARTMENT",
  },
  {
    title: "Premium Kothis & Villas",
    description: "Independent homes, park-facing kothis, and villa communities for refined family living.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?type=VILLA",
  },
  {
    title: "Residential Plots",
    description: "Plot inventory and investment-led residential land opportunities, subject to direct confirmation.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?type=PLOT",
  },
  {
    title: "Delhi NCR Portfolios",
    description: "High-value NCR opportunities including serviced apartments, golf-linked residences, and off-market portfolios.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?type=COMMERCIAL",
  },
];

export const searchSuggestions = [
  "Aurika",
  "Rajendar Nagar",
  "Godrej Golf Links",
  "Bento by Gaurs",
  "3 BHK",
  "240 Gaj Kothi",
  "Site Visit",
];

export const services = [
  {
    title: "Bespoke Property Strategy",
    description:
      "A tailored property strategy around your budget, location preference, lifestyle, possession timeline, and long-term legacy goals.",
    cta: "Get consultation",
  },
  {
    title: "Site Visit Management",
    description:
      "Schedule guided visits for homes, plots, villas, and premium projects with clear next steps after every walkthrough.",
    cta: "Book site visit",
  },
  {
    title: "Portfolio Management",
    description:
      "Curated portfolio guidance for investors comparing Bareilly, Delhi NCR, Noida, Greater Noida, and Yamuna Expressway opportunities.",
    cta: "Discuss portfolio",
  },
  {
    title: "Off-Market Opportunities",
    description:
      "Discreet access to high-value opportunities and premium inventories where direct confirmation is required before sharing details.",
    cta: "Request access",
  },
  {
    title: "Floor Plans, Pricing & Inventory",
    description:
      "Request pricing, floor plans, availability, and exact inventory through call, WhatsApp, or site-visit enquiry.",
    cta: "Request details",
  },
  {
    title: "End-to-End Buyer Support",
    description:
      "From Instagram enquiry to shortlist, site visit, pricing discussion, documentation support, and CRM-backed follow-up.",
    cta: "Start enquiry",
  },
];

export const trustHighlights = [
  "Bespoke real estate strategy",
  "Bareilly + Delhi NCR focus",
  "Off-market portfolio guidance",
  "Floor plans and pricing on request",
  "WhatsApp-first communication",
  "Guided site visit coordination",
];

export const credibilityCards = [
  {
    title: "Verified before booking",
    text: "Pricing, inventory, and final availability are confirmed manually before a customer moves ahead.",
  },
  {
    title: "CRM-backed follow-up",
    text: "Every enquiry is captured into a lead workflow so conversations do not disappear inside DMs.",
  },
  {
    title: "Site-visit-first guidance",
    text: "Premium property decisions are supported by appointment-led visits and direct consultant calls.",
  },
  {
    title: "Clear next steps",
    text: "Customers get direct confirmation for pricing, visit slots, documents, and availability before moving ahead.",
  },
];

export const investmentHighlights = [
  {
    title: "Bareilly luxury homes",
    metric: "Lifestyle-led",
    text: "Rajendar Nagar homes, park-facing kothis, premium apartments, and family-first residences.",
  },
  {
    title: "Aurika plots & communities",
    metric: "Inventory-led",
    text: "Residential plots, sold-out villa signals, commercial zone references, and site-visit-led verification.",
  },
  {
    title: "Delhi NCR portfolios",
    metric: "Portfolio-led",
    text: "Godrej Golf Links, Bento by Gaurs, serviced apartments, and high-value NCR opportunities.",
  },
];

export const partnerPlaceholders = [
  "Home loan guidance available on request",
  "Documentation support after property selection",
  "Google reviews and client feedback coming soon",
  "Private consultations available by appointment",
];

export const processSteps = [
  {
    step: "01",
    title: "DM or call",
    text: "Share your requirement on Instagram, WhatsApp, or phone with budget, location, and timeline.",
  },
  {
    step: "02",
    title: "Curated shortlist",
    text: "The team matches your requirement with available homes, plots, projects, or portfolio opportunities.",
  },
  {
    step: "03",
    title: "Guided site visit",
    text: "Request pricing, floor plans, and schedule a verified site visit before making a decision.",
  },
  {
    step: "04",
    title: "Portfolio support",
    text: "Move forward with negotiation, documentation, booking, or investment portfolio guidance.",
  },
];

export const testimonials = [
  {
    quote:
      "The Shivara Group helped us compare options clearly and arranged a site visit without pressure.",
    name: "Buyer feedback",
    meta: "Site visit support",
  },
  {
    quote:
      "Their WhatsApp-first communication made the property search simple for our family.",
    name: "Buyer enquiry",
    meta: "Public testimonial pending",
  },
  {
    quote:
      "Good guidance for understanding locations, budget fit, and next steps before booking.",
    name: "Consultation note",
    meta: "Property consultation",
  },
];

export const faqs = [
  {
    question: "Does The Shivara Group share verified property details?",
    answer:
      "Yes. The website uses publicly available project references and CRM-backed enquiries. Pricing, availability, and official inventory should be confirmed directly with the team before booking.",
  },
  {
    question: "Can I book a site visit from the website?",
    answer:
      "Yes. Use the Book Site Visit form or WhatsApp CTA. A consultant will confirm the date, time, and meeting location.",
  },
  {
    question: "Which locations do you cover?",
    answer:
      "The official Instagram bio confirms Bareilly and Delhi NCR. Public posts also reference Bareilly, Rajendar Nagar, Noida, Greater Noida, and Yamuna Expressway opportunities.",
  },
  {
    question: "Do you provide home loan assistance?",
    answer:
      "The site includes loan assistance as a consultation CTA. Final partners and eligibility checks should be confirmed manually by the business team.",
  },
];

export const fallbackProperties = [
  {
    id: "park-facing-240-gaj-kothi",
    title: "Park-Facing 240 Gaj Kothi",
    description:
      "A public Instagram listing highlighting a spacious 240 Gaj built-up kothi in a peaceful, premium Bareilly neighbourhood facing a lush green park. Pricing, floor plans, and visit slots must be confirmed directly.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.VILLA,
    bedrooms: null,
    bathrooms: null,
    area: "240 Gaj built-up",
    amenities: [
      "Park Facing",
      "Ready to Move",
      "Prime Location",
      "Site Visit Available",
    ],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "aurika-the-residences",
    title: "Aurika The Residences",
    description:
      "A premium residential opportunity publicly highlighted by The Shivara Group with development work, elite community living, commercial-zone reference, and limited plot/inventory messaging. Request verified pricing, floor plans, and current availability before booking.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.APARTMENT,
    bedrooms: null,
    bathrooms: null,
    area: "Floor plans on request",
    amenities: [
      "Premium Residences",
      "Site Visit Available",
      "Floor Plans on Request",
      "Verified Guidance",
    ],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "amara-villas-bareilly",
    title: "Amara Villas by Aurika",
    description:
      "A premium villa community reference from The Shivara Group's public content. Instagram messaging indicates villas may be sold out, so confirm any resale/new inventory, specifications, and pricing directly.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.VILLA,
    bedrooms: null,
    bathrooms: null,
    area: "Details on request",
    amenities: [
      "Villa Community",
      "Premium Living",
      "Site Visit Available",
      "Pricing on Request",
    ],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "the-residences-plots",
    title: "The Residences by Aurika — Plots",
    description:
      "Residential plot ownership opportunity referenced in public Shivara content. Speak to the team for approved inventory and site visit slots.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.PLOT,
    bedrooms: null,
    bathrooms: null,
    area: "Details on request",
    amenities: [
      "Residential Plots",
      "Aurika",
      "Investment Friendly",
      "Site Visit Available",
    ],
    images: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: "rajendar-nagar-3bhk",
    title: "Rajendar Nagar 3BHK Homes",
    description:
      "Ready-to-move 3BHK home opportunity in Rajendar Nagar, Bareilly, publicly described with modern architecture, designer finishes, natural light, and prime neighbourhood positioning. Request exact unit details, floor options, and current availability from the team.",
    price: "Contact for pricing",
    location: "Rajendar Nagar, Bareilly",
    type: PropertyType.APARTMENT,
    bedrooms: 3,
    bathrooms: null,
    area: "Up to 200 Gaj reference",
    amenities: ["3BHK Homes", "Ready to Move", "Designer Finishes", "Prime Bareilly Location"],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "singaporean-luxury-bareilly",
    title: "Singaporean Luxury Project, Bareilly",
    description:
      "A public Shivara showcase describing a Singapore-based developer project in Bareilly with 4 towers, swimming pool, basketball court, modern 360° views, greenery, and active construction. Confirm official project name, pricing, floor plans, and inventory directly.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.APARTMENT,
    bedrooms: null,
    bathrooms: null,
    area: "Details on request",
    amenities: [
      "4 Towers",
      "Swimming Pool",
      "Basketball Court",
      "Construction in Progress",
    ],
    images: [],
    isActive: true,
    isFeatured: false,
  },
  {
    id: "godrej-golf-links-final-phase",
    title: "Godrej Golf Links — Final Phase",
    description:
      "Delhi NCR portfolio opportunity publicly referenced by The Shivara Group: final phase of residential towers within an established golf-linked township near Greater Noida/Pari Chowk. Confirm pricing, payment plan, inventory, and official documents directly.",
    price: "Starting reference ₹4.5 Cr onwards",
    location: "Greater Noida / Delhi NCR",
    type: PropertyType.APARTMENT,
    bedrooms: 3,
    bathrooms: null,
    area: "3 & 4 BHK residences",
    amenities: [
      "Golf-Facing Views",
      "Established Township",
      "Low-Density Enclave",
      "Portfolio Opportunity",
    ],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "bento-by-gaurs-yamuna-expressway",
    title: "BENTO by Gaurs — Yamuna Expressway",
    description:
      "Ultra-premium serviced apartment opportunity publicly highlighted by The Shivara Group near Yamuna Expressway and the upcoming Noida International Airport. Confirm launch status, pricing, floor plans, and availability directly.",
    price: "Pre-launch reference ₹85 Lakhs*",
    location: "Yamuna Expressway / Noida NCR",
    type: PropertyType.COMMERCIAL,
    bedrooms: null,
    bathrooms: null,
    area: "660–675 sq ft reference",
    amenities: [
      "Serviced Apartments",
      "Fully Furnished",
      "Centrally Air-Conditioned",
      "Site Visit Available",
    ],
    images: [],
    isActive: true,
    isFeatured: false,
  },
];

export const sampleSeedTitles = new Set([
  "3 BHK Premium Apartment — Civil Lines",
  "Luxury 4 BHK Villa — Pilibhit Road",
  "Residential Plot — Cantt Area",
  "Commercial Shop — Kutchery Road",
  "2 BHK Ready-to-Move Apartment — Subhash Nagar",
  "Farmhouse with Agricultural Land — Nawabganj Road",
]);

export type PublicProperty = {
  id: string;
  title: string;
  description: string;
  price: string;
  location: string;
  type: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  amenities: string[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
};
