import { PropertyType } from "@prisma/client";

export const siteConfig = {
  name: "The Shivara Group",
  shortName: "Shivara",
  tagline: "Premium Real Estate",
  description:
    "Premium real estate consultancy for verified residences, villas, plots, commercial spaces, and site-visit-led property guidance across Bareilly and Delhi NCR.",
  phone: "+91 7060788407",
  phoneHref: "tel:+917060788407",
  whatsapp: "917060788407",
  whatsappHref:
    "https://wa.me/917060788407?text=Hi%20The%20Shivara%20Group%2C%20I%20want%20to%20book%20a%20property%20consultation.",
  instagram: "https://www.instagram.com/theshivaragroup",
  instagramHandle: "@theshivaragroup",
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
  { value: "100+", label: "curated enquiries managed", note: "CRM-backed process" },
  { value: "5", label: "priority property categories", note: "Homes, villas, plots & more" },
  { value: "2", label: "high-intent markets", note: "Bareilly + Delhi NCR" },
  { value: "24h", label: "site visit coordination", note: "subject to availability" },
];

export const propertyCategories = [
  "Luxury Apartments",
  "Premium Villas",
  "Residential Plots",
  "Commercial Spaces",
  "Farmhouse Land",
];

export const categoryShowcase = [
  {
    title: "Luxury Apartments",
    description: "Elevated residences for families who want location, convenience, and polished amenities.",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?type=APARTMENT",
  },
  {
    title: "Premium Villas",
    description: "Independent living, private spaces, and a more refined ownership experience.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?type=VILLA",
  },
  {
    title: "Residential Plots",
    description: "Land opportunities for buyers planning long-term homes or investment-led ownership.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?type=PLOT",
  },
  {
    title: "Commercial Spaces",
    description: "Retail and commercial opportunities aligned to access, visibility, and business fit.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    href: "/properties?type=COMMERCIAL",
  },
];

export const searchSuggestions = [
  "Civil Lines",
  "Aurika",
  "3 BHK",
  "Villa",
  "Plot",
  "Site Visit",
];

export const services = [
  {
    title: "Property Consultation",
    description:
      "Shortlist verified options around your budget, location preference, possession timeline, and lifestyle goals.",
    cta: "Get consultation",
  },
  {
    title: "Site Visit Management",
    description:
      "Schedule guided visits, compare projects, and receive clear next steps after every property walkthrough.",
    cta: "Book site visit",
  },
  {
    title: "Investment Advisory",
    description:
      "Understand location growth, inventory quality, exit potential, and long-term fit before committing capital.",
    cta: "Discuss investment",
  },
  {
    title: "Home Loan Assistance",
    description:
      "Coordinate documentation and connect with verified loan support after property selection.",
    cta: "Check eligibility",
  },
  {
    title: "Commercial Property Search",
    description:
      "Find retail, office, and commercial opportunities aligned to visibility, footfall, and business needs.",
    cta: "Explore commercial",
  },
  {
    title: "End-to-End Buyer Support",
    description:
      "From first enquiry to negotiation, booking support, and post-visit follow-ups — managed through CRM.",
    cta: "Start enquiry",
  },
];

export const trustHighlights = [
  "Verified property guidance",
  "Transparent follow-up process",
  "Dedicated consultant support",
  "WhatsApp-first communication",
  "Site visit coordination",
  "No invented listings or fake details",
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
    title: "Transparent placeholders",
    text: "Ratings, awards, address, and partners stay marked for manual completion until officially verified.",
  },
];

export const investmentHighlights = [
  {
    title: "Emerging residential pockets",
    metric: "Location-led",
    text: "Shortlist micro-markets by access, family convenience, and long-term livability.",
  },
  {
    title: "Villa & plot opportunities",
    metric: "Asset-led",
    text: "Compare land, independent living, and project-led appreciation narratives before visiting.",
  },
  {
    title: "Commercial visibility",
    metric: "Use-case-led",
    text: "Evaluate storefront/office potential through access, footfall, and business-fit conversations.",
  },
];

export const partnerPlaceholders = [
  "Banking partner details pending verification",
  "Legal/documentation partner pending verification",
  "Google rating pending official confirmation",
  "Office address pending manual completion",
];

export const processSteps = [
  {
    step: "01",
    title: "Share requirement",
    text: "Tell us your budget, preferred location, property type, and timeline.",
  },
  {
    step: "02",
    title: "Curated shortlist",
    text: "We align real inventory and public project highlights to your needs.",
  },
  {
    step: "03",
    title: "Guided site visit",
    text: "Visit shortlisted projects with a clear comparison framework.",
  },
  {
    step: "04",
    title: "Decision support",
    text: "Get negotiation, documentation, and next-step guidance from the team.",
  },
];

export const testimonials = [
  {
    quote:
      "The Shivara Group helped us compare options clearly and arranged a site visit without pressure.",
    name: "Client feedback",
    meta: "Manual testimonial verification recommended",
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
    meta: "Replace with verified Google review",
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
      "Public information confirms Bareilly and Delhi NCR coverage. More micro-location details can be added after manual business confirmation.",
  },
  {
    question: "Do you provide home loan assistance?",
    answer:
      "The site includes loan assistance as a consultation CTA. Final partners and eligibility checks should be confirmed manually by the business team.",
  },
];

export const fallbackProperties = [
  {
    id: "aurika-the-residences",
    title: "Aurika The Residences",
    description:
      "A premium residential opportunity publicly highlighted by The Shivara Group. Request verified pricing, floor plans, and current availability before booking.",
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
      "A premium villa community reference from The Shivara Group's public content. Confirm unit inventory, specifications, and pricing directly.",
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
      "3BHK home opportunity in Rajendar Nagar, Bareilly. Request exact unit details, floor options, and current availability from the team.",
    price: "Contact for pricing",
    location: "Rajendar Nagar, Bareilly",
    type: PropertyType.APARTMENT,
    bedrooms: 3,
    bathrooms: null,
    area: "Details on request",
    amenities: ["3BHK Homes", "Prime Location", "Family Homes", "Call for Details"],
    images: [],
    isActive: true,
    isFeatured: true,
  },
  {
    id: "flower-city-bareilly",
    title: "Flower City, Bareilly",
    description:
      "Investment/property highlight referenced in public content. Confirm official pricing, registry status, and inventory before publishing final booking details.",
    price: "Contact for pricing",
    location: "Bareilly",
    type: PropertyType.PLOT,
    bedrooms: null,
    bathrooms: null,
    area: "Details on request",
    amenities: [
      "Investment Highlight",
      "Bareilly",
      "Inventory on Request",
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
