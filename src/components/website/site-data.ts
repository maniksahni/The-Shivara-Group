import { PropertyType } from "@prisma/client";

export const siteConfig = {
  name: "The Shivara Group",
  shortName: "Shivara",
  tagline: "Exceptional Properties. Thoughtfully Chosen.",
  brandLine: "Defining Legacies, One Address at a Time.",
  description:
    "Premium real estate advisory for luxury homes, villas, plots, and investment opportunities across Bareilly and Delhi NCR. Transparent information, guided site visits, and bespoke property consultation.",
  phone: "+91 7060788407",
  phoneHref: "tel:+917060788407",
  whatsapp: "917060788407",
  whatsappHref:
    "https://wa.me/917060788407?text=Hi%20Shivara%20Group%2C%20I%20am%20interested%20in%20property%20options%20in%20Bareilly%20and%20Delhi%20NCR.%20Please%20share%20details.",
  instagram: "https://www.instagram.com/theshivaragroup",
  instagramHandle: "@theshivaragroup",
  founderInstagram: "https://www.instagram.com/the_shivamsahani",
  founderInstagramHandle: "@the_shivamsahani",
  location: "Bareilly, Uttar Pradesh",
  coverage: "Bareilly • Delhi NCR",
  email: "contact@theshivaragroup.com",
  address: "Civil Lines & Rajendra Nagar, Bareilly, UP — 243122",
  mapsUrl: "",
  workingHours: "Mon – Sat: 9:30 AM – 7:30 PM",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const publicStats = [
  { value: "24h", label: "Consultation response", note: "Call or WhatsApp" },
  { value: "6+", label: "Property categories", note: "Homes, villas, plots & portfolios" },
  { value: "2", label: "Priority markets", note: "Bareilly + Delhi NCR" },
  { value: "100%", label: "Guided discovery", note: "Shortlist before site visit" },
];

export const categoryShowcase = [
  {
    title: "Luxury Residences",
    description: "Premium apartments and penthouses with modern amenities, refined interiors, and guided site visits.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    href: "/properties?type=APARTMENT",
  },
  {
    title: "Premium Kothis & Villas",
    description: "Independent homes, park-facing kothis, and gated villa communities for multi-generational living.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    href: "/properties?type=VILLA",
  },
  {
    title: "Residential Plots",
    description: "Approved plot inventory and investment-led residential land opportunities in prime growth corridors.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
    href: "/properties?type=PLOT",
  },
  {
    title: "Delhi NCR Portfolios",
    description: "High-value NCR opportunities including serviced apartments, golf-linked residences, and off-market portfolios.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
    href: "/properties?location=Delhi+NCR",
  },
];

export const searchSuggestions = [
  "240 Gaj Kothi",
  "Rajendra Nagar",
  "Aurika Bareilly",
  "Pilibhit Road",
  "Godrej Golf Links",
  "Bento by Gaurs",
  "Ready to Move",
  "Plots Bareilly",
];

export const filterLocations = [
  "All Locations",
  "Bareilly",
  "Rajendra Nagar",
  "Pilibhit Road",
  "Delhi NCR",
  "Noida",
  "Greater Noida",
  "Yamuna Expressway",
];

export const filterPropertyTypes = [
  { value: "ALL", label: "All Types" },
  { value: "VILLA", label: "Villa / Kothi" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "FARMHOUSE", label: "Farmhouse" },
];

export const filterBudgets = [
  { label: "All Budgets", value: "ALL" },
  { label: "Under ₹50 Lakh", value: "UNDER_50L", max: 5000000 },
  { label: "₹50 Lakh – ₹1 Crore", value: "50L_1CR", min: 5000000, max: 10000000 },
  { label: "₹1–2 Crore", value: "1CR_2CR", min: 10000000, max: 20000000 },
  { label: "₹2–5 Crore", value: "2CR_5CR", min: 20000000, max: 50000000 },
  { label: "₹5 Crore+", value: "5CR_PLUS", min: 50000000 },
];

export const filterBedrooms = [
  { label: "All BHK", value: "ALL" },
  { label: "2 BHK", value: 2 },
  { label: "3 BHK", value: 3 },
  { label: "4 BHK", value: 4 },
  { label: "5+ BHK", value: 5 },
];

export const filterStatuses = [
  "All Status",
  "Ready to Move",
  "Under Construction",
  "New Launch",
  "Available",
  "Sold",
];

export const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export const whyShivaraCards = [
  {
    title: "Verified Properties",
    description:
      "Curated inventory reviewed by our team. Key details, availability status, and on-ground progress are checked before shortlisting.",
    badge: "Verified",
  },
  {
    title: "Transparent Information",
    description:
      "Clear price indications, honest specifications, authentic imagery, and no inflated claims. What you see is what we present.",
    badge: "Transparency",
  },
  {
    title: "Local Market Expertise",
    description:
      "Deep micro-market knowledge across Bareilly neighbourhoods and Delhi NCR high-growth corridors to guide your timing and valuation.",
    badge: "Expertise",
  },
  {
    title: "Site Visit Assistance",
    description:
      "Private, escorted site walkthroughs arranged at your convenience. Review approaches, neighborhood infrastructure, and build quality.",
    badge: "Guided Visits",
  },
  {
    title: "Documentation Guidance",
    description:
      "Guidance through registry procedures, layout plans, and developer documentation, with emphasis on independent legal confirmation.",
    badge: "Advisory",
  },
  {
    title: "Personalized Property Advisory",
    description:
      "One-on-one consultation focused entirely on your family's requirements, lifestyle preferences, and long-term capital goals.",
    badge: "Bespoke",
  },
];

export const verificationSteps = [
  {
    step: "01",
    title: "Property Source Verification",
    description:
      "We source exclusively through established developers, direct owners, and verified channel partners across Bareilly and Delhi NCR.",
  },
  {
    step: "02",
    title: "Project & Information Review",
    description:
      "Our team conducts an initial review of available documentation, public approvals, layout maps, and project registration details.",
  },
  {
    step: "03",
    title: "Availability Confirmation",
    description:
      "Before recommending any property, we confirm current inventory status, unit availability, and possession timelines.",
  },
  {
    step: "04",
    title: "Price & Cost Structure Clarity",
    description:
      "We clarify basic sale prices, registration estimates, maintenance charges, and payment schedules directly with the seller.",
  },
  {
    step: "05",
    title: "Escorted Site Visit",
    description:
      "A dedicated Shivara advisor accompanies you for a comprehensive on-ground inspection of the site, approach roads, and surroundings.",
  },
  {
    step: "06",
    title: "Documentation Guidance",
    description:
      "We provide step-by-step assistance with booking paperwork and strongly recommend independent legal verification before final transaction.",
  },
];

export const advisoryDisclaimer =
  "Disclaimer: The Shivara Group operates as an independent real estate advisory and marketing consultancy. While information is reviewed and confirmed where applicable, property details, prices, layouts, and availability are subject to change by developers or owners. Buyers and investors are advised to independently verify all title deeds, municipal approvals, and legal documents prior to entering into any financial or contractual transaction.";

export const services = [
  {
    title: "Buy Property",
    description:
      "Find verified homes, luxury apartments, park-facing villas, and residential plots with consultant-led shortlisting.",
    cta: "Explore Buying",
  },
  {
    title: "Sell Property",
    description:
      "Position your premium property with professional presentation, buyer intent qualification, and dedicated relationship management.",
    cta: "List With Us",
  },
  {
    title: "Investment Advisory",
    description:
      "Curated portfolio guidance for investors comparing Bareilly prime pockets, Noida, Greater Noida, and Yamuna Expressway corridors.",
    cta: "Plan Investment",
  },
  {
    title: "Site Visit Assistance",
    description:
      "Private, escorted walkthroughs for homes, villas, plots, and projects with detailed locality briefings.",
    cta: "Book Site Visit",
  },
  {
    title: "Documentation Guidance",
    description:
      "Navigate paperwork, booking-stage checklists, and registry coordination with transparent advisory support.",
    cta: "Get Guidance",
  },
  {
    title: "Commercial Advisory",
    description:
      "Evaluate commercial corridors, high-street retail, road frontages, and growth potential before capital allocation.",
    cta: "Explore Commercial",
  },
];

export const trustHighlights = [
  "Verified property information",
  "Bareilly & Delhi NCR focus",
  "Off-market portfolio guidance",
  "Floor plans and pricing on request",
  "WhatsApp-first advisory",
  "Private site visit coordination",
];

export const bareillyGuide = [
  {
    zone: "Rajendra Nagar",
    signal: "Family-first established living",
    insight:
      "Bareilly's premier established residential hub. Renowned for ready-to-move 3BHK homes, tree-lined avenues, top schools, and settled community life.",
  },
  {
    zone: "Aurika Corridor",
    signal: "High-growth lifestyle corridor",
    insight:
      "Fast-emerging master-planned pocket featuring gated villa enclaves, plotted developments, and modern community amenities.",
  },
  {
    zone: "Pilibhit Road & Prime Belts",
    signal: "Spacious independent luxury",
    insight:
      "Favored for large 240+ Gaj kothis, independent villas, expansive plots, and seamless connectivity to bypass highways.",
  },
  {
    zone: "Civil Lines & Cantt Area",
    signal: "Heritage & elite prestige",
    insight:
      "Central Bareilly's historic green zone, offering premium access to administrative hubs, clubs, and elite residences.",
  },
  {
    zone: "Delhi NCR Portfolio",
    signal: "Capital growth & rental yields",
    insight:
      "High-value diversification in Greater Noida (Godrej Golf Links) and Yamuna Expressway near the upcoming Noida International Airport.",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Share Requirement",
    text: "Specify your preferred location, property type, budget, and timeline through our site or WhatsApp.",
  },
  {
    step: "02",
    title: "Curated Shortlist",
    text: "Our advisor analyzes available inventory and presents handpicked options matching your criteria.",
  },
  {
    step: "03",
    title: "Private Site Visit",
    text: "Inspect shortlisted properties with an escorted advisor walkthrough, layout review, and neighborhood assessment.",
  },
  {
    step: "04",
    title: "Commercial Negotiation",
    text: "Move forward with complete pricing clarity, payment plan negotiations, and seller coordination.",
  },
  {
    step: "05",
    title: "Documentation Review",
    text: "Receive guided assistance through booking forms, title checks, and registry paperwork.",
  },
  {
    step: "06",
    title: "Confident Booking",
    text: "Conclude your property transaction with transparency, peace of mind, and lasting relationship support.",
  },
];

export const faqs = [
  {
    question: "How does Shivara verify properties?",
    answer:
      "We conduct an initial multi-point review: checking developer standing, direct owner authorization, project approvals where applicable, on-ground construction progress, and realistic market pricing before showcasing any property.",
  },
  {
    question: "Do you make legal title guarantees?",
    answer:
      "No. Shivara acts strictly as a property advisory and marketing consultant. While our team reviews public documents and project registrations, we explicitly advise all clients to have legal title documents independently verified by legal counsel before executing financial transactions.",
  },
  {
    question: "Can I book a private site visit directly?",
    answer:
      "Yes. You can schedule a private site visit via the Book Site Visit button on any property card, through our enquiry form, or directly on WhatsApp (+91 7060788407). Our advisor coordinates the visit at your convenience.",
  },
  {
    question: "Which geographic areas do you cover?",
    answer:
      "Our core operational focus is Bareilly (Rajendra Nagar, Pilibhit Road, Aurika corridor, Civil Lines) and strategic Delhi NCR growth markets (Noida, Greater Noida, and Yamuna Expressway corridor).",
  },
  {
    question: "Are prices listed on the website final?",
    answer:
      "Prices shown serve as indicative starting price points or price-on-request. Final pricing, payment schedules, and any additional charges (taxes, registry, maintenance) are confirmed directly with developers or owners during the negotiation stage.",
  },
  {
    question: "What types of properties do you advise on?",
    answer:
      "We handle luxury independent villas, park-facing kothis, premium multi-story apartments, approved residential plots, commercial investment assets, and serviced suites.",
  },
];

export type PublicProperty = {
  id: string;
  title: string;
  description: string;
  price: string;
  priceNumeric?: number;
  location: string;
  microLocation?: string;
  type: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  status: "Ready to Move" | "Under Construction" | "New Launch" | "Available" | "Sold";
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  amenities: string[];
  highlights?: string[];
  specifications?: Record<string, string>;
  nearbyLandmarks?: Array<{ name: string; distance: string }>;
  images: string[];
  floorPlanAvailable?: boolean;
};

export const fallbackProperties: PublicProperty[] = [
  {
    id: "park-facing-240-gaj-kothi",
    title: "240 Gaj Park-Facing Kothi",
    description:
      "An impeccably designed, independent 240 Gaj built-up kothi situated in a tranquil, prestigious enclave of Bareilly directly fronting an expansive green park. Features expansive double-height living spaces, premium marble flooring, private terrace gardens, dedicated covered parking, and an airy south-facing orientation providing abundant natural light throughout the year.",
    price: "Price on Request",
    priceNumeric: 18500000,
    location: "Rajendra Nagar, Bareilly",
    microLocation: "Rajendra Nagar",
    type: PropertyType.VILLA,
    bedrooms: 4,
    bathrooms: 4,
    area: "240 Gaj (approx. 2,160 sq ft plot)",
    status: "Ready to Move",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    amenities: [
      "Park Facing",
      "Ready to Move",
      "Private Terrace Garden",
      "Covered Stilt Parking",
      "Wide 40ft Sector Road",
      "Gated Community Security",
      "Water Storage & Borewell",
      "Designer False Ceilings",
    ],
    highlights: [
      "Direct front view of lush green municipal park",
      "4 spacious ensuite bedrooms with dressing rooms",
      "Spacious modular kitchen with premium quartz countertops",
      "High ceiling clearance and bespoke woodwork finishes",
    ],
    specifications: {
      "Structure": "Reinforced RCC frame structure with brick infill walls",
      "Flooring": "Italian marble in living/dining; vitrified tiles in bedrooms",
      "Doors & Windows": "Teak wood main door; UPVC sound-insulated glazed windows",
      "Facing": "Park-facing North-East orientation",
      "Possession": "Immediate / Ready to Move",
      "Ownership Type": "Freehold residential registry",
    },
    nearbyLandmarks: [
      { name: "Civil Airport Bareilly", distance: "20 Mins" },
      { name: "Bareilly Railway Junction", distance: "15 Mins" },
      { name: "Apex Hospital", distance: "5 Mins" },
      { name: "Hartmann College", distance: "8 Mins" },
    ],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanAvailable: true,
  },
  {
    id: "aurika-the-residences",
    title: "Aurika The Residences — Luxury Tower",
    description:
      "A flagship luxury high-rise residential landmark in Bareilly crafted for discerning families who value contemporary aesthetics, security, and world-class communal amenities. Enjoy expansive glass balconies overlooking verdant surrounds, club facilities, high-speed elevators, and proximity to Bareilly's evolving commercial avenue.",
    price: "₹75 Lakh – ₹1.25 Cr",
    priceNumeric: 8500000,
    location: "Pilibhit Road, Bareilly",
    microLocation: "Pilibhit Road",
    type: PropertyType.APARTMENT,
    bedrooms: 3,
    bathrooms: 3,
    area: "1,650 – 2,250 sq ft",
    status: "Under Construction",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    amenities: [
      "Grand Double-Height Lobby",
      "Swimming Pool & Kids Splash Deck",
      "Clubhouse & Gymnasium",
      "3-Tier Gated Security",
      "Power Backup 24x7",
      "High-Speed Automatic Elevators",
      "EV Charging Stations",
      "Jogging Track & Zen Garden",
    ],
    highlights: [
      "Modern architectural elevation with double-glazed acoustic facades",
      "Optimal cross-ventilation with large sunlit balconies",
      "Comprehensive clubhouse with indoor games and banquet hall",
      "Strategic connectivity to Bareilly City Centre and Pilibhit Bypass",
    ],
    specifications: {
      "Structure": "Earthquake-resistant RCC shear wall design",
      "Flooring": "Vitrified tiles across all living, dining, and bedroom areas",
      "Kitchen": "Granite counter platform with stainless steel double bowl sink",
      "Bathrooms": "Premium Kohler / Jaquar sanitary fittings and anti-skid tiles",
      "Possession": "Dec 2026 (Phase 1)",
      "Approvals": "RERA registered & development authority sanctioned",
    },
    nearbyLandmarks: [
      { name: "Pilibhit Bypass Highway", distance: "3 Mins" },
      { name: "Bareilly City Railway Station", distance: "12 Mins" },
      { name: "Rohilkhand Medical College", distance: "10 Mins" },
      { name: "Phoenix United Mall", distance: "15 Mins" },
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanAvailable: true,
  },
  {
    id: "amara-villas-bareilly",
    title: "Amara Villas by Aurika",
    description:
      "An exclusive private gated enclave of Mediterranean-inspired luxury villas offering private lawn areas, contemporary double-height ceilings, and superior privacy. Designed for families seeking independent bungalow living coupled with the safety and amenities of an elite gated master community.",
    price: "Price on Request",
    priceNumeric: 22500000,
    location: "Bareilly Outskirts",
    microLocation: "Bareilly",
    type: PropertyType.VILLA,
    bedrooms: 4,
    bathrooms: 5,
    area: "3,200 sq ft built-up",
    status: "Available",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    amenities: [
      "Private Lawn & Deck",
      "Private Splash Pool Provision",
      "Covered 2-Car Parking",
      "Servant Quarters with Bath",
      "Clubhouse Access",
      "Underground Electrification",
      "Perimeter Surveillance",
      "Solar Water Heating Provision",
    ],
    highlights: [
      "Signature Spanish & Mediterranean elevation lines",
      "Private ground-level master bedroom for elder convenience",
      "Lush landscaped green buffer separating adjacent villas",
      "Select resale / developer inventory available on request",
    ],
    specifications: {
      "Structure": "RCC frame with anti-termite foundation treatment",
      "Flooring": "Imported Spanish tile and hardwood laminate in suites",
      "Wiring": "Concealed copper wiring with modular Schneider switches",
      "Water Supply": "24x7 pressurized hydro-pneumatic water system",
      "Possession": "Ready / Handover in progress",
      "Documentation": "Direct registry with clear title documentation",
    },
    nearbyLandmarks: [
      { name: "Delhi-Lucknow Highway (NH 30)", distance: "10 Mins" },
      { name: "Rohilkhand University", distance: "12 Mins" },
      { name: "Bareilly Club", distance: "18 Mins" },
      { name: "Airport Road", distance: "15 Mins" },
    ],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanAvailable: true,
  },
  {
    id: "the-residences-plots",
    title: "The Residences by Aurika — Premium Plots",
    description:
      "Demarcated residential freehold plots within a master-planned gated enclave. Ideal for visionary homeowners looking to build custom bungalows and investors seeking solid land appreciation in Bareilly's premier growth corridor with wide concrete roads, drainage, streetlights, and landscaped parks already developed.",
    price: "₹38 Lakh – ₹85 Lakh",
    priceNumeric: 4800000,
    location: "Pilibhit Road Corridor, Bareilly",
    microLocation: "Pilibhit Road",
    type: PropertyType.PLOT,
    bedrooms: null,
    bathrooms: null,
    area: "150 – 350 Gaj",
    status: "Available",
    isVerified: true,
    isFeatured: false,
    isActive: true,
    amenities: [
      "Freehold Title Plots",
      "40ft & 30ft Wide Concrete Roads",
      "Underground Drainage & Sewage",
      "Gated Entry with Boom Barriers",
      "Parks & Green Walking Trails",
      "Electricity Feeder Line Installed",
      "Instant Registry & Demarcation",
      "Clear Boundary Markers",
    ],
    highlights: [
      "Immediate possession available for construction",
      "Bank home-loan and plot-loan assistance available",
      "Prime corridor showing 18%+ annual land value appreciation",
      "Escorted plot demarcation visit arranged on short notice",
    ],
    specifications: {
      "Plot Sizes": "150, 200, 250, 300, and 350 Gaj options",
      "Road Width": "Internal 30ft, Arterial 40ft wide paved roads",
      "Electricity": "Underground cabling with transformer substation",
      "Zoning": "Sanctioned residential township zoning",
      "Registry": "Direct registrar office registry with mutation guidance",
    },
    nearbyLandmarks: [
      { name: "Pilibhit Bypass Road", distance: "4 Mins" },
      { name: "Satellite Bus Station", distance: "14 Mins" },
      { name: "SRMS Institute of Medical Sciences", distance: "15 Mins" },
    ],
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanAvailable: false,
  },
  {
    id: "rajendar-nagar-3bhk",
    title: "Designer 3 BHK Residence, Rajendra Nagar",
    description:
      "A ready-to-move, architect-curated 3BHK luxury home located in the heart of Rajendra Nagar, Bareilly. Features contemporary layout planning, designer POP ceilings, modern modular kitchen, branded bathroom sanitary ware, private utility balcony, and covered vehicle parking. Walk to top local markets, cafes, and schools.",
    price: "₹68 Lakh – ₹88 Lakh",
    priceNumeric: 7800000,
    location: "Rajendra Nagar, Bareilly",
    microLocation: "Rajendra Nagar",
    type: PropertyType.APARTMENT,
    bedrooms: 3,
    bathrooms: 3,
    area: "1,550 sq ft (approx. 172 Gaj share)",
    status: "Ready to Move",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    amenities: [
      "Ready to Move",
      "Dedicated Covered Parking",
      "Modular Kitchen with Chimney",
      "Branded Bath Fittings (Jaquar)",
      "Separate Drawing & Dining Areas",
      "Individual Water Tank & Pressure Pump",
      "Inverter Wiring Completed",
      "LED Ambient Lighting Setup",
    ],
    highlights: [
      "Ready for immediate registration and key handover",
      "Prime neighborhood with zero waterlogging history",
      "Natural daylight across all 3 bedrooms with large windows",
      "Walkable distance to markets, grocery hubs, and medical centers",
    ],
    specifications: {
      "Building Type": "Low-density boutique residential floor",
      "Structure": "Earthquake-resistant RCC column and beam design",
      "Flooring": "High-gloss digital vitrified floor tiles",
      "Kitchen": "Soft-close hydraulic cabinets with quartz top",
      "Possession": "Immediate Handover",
    },
    nearbyLandmarks: [
      { name: "Hartmann College", distance: "4 Mins" },
      { name: "Rajendra Nagar Central Market", distance: "2 Mins" },
      { name: "Civil Lines", distance: "8 Mins" },
      { name: "Bareilly Cantt Area", distance: "10 Mins" },
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanAvailable: true,
  },
  {
    id: "singaporean-luxury-bareilly",
    title: "Skyline Residences by International Developer",
    description:
      "A landmark residential project inspired by Singaporean architecture, rising majestically in Bareilly with 4 high-rise towers, multi-tier lifestyle amenities, Olympic-style swimming pool, rooftop sky lounge, and 360-degree panoramic city views. Designed to redefine community living standards in Bareilly.",
    price: "₹82 Lakh – ₹1.45 Cr",
    priceNumeric: 11000000,
    location: "Bareilly Prime Belt",
    microLocation: "Bareilly",
    type: PropertyType.APARTMENT,
    bedrooms: 3,
    bathrooms: 3,
    area: "1,780 – 2,400 sq ft",
    status: "Under Construction",
    isVerified: true,
    isFeatured: false,
    isActive: true,
    amenities: [
      "4 Signature Towers",
      "Resort Swimming Pool & Sunken Deck",
      "Basketball & Badminton Courts",
      "Multi-Cuisine Banquet Facility",
      "Sky Lounge & Yoga Deck",
      "EV Charging Infrastructure",
      "Concierge Desk & Smart Access",
      "Children's Themed Play Enclave",
    ],
    highlights: [
      "Bareilly's first international lifestyle tower project",
      "Over 75% landscaped open green area",
      "Flexi-payment construction-linked plan available",
      "Direct guidance and official developer pricing",
    ],
    specifications: {
      "Architecture": "Singaporean tropical modernism with vertical green walls",
      "Security": "Multi-tier biometric and RFID access control",
      "Elevators": "High-speed Mitsubishi or equivalent elevators",
      "Possession": "Mid 2027",
    },
    nearbyLandmarks: [
      { name: "Bareilly Ring Road Junction", distance: "5 Mins" },
      { name: "Bareilly Civil Airport", distance: "18 Mins" },
      { name: "Medanta Super Specialty Partner Clinic", distance: "10 Mins" },
    ],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanAvailable: true,
  },
  {
    id: "godrej-golf-links-final-phase",
    title: "Godrej Golf Links — Final Phase Residences",
    description:
      "A flagship Delhi NCR portfolio property: the final phase of signature golf-facing high-rise residences within an established 100-acre low-density golf township in Greater Noida near Pari Chowk. Designed with golf course fairways on one side, private master clubhouses, multi-tier sporting zones, and seamless signal-free access to Noida and Central Delhi.",
    price: "₹4.50 Cr – ₹6.20 Cr",
    priceNumeric: 45000000,
    location: "Greater Noida, Delhi NCR",
    microLocation: "Greater Noida",
    type: PropertyType.APARTMENT,
    bedrooms: 4,
    bathrooms: 4,
    area: "2,850 – 3,750 sq ft",
    status: "New Launch",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    amenities: [
      "9-Hole Golf Course Access",
      "Golf Clubhouse & Pro Shop",
      "Olympic-Length Indoor Heated Pool",
      "Private Butler & Concierge",
      "Triple-Height Arrival Portico",
      "Low Density (4 Units Per Floor)",
      "High-Speed Metro Connectivity",
      "Multi-Tier Security & Biometrics",
    ],
    highlights: [
      "Uninterrupted views over the 9-hole golf course greens",
      "Developed by India's most trusted real-estate conglomerate",
      "High capital appreciation zone near Jewar International Airport corridor",
      "Private site visit coordination from Delhi or Bareilly",
    ],
    specifications: {
      "Developer": "Godrej Properties Limited",
      "Township Area": "Over 100 sprawling lush acres",
      "Finishing": "VRV Air-conditioning and Italian marble standard",
      "Possession": "Phase-wise possession starting late 2026",
    },
    nearbyLandmarks: [
      { name: "Pari Chowk Metro Station", distance: "5 Mins" },
      { name: "Noida-Greater Noida Expressway", distance: "6 Mins" },
      { name: "Upcoming Noida International Airport (Jewar)", distance: "30 Mins" },
      { name: "South Delhi via DND Flyway", distance: "35 Mins" },
    ],
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanAvailable: true,
  },
  {
    id: "bento-by-gaurs-yamuna-expressway",
    title: "BENTO by Gaurs — Luxury Serviced Suites",
    description:
      "Fully furnished, centrally air-conditioned luxury serviced suites strategically positioned on the Yamuna Expressway near the operational Formula 1 Circuit and the upcoming Noida International Airport (DXN). Offers strong projected rental returns, turnkey hotel-grade furnishings, professional facilities management, and high capital growth upside.",
    price: "₹85 Lakh – ₹1.15 Cr",
    priceNumeric: 8500000,
    location: "Yamuna Expressway, Noida NCR",
    microLocation: "Yamuna Expressway",
    type: PropertyType.COMMERCIAL,
    bedrooms: 1,
    bathrooms: 1,
    area: "660 – 850 sq ft",
    status: "Under Construction",
    isVerified: true,
    isFeatured: false,
    isActive: true,
    amenities: [
      "Fully Furnished Designer Suites",
      "Central Air Conditioning (VRV)",
      "Business Centre & Board Rooms",
      "Rooftop Infinity Swimming Pool",
      "Professional Concierge & Housekeeping",
      "High Street Commercial Mall in Complex",
      "Covered Reserved Parking",
      "24x7 Power Backup with Dual Meters",
    ],
    highlights: [
      "Immediate proximity to the upcoming Noida International Airport",
      "Zero-hassle investment with rental leasing management",
      "Direct frontage on 6-lane Yamuna Expressway",
      "Pre-launch and early investor pricing bands available",
    ],
    specifications: {
      "Furnishing": "Turnkey designer furniture, LED TV, mini-bar, bed, and lighting",
      "Structure": "High-grade commercial RCC framework with solar panels",
      "Management": "Professional hospitality management operator tie-up",
      "Possession": "Q3 2026",
    },
    nearbyLandmarks: [
      { name: "Noida International Airport (Jewar)", distance: "18 Mins" },
      { name: "Buddh International Circuit", distance: "4 Mins" },
      { name: "Eastern Peripheral Expressway", distance: "8 Mins" },
      { name: "Noida Sector 148 Metro", distance: "20 Mins" },
    ],
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    ],
    floorPlanAvailable: true,
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
