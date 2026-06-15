import { isSectionType } from "@/lib/section-types";
import type { ContentRecord, MenuItem, PageSection, SectionType } from "@/types/cms";

export const headerMenuItems: MenuItem[] = [
  { label: "Home", href: "/", order: 0, visible: true },
  { label: "Services", href: "/services", order: 1, visible: true },
  { label: "Case Studies", href: "/case-studies", order: 2, visible: true },
  { label: "Blog", href: "/blog", order: 3, visible: true },
  { label: "About", href: "/about", order: 4, visible: true },
  { label: "Contact", href: "/contact", order: 5, visible: true },
];

export const defaultFooterCta = {
  eyebrow: "Gaila · Dubai",
  headline: "Let's create something",
  headlineAccent: "unforgettable.",
  label: "Plan your event",
  href: "/contact",
  visible: true,
} as const;

export const footerMenuItems: MenuItem[] = [
  { label: "About", href: "/about", order: 0, visible: true },
  { label: "Blog", href: "/blog", order: 1, visible: true },
  { label: "Corporate Events", href: "/services/seo-dubai", order: 2, visible: true },
  { label: "Conferences & Summits", href: "/services/paid-media", order: 3, visible: true },
  { label: "Weddings & Celebrations", href: "/services/social-media", order: 4, visible: true },
  { label: "Event Production & AV", href: "/services/video-production", order: 5, visible: true },
  { label: "Creative Direction & Décor", href: "/services/brand-creative", order: 6, visible: true },
  { label: "Contact", href: "/contact", order: 7, visible: true },
];

// Stable Unsplash URLs used as seed defaults. Editors can replace per record
// from the admin UI (upload or paste a different URL).
const IMG = {
  heroDubai:
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=80",
  studioTeam:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1800&q=80",
  corporate:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1800&q=80",
  conference:
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1800&q=80",
  wedding:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80",
  decor:
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1800&q=80",
  production:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1800&q=80",
  gala:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=80",
  summit:
    "https://images.unsplash.com/photo-1505373877841-8d25f7d4666e?auto=format&fit=crop&w=1800&q=80",
  yacht:
    "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1800&q=80",
  cafe:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=80",
  flowers:
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=80",
  hospitality:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80",
  venue:
    "https://images.unsplash.com/photo-1566073771569-1067f85f0c4e?auto=format&fit=crop&w=1800&q=80",
  experiential:
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1800&q=80",
} as const;

export const services = [
  {
    kind: "service",
    title: "Corporate Events",
    slug: "seo-dubai",
    excerpt:
      "Most corporate events in Dubai fail to deliver on their brief — not because the venue was wrong, but because the planning, production, and guest experience were treated as separate problems. As a trusted corporate events company in Dubai, Gaila designs end-to-end experiences that reflect your brand, engage your audience, and achieve measurable business outcomes.",
    body:
      "Gaila delivers corporate event management in Dubai across annual galas, product launches, leadership summits, award ceremonies, and client entertainment — with bilingual English and Arabic programmes, hybrid and in-person formats, and transparent reporting tied to attendance, engagement, and post-event follow-through.",
    coverImage: IMG.corporate,
    tags: ["Corporate Events", "Galas", "Product Launches"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Corporate events delivered in 2025", value: "85+" },
      { label: "Pre-event planning checklist", value: "120 items" },
    ],
    seo: {
      title: "Corporate Events Dubai | Corporate Event Management | Gaila",
      description:
        "Corporate event management in Dubai — galas, product launches, award ceremonies, and leadership events with end-to-end planning, production, and guest experience.",
    },
  },
  {
    kind: "service",
    title: "Conferences & Summits",
    slug: "paid-media",
    excerpt:
      "Conference and summit management is a results-driven discipline where every element — programme design, speaker logistics, registration, staging, and delegate experience — is measured against real outcomes. Unlike one-off gatherings, a well-run conference builds authority, generates leads, and compounds your brand's industry presence.",
    body:
      "Gaila plans and produces conferences and summits for Dubai and UAE organisations across multi-track programmes, keynote stages, exhibition zones, networking receptions, and hybrid streaming. Every engagement starts with a delegate journey audit, then follows a structured 90-day production roadmap before we scale registration, content, and sponsor activations.",
    coverImage: IMG.conference,
    tags: ["Conferences", "Summits", "Hybrid Events"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Average delegate satisfaction score", value: "4.8 / 5" },
      { label: "Production cadence", value: "Weekly" },
    ],
    seo: {
      title: "Conference & Summit Management Dubai | Gaila",
      description:
        "Plan and deliver conferences and summits in Dubai with a team focused on programme design, delegate experience, hybrid streaming, and sponsor activations.",
    },
  },
  {
    kind: "service",
    title: "Weddings & Celebrations",
    slug: "social-media",
    excerpt:
      "As a wedding and celebration planner in Dubai, Gaila creates events that go beyond décor and guest lists. We design experiences that honour your story, reflect your culture, and leave every guest with a memory they'll talk about for years.",
    body:
      "Gaila provides wedding and celebration planning in Dubai designed to help couples and families create meaningful moments while managing every detail with precision. From venue selection and creative direction to vendor coordination, guest logistics, and day-of production, we help you establish a celebration that feels effortless — even when the planning behind it is anything but.",
    coverImage: IMG.wedding,
    tags: ["Weddings", "Engagements", "Celebrations"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Celebrations planned per year", value: "40 — 60" },
      { label: "Average guest satisfaction", value: "98%" },
    ],
    seo: {
      title: "Wedding Planner Dubai | Celebration Events | Gaila",
      description:
        "Wedding and celebration planning in Dubai — venue sourcing, creative direction, vendor coordination, and day-of production for unforgettable events.",
    },
  },
  {
    kind: "service",
    title: "Event Production & AV",
    slug: "video-production",
    excerpt:
      "At Gaila, we provide event production and AV services in Dubai that combine technical precision, creative staging, and seamless execution to create experiences that deliver on every brief. From lighting and sound to LED walls, live streaming, and show calling, every element is designed to support your event objectives.",
    body:
      "Event production has become the backbone of every memorable gathering in Dubai. Whether you're hosting a 2,000-delegate summit, an intimate gala dinner, or a product launch with broadcast-quality streaming, professionally managed production ensures your message lands and your guests feel the difference.\n\nAt Gaila, we provide event production and AV services in Dubai that combine technical expertise, creative staging, and calm show-day execution. From rigging and lighting design to sound engineering, LED content, live streaming, and show calling, every project is built to run flawlessly under pressure.\n\nAs a trusted event production company in Dubai, we handle the entire technical scope — site surveys, CAD staging plans, equipment procurement, crew management, rehearsals, and live operation. Our team delivers production for ballrooms, outdoor venues, exhibition halls, and hybrid broadcast setups across the UAE.",
    coverImage: IMG.production,
    tags: ["AV Production", "Staging", "Live Streaming"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Production days delivered in 2025", value: "180+" },
      { label: "Average show-day turnaround", value: "3 — 5 weeks" },
    ],
    seo: {
      title: "Event Production & AV Dubai | Gaila",
      description:
        "Event production and AV services in Dubai — staging, lighting, sound, LED walls, live streaming, and show calling for conferences, galas, and launches.",
    },
  },
  {
    kind: "service",
    title: "Creative Direction & Décor",
    slug: "brand-creative",
    excerpt:
      "Creative direction, spatial design, floral styling, and bespoke décor that transforms venues into immersive brand experiences — built for ambitious events in Dubai.",
    body:
      "Gaila leads events through concept development, mood boards, spatial design, floral styling, tablescapes, signage, and the creative system that holds everything together — entrance experiences, stage backdrops, photo moments, and branded touchpoints. We help in-house teams stop relying on generic rental packages and start operating from a clear, documented creative vision.\nDeliverables include concept decks, 3D renders, décor specifications, vendor briefs, and on-site creative supervision.",
    coverImage: IMG.decor,
    tags: ["Décor", "Creative Direction", "Spatial Design"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Creative concept timeline", value: "4 — 6 weeks" },
      { label: "Deliverables", value: "Concept deck + 3D renders" },
    ],
    seo: {
      title: "Event Décor & Creative Direction Dubai | Gaila",
      description:
        "Creative direction and event décor in Dubai — spatial design, floral styling, and immersive brand experiences for galas, weddings, and corporate events.",
    },
  },
  {
    kind: "service",
    title: "Venue Sourcing & Logistics",
    slug: "web-design",
    excerpt:
      "Strategic venue selection, contract negotiation, guest logistics, transport coordination, and run-of-show planning designed to make complex Dubai events feel effortless.",
    body:
      "We source and secure venues across Dubai and the UAE with clear briefs, negotiated contracts, site visits, and contingency planning. Projects start with a requirements workshop, then move into venue shortlisting, technical site surveys, logistics mapping, vendor coordination, and a structured handover with documented run-of-show and guest journey plans.\nTypical scope: hotel ballrooms, outdoor desert venues, yacht charters, exhibition halls, and multi-venue programmes for regional roadshows.",
    coverImage: IMG.venue,
    tags: ["Venue Sourcing", "Logistics", "Run of Show"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Venue partners across UAE", value: "120+" },
      { label: "Average logistics checklist items", value: "85+" },
    ],
    seo: {
      title: "Venue Sourcing & Event Logistics Dubai | Gaila",
      description:
        "Venue sourcing and event logistics in Dubai — site selection, contract negotiation, guest transport, and run-of-show planning for complex events.",
    },
  },
  {
    kind: "service",
    title: "Experiential Activations",
    slug: "influencer-marketing",
    excerpt:
      "Design immersive brand activations, pop-ups, and guest experiences that create lasting impressions, drive social sharing, and connect audiences to your brand in memorable ways.",
    body:
      "Gaila designs experiential activations for Dubai and GCC brands — concept development, spatial build, interactive elements, staffing, content capture, and performance reporting tied to footfall, dwell time, and social amplification.\nWe match activations to your audience and venue, run bilingual experiences where needed, and integrate photo moments, sampling stations, and digital touchpoints for compounding reach.",
    coverImage: IMG.experiential,
    tags: ["Activations", "Pop-ups", "Brand Experiences"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Activation design criteria", value: "12-point scorecard" },
      { label: "On-site reporting cadence", value: "Real-time" },
    ],
    seo: {
      title: "Experiential Event Activations Dubai | Gaila",
      description:
        "Experiential activations in Dubai — immersive brand experiences, pop-ups, and guest engagement designed to create lasting impressions and social reach.",
    },
  },
  {
    kind: "service",
    title: "Event Strategy & Consulting",
    slug: "public-relations",
    excerpt:
      "Strengthen your event programme through strategic planning, stakeholder alignment, budget modelling, vendor frameworks, and consulting that turns ambition into executable plans.",
    body:
      "Our consulting team supports Dubai organisations with event strategy, programme design, budget modelling, RFP development, vendor selection frameworks, and ongoing event governance across English and Arabic stakeholder groups.\nWe build event roadmaps, craft compelling briefs, coordinate executive alignment, and align event moments with your wider business calendar — product launches, award ceremonies, partner summits, and annual galas.",
    coverImage: IMG.hospitality,
    tags: ["Strategy", "Consulting", "Programme Design"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Typical strategy engagement", value: "4 — 6 weeks" },
      { label: "Markets", value: "UAE · GCC" },
    ],
    seo: {
      title: "Event Strategy & Consulting Dubai | Gaila",
      description:
        "Event strategy and consulting in Dubai — programme design, budget modelling, vendor frameworks, and governance for UAE and GCC organisations.",
    },
  },
] satisfies Partial<ContentRecord>[];

export const servicesOverviewCards = [
  {
    title: "Conferences & Summits",
    description:
      "End-to-end conference and summit management designed to maximise delegate experience, sponsor value, and industry authority across Dubai and the wider UAE.",
    href: "/services/paid-media",
    ctaLabel: "Explore Conferences & Summits →",
    image: IMG.conference,
  },
  {
    title: "Corporate Events",
    description:
      "Plan and deliver corporate galas, product launches, award ceremonies, and leadership events that reflect your brand and achieve measurable business outcomes.",
    href: "/services/seo-dubai",
    ctaLabel: "Explore Corporate Events →",
    image: IMG.corporate,
  },
  {
    title: "Weddings & Celebrations",
    description:
      "Create unforgettable weddings and celebrations through creative direction, vendor coordination, guest logistics, and flawless day-of production.",
    href: "/services/social-media",
    ctaLabel: "Explore Weddings & Celebrations →",
    image: IMG.wedding,
  },
  {
    title: "Event Production & AV",
    description:
      "Deliver technical excellence through staging, lighting, sound, LED walls, live streaming, and show calling for events of every scale across Dubai.",
    href: "/services/video-production",
    ctaLabel: "Explore Event Production →",
    image: IMG.production,
  },
  {
    title: "Experiential Activations",
    description:
      "Design immersive brand activations and pop-up experiences that create lasting impressions, drive engagement, and amplify your event across social channels.",
    href: "/services/influencer-marketing",
    ctaLabel: "Explore Experiential Activations →",
    image: IMG.experiential,
  },
  {
    title: "Event Strategy & Consulting",
    description:
      "Build a strategic event programme through planning frameworks, budget modelling, vendor selection, and consulting that turns ambition into executable plans.",
    href: "/services/public-relations",
    ctaLabel: "Explore Event Strategy →",
    image: IMG.hospitality,
  },
  {
    title: "Creative Direction & Décor",
    description:
      "Transform venues with bespoke décor, spatial design, floral styling, and creative direction that makes every event feel distinctly yours.",
    href: "/services/brand-creative",
    ctaLabel: "Explore Creative Direction →",
    image: IMG.decor,
  },
  {
    title: "Venue Sourcing & Logistics",
    description:
      "Secure the right venue and manage complex logistics — guest transport, run-of-show, vendor coordination, and on-site operations across the UAE.",
    href: "/services/web-design",
    ctaLabel: "Explore Venue & Logistics →",
    image: IMG.venue,
  },
] as const;

export const caseStudies = [
  {
    kind: "caseStudy",
    title: "Fenty Beauty — Dubai product launch gala",
    slug: "fenty-beauty",
    excerpt:
      "A premium product launch gala for Fenty Beauty in Dubai — immersive décor, live staging, and guest experience design that delivered 120% social engagement lift and sold-out attendance.",
    body:
      "Fenty Beauty has redefined beauty standards with its commitment to inclusivity, innovation, and vibrancy. Known for its wide-range foundation shades, bold colour cosmetics, and strong visual identity, Fenty needed a launch event in Dubai that matched its dynamic energy and upheld its high visual expectations.\nThe challenge: create an immersive guest experience that showcased product textures, shades, and packaging in a way that felt editorial, not promotional; design a venue transformation that photographed beautifully for social and press; maintain brand consistency across every touchpoint from invitation to farewell gift; and drive attendance and shareability through a guest journey built for content capture.\nOur solution combined bespoke spatial design (bold colour backdrops, product display moments, and a runway-style reveal) with live staging, DJ programming, and a content capture team embedded throughout the evening. The result was a 120% engagement-rate lift on launch content, sold-out attendance within 48 hours of invitations, and a 75% increase in social shares and reposts from guest-generated content.",
    coverImage: IMG.gala,
    tags: ["Product Launch", "Gala", "Brand Experience"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Social engagement rate", value: "+120%" },
      { label: "Ticket sell-through", value: "100%" },
      { label: "Guest content shares", value: "+75%" },
    ],
    seo: {
      title: "Fenty Beauty Dubai Launch Gala Case Study | Gaila",
      description:
        "Product launch gala for Fenty Beauty in Dubai — immersive décor, live staging, and guest experience design with 120% social engagement lift.",
    },
  },
  {
    kind: "caseStudy",
    title: "Ford Middle East — Annual dealer summit",
    slug: "ford-middleeast",
    excerpt:
      "A multi-day dealer summit for Ford Middle East across UAE, KSA, and the wider GCC — built around model reveals, leadership sessions, and regional networking.",
    body:
      "Ford Middle East needed an annual summit that connected dealers, leadership, and regional partners across UAE, KSA, and the wider GCC — weaving model reveals, training sessions, and cultural moments into one cohesive programme.\nGaila operated as Ford's event partner: producing the main stage for every new model reveal, building breakout sessions for sales and aftersales teams, coordinating bilingual Arabic and English programming for each market, and maintaining a production calendar tied to regional moments (Ramadan, National Day, off-roading season). Success was measured through delegate satisfaction scores, post-event sales pipeline, and dealer engagement metrics.\nThe outcome: a premium summit experience with consistent regional voice, measurable lifts in dealer engagement, and a production system the in-house team could brief against for the following year.",
    coverImage: IMG.summit,
    tags: ["Summit", "Automotive", "Multi-day", "GCC"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Summits delivered / year", value: "3+" },
      { label: "Markets covered", value: "GCC" },
    ],
    seo: {
      title: "Ford Middle East Summit Case Study | Gaila",
      description:
        "Annual dealer summit for Ford Middle East — multi-day programming, model reveals, and bilingual production across the GCC.",
    },
  },
  {
    kind: "caseStudy",
    title: "Oberoi Yachts — Luxury charter launch event",
    slug: "oberoi-yachts",
    excerpt:
      "A luxury launch event for Oberoi Yachts — waterfront staging, lifestyle experience design, and an invitation-only evening that converted high-net-worth guests into charter enquiries.",
    body:
      "Oberoi Yachts needed an event that matched the calibre of the product — a fleet of luxury charters serving Dubai's high-net-worth and inbound luxury market.\nGaila produced a waterfront launch evening with live yacht tours, curated dining on the marina, ambient staging across the fleet, and a tightly managed guest list: personalised invitations for English and Arabic UHNW audiences, valet and concierge logistics, and a same-day broker follow-up system for every qualified enquiry.\nThe event delivered a steady stream of charter enquiries during the peak season, with a sharper brand presentation on the night and a creative and logistics playbook the team has reused across follow-up activations.",
    coverImage: IMG.yacht,
    tags: ["Luxury", "Launch Event", "Waterfront"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Qualified charter enquiries", value: "+58%" },
      { label: "Average guest follow-up", value: "Same day" },
    ],
    seo: {
      title: "Oberoi Yachts Launch Event Case Study | Gaila",
      description:
        "Luxury charter launch event for Oberoi Yachts — waterfront staging, curated guest experience, and qualified enquiry conversion.",
    },
  },
  {
    kind: "caseStudy",
    title: "8th Café — Grand opening celebration",
    slug: "8th-cafe",
    excerpt:
      "A neighbourhood grand opening for 8th Café — editorial décor, live music programming, and a guest experience that turned invitations into a queue around the block.",
    body:
      "8th Café wanted an opening celebration that reflected the brand experience inside the café — minimal, editorial, and rooted in the neighbourhood.\nGaila built the full opening programme: spatial design and floral styling on-site, a live acoustic set and DJ handover, an invitation list tied to local influencers and regulars, and a community-management workflow with personalised RSVP follow-ups.\nWithin the opening weekend, footfall exceeded projections, the event generated a library of high-quality content for social and press, and the brand had a reusable template for future location openings.",
    coverImage: IMG.cafe,
    tags: ["F&B", "Grand Opening", "Community"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Opening weekend footfall", value: "+140%" },
      { label: "RSVP response rate", value: "92%" },
    ],
    seo: {
      title: "8th Café Grand Opening Case Study | Gaila",
      description:
        "Grand opening celebration for 8th Café — editorial décor, live programming, and a guest experience that drove neighbourhood footfall.",
    },
  },
  {
    kind: "caseStudy",
    title: "Baaqat Flowers — Seasonal wedding showcase",
    slug: "baaqat-flowers",
    excerpt:
      "A creative wedding showcase for Baaqat Flowers — premium floral installations, seasonal tablescapes, and an open-day event that scaled bookings for every occasion.",
    body:
      "Baaqat Flowers needed creative and logistics working together: premium floral installations that reflected the brand, modular showcase setups for major occasions (Valentine's, Mother's Day, Eid, weddings), and an open-day event that converted walk-ins into confirmed bookings.\nGaila rebuilt the showcase concept around a single brand look, installed seasonal collections across three styled vignettes, and structured the guest journey around consultation stations with bilingual hosts for English, Arabic, and UAE-resident vs. inbound audiences. Real-time booking slots fed into a CRM so follow-ups happened within 24 hours.\nThe outcome was steadier bookings across major occasions, a sharper brand presentation, and a showcase format the team can deploy without production bottlenecks.",
    coverImage: IMG.flowers,
    tags: ["Wedding Showcase", "Floral", "Open Day"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Booking conversion at showcase", value: "+44%" },
      { label: "Styled vignettes per event", value: "12+" },
    ],
    seo: {
      title: "Baaqat Flowers Wedding Showcase Case Study | Gaila",
      description:
        "Seasonal wedding showcase for Baaqat Flowers — floral installations, styled vignettes, and an open-day event that scaled bookings.",
    },
  },
  {
    kind: "caseStudy",
    title: "Hospitality Group — Multi-venue gala series",
    slug: "hospitality-group-paid-social",
    excerpt:
      "A multi-concept Dubai hospitality group rebuilt their annual gala programme — 3.2x sponsor ROI and a 41% lift in post-event reservations across 5 venues.",
    body:
      "A multi-concept hospitality group operating five venues in DIFC, JBR, and Dubai Marina was struggling with declining attendance at their annual partner galas. Each restaurant was running siloed events, with décor and production handled by separate vendors and reservations tracked by hand.\nGaila became their fractional events team. We consolidated the gala programme under one creative system, built a shared production framework across the five brands, and tied the reservation pipeline into a single post-event follow-up workflow.\nWithin one gala season, sponsor ROI reached 3.2x, post-event reservations were up 41% across the group, and the leadership team finally had a single dashboard showing attendance, average spend per guest, and venue contribution by location.",
    coverImage: IMG.hospitality,
    tags: ["Hospitality", "Gala", "Multi-venue"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Sponsor ROI", value: "3.2x" },
      { label: "Post-event reservations", value: "+41%" },
    ],
    seo: {
      title: "Dubai Hospitality Group Gala Case Study | Gaila",
      description:
        "Multi-venue gala series for a Dubai hospitality group — 3.2x sponsor ROI and 41% lift in post-event reservations across 5 restaurants.",
    },
  },
] satisfies Partial<ContentRecord>[];

export const blogPosts = [
  {
    kind: "blog",
    title: "Planning corporate events in Dubai: what luxury brands get right",
    slug: "email-marketing-dubai-luxury",
    excerpt:
      "In a market this competitive, corporate events remain one of the highest-impact channels for Dubai luxury brands — when the brief, guest list, and experience design are right.",
    body:
      "Dubai's luxury landscape is unlike anywhere else: a high-spend, multi-cultural audience moving constantly between brands, venues, and languages. In that environment, corporate events remain one of the highest-impact channels for luxury brands willing to invest in guest curation, experience design, and follow-through.\nFour areas matter most:\n• Guest list quality — Dubai's luxury audience is segmented by spend tier, language preference (Arabic vs. English vs. multilingual), and industry influence. A 200-guest list curated well will out-perform a 2,000-person invitation blast.\n• Experience design that reflects the brand — VIP guests should not see the same programme as general attendees. Build journeys around tier, interest, and language.\n• Production that respects the brand — events should look and feel like the brand, not a generic hotel ballroom package. Custom typography, editorial florals, ambient lighting, and considered Arabic copy.\n• Measurement — a clean post-event dashboard tied to pipeline, partnerships, and media coverage, not just attendance numbers.\nLuxury brands that run corporate events properly in Dubai consistently see them as a top-3 relationship channel. The ones that don't usually have a venue coordinator and a spreadsheet.",
    coverImage: IMG.decor,
    tags: ["Corporate Events", "Luxury", "Dubai"],
    status: "published",
    featured: true,
    seo: {
      title: "Corporate Events for Dubai Luxury Brands | Gaila",
      description:
        "Why corporate events remain one of the highest-impact channels for Dubai luxury brands — guest curation, experience design, and follow-through done right.",
    },
  },
  {
    kind: "blog",
    title: "Why Dubai is the Middle East's most dynamic event destination",
    slug: "dubai-social-media-innovation",
    excerpt:
      "Dubai's blend of venues, infrastructure, and ambition has quietly made it the Middle East's most interesting event market.",
    body:
      "If you spend any time inside Dubai's events scene, you notice it quickly: the city has become the most ambitious event market in the Middle East. Organisers are testing formats here months before the rest of the region picks them up, and guest expectations have moved with them.\nThree forces drive it.\nFirst, the audience: Dubai's residents and inbound visitors come from across the world, fluent in multiple cultural codes. Events have to perform across guest lists shaped by GCC nationals, expats, and international travellers, often within the same evening.\nSecond, the infrastructure: world-class hotels, exhibition halls, production crews, caterers, and florists are all concentrated within a 30-minute drive. An organiser can move from concept to sold-out gala in weeks rather than months.\nThird, the ambition: leadership teams in Dubai are willing to invest. They expect flawless execution, but they're willing to fund proper creative and production to get there.\nThe practical implication for brands: if it's working in Dubai, it will scale across the GCC. If it's not working in Dubai, the rest of the region is unlikely to save it.",
    coverImage: IMG.heroDubai,
    tags: ["Events", "Dubai", "Middle East"],
    status: "published",
    featured: true,
    seo: {
      title: "Why Dubai Leads Middle East Events | Gaila",
      description:
        "Dubai's venues, infrastructure, and ambition combine to make it the Middle East's most dynamic event destination. Here's what to learn from it.",
    },
  },
  {
    kind: "blog",
    title: "In-person vs. hybrid events: which format is right for your Dubai conference?",
    slug: "google-ads-vs-facebook-ads-dubai",
    excerpt:
      "In-person and hybrid events serve different jobs in a Dubai organisation's calendar. Here's how we think about the split for clients across the UAE.",
    body:
      "We get the question constantly: should we run our conference in-person or hybrid? The honest answer is almost always both — but in different proportions, for different objectives.\nIn-person events capture presence. Delegates in a ballroom at Atlantis or DWTC are fully immersed — networking happens naturally, sponsors get face time, and the energy of a live audience is irreplaceable.\nHybrid events extend reach. Delegates who cannot travel still participate through live streaming, virtual breakout rooms, and on-demand content — but the production investment is higher and the experience must be designed for two audiences simultaneously.\nIn most Dubai conferences we produce, a healthy approach looks like a fully in-person core programme with hybrid streaming for keynote sessions and sponsor content, plus on-demand replays for 30–60 days post-event. Pure virtual works for internal town halls; pure in-person works for relationship-driven galas.\nThe wrong question is 'in-person vs. hybrid'. The right question is: where is the value for this audience created, where is it extended, and is the production ready to serve both?",
    coverImage: IMG.conference,
    tags: ["Hybrid Events", "Conferences", "Strategy"],
    status: "published",
    featured: false,
    seo: {
      title: "In-Person vs Hybrid Events for Dubai Conferences | Gaila",
      description:
        "How Gaila thinks about the in-person vs. hybrid split for Dubai conferences — where presence matters, where reach extends, and how to fund both.",
    },
  },
  {
    kind: "blog",
    title: "Venue selection signals that actually make Dubai events succeed",
    slug: "local-seo-signals-dubai",
    excerpt:
      "Capacity charts alone won't make an event succeed. Here's what we see consistently driving guest experience and operational success across Dubai venues.",
    body:
      "Venue selection in Dubai has matured fast. The basics — capacity, location, catering package — get you in the conversation. They don't get you a flawless event.\nWhat we see driving success across the city in 2026:\n• Technical readiness: power, rigging points, load-in access, and AV infrastructure that match your production brief — not just a pretty ballroom photo.\n• Guest journey mapping: separate arrival, registration, main programme, networking, and departure flows that prevent bottlenecks.\n• Bilingual capability — signage, menus, and host teams fluent in English and Arabic for mixed guest lists.\n• Contingency planning — backup power, weather protocols for outdoor venues, and hold dates for critical vendors.\n• Contract clarity: cancellation terms, overtime charges, and exclusivity clauses documented before you sign.\nThe organisers that take venue selection seriously in Dubai right now deliver events that feel effortless to guests and manageable for production teams. The ones that don't are still arguing about whether the ballroom ceiling is high enough for the LED wall.",
    coverImage: IMG.venue,
    tags: ["Venue Selection", "Logistics"],
    status: "published",
    featured: false,
    seo: {
      title: "Venue Selection Dubai: What Actually Matters | Gaila",
      description:
        "Which venue selection factors actually make Dubai events succeed in 2026 — technical readiness, guest journey, bilingual capability, and contract clarity.",
    },
  },
] satisfies Partial<ContentRecord>[];

const heroCategories = [
  { label: "Services", href: "/services", meta: "8" },
  { label: "Case Studies", href: "/case-studies", meta: "12" },
  { label: "Blog", href: "/blog", meta: "Journal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const homeSections: PageSection[] = [
  {
    id: "hero-editorial",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Event management · Dubai",
    title: "Dubai's Event Management Company | for Ambitious Brands & Celebrations",
    subtitle:
      "Gaila is an event management company in Dubai combining strategy, creative direction, production, and logistics into one seamless experience. Trusted by leading brands and families across the UAE to create events that guests remember and organisers trust.",
    settings: {
      video: "https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4",
      poster: IMG.heroDubai,
      image: IMG.heroDubai,
      imageAlt: "Dubai skyline at golden hour",
      ctaLabel: "Plan your event",
      ctaHref: "https://wa.me/971502827279",
      secondaryCtaLabel: "Request a proposal",
      secondaryCtaHref: "tel:+971502827279",
      categories: heroCategories,
    },
  },
  {
    id: "capability-marquee",
    type: "marquee",
    enabled: true,
    settings: {
      speedSeconds: 38,
      items: [
        "Strategy",
        "Creative",
        "Production",
        "Décor",
        "Corporate Events",
        "Conferences",
        "Weddings",
        "Galas",
        "Experiential",
        "Venue Sourcing",
      ],
    },
  },
  {
    id: "services-editorial",
    type: "servicesEditorial",
    enabled: true,
    eyebrow: "What we do",
    title: "Eight services. One accountable team.",
    subtitle:
      "Engage Gaila for a single service or run the full event engine. Every engagement is led by a senior producer with specialist practitioners on the work.",
    settings: { limit: 6 },
  },
  {
    id: "stats",
    type: "statsBand",
    enabled: true,
    title: "Senior strategy, flawless execution, clear reporting.",
    settings: {
      stats: [
        { value: "200+", label: "Events delivered across Dubai and the UAE" },
        { value: "40+", label: "Active UAE clients across 6 industries" },
        { value: "5.0", label: "Average Google rating from clients" },
        { value: "98%", label: "Client retention after the first event" },
      ],
    },
  },
  {
    id: "process",
    type: "processSteps",
    enabled: true,
    eyebrow: "How we work",
    title: "A Proven Process Built for Dubai's Event Landscape",
    settings: {
      steps: [
        {
          title: "Discover",
          text: "We start by understanding your event objectives — audience, budget, venue constraints, and success metrics. We identify gaps, missed opportunities, and quick wins tailored to your Dubai market.",
        },
        {
          title: "Strategize",
          text: "Our team crafts a custom event roadmap aligned with your goals — whether that's a corporate gala, a multi-day summit, a wedding celebration, or a product launch across the UAE.",
        },
        {
          title: "Execute",
          text: "From creative direction and venue sourcing to production and day-of management, we execute every detail with precision, creativity, and full Arabic & English capability.",
        },
        {
          title: "Optimise",
          text: "We rehearse, refine, and stress-test continuously. Production walkthroughs, vendor confirmations, and contingency planning ensure every element is ready before guests arrive.",
        },
        {
          title: "Scale",
          text: "Once we deliver one exceptional event, we help you scale the programme. Annual galas, recurring summits, multi-venue roadshows — backed by the same senior team from day one.",
        },
      ],
    },
  },
  {
    id: "case-studies",
    type: "caseStudyGrid",
    enabled: true,
    eyebrow: "Work that delivers",
    title: "Events engineered around outcomes.",
    subtitle:
      "Fenty Beauty, Ford Middle East, Oberoi Yachts, 8th Café and more — real brands, real numbers, not stock metrics.",
    settings: { categorySlug: "case-studies" },
  },
  {
    id: "client-quote",
    type: "quote",
    enabled: true,
    eyebrow: "Client note",
    settings: {
      quote:
        "Gaila rebuilt our annual gala programme, our sponsor experience, and our post-event pipeline — without ever sending us another agency deck.",
      author: "Group Marketing Director",
      role: "Dubai hospitality group · 5 venues",
      image: IMG.cafe,
    },
  },
  {
    id: "google-reviews",
    type: "googleReviews",
    enabled: true,
    eyebrow: "Google reviews",
    title: "What clients say after working with Gaila.",
    subtitle:
      "Unedited Google reviews from leadership teams across Dubai Marina, Downtown Dubai, Business Bay, JLT, and Dubai Internet City.",
    settings: {},
  },
  {
    id: "insights",
    type: "imageText",
    enabled: true,
    eyebrow: "Event company · Dubai",
    title: "Events that deliver—not just impress.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Gaila event team in Dubai",
      align: "right",
      body: [
        "Most organisations in Dubai host events. Few have a programme that actually moves the business forward. As an event management company in Dubai, that's the gap Gaila was built to close.",
        "We are a full-service event company in Dubai combining strategy, creative direction, production, and logistics built for brands and families that want events that actually deliver, not just look good in photos.",
        "We work with clients at every stage—startups hosting their first launch, established companies running annual galas, and ambitious families planning milestone celebrations. Across hospitality, automotive, luxury, F&B, and beyond, we've helped organisations across the UAE turn their events into genuine relationship and revenue engines.",
        "Our work spans corporate events, conferences, weddings, production, décor, venue sourcing, and experiential activations — but we never treat these as isolated services. Every element is connected to a single goal: creating an event your guests remember and your team trusts to repeat.",
        "Dubai's event market is competitive. Guest expectations are high. And the events winning attention aren't the ones with the biggest budgets — they're the ones with the clearest brief and sharpest execution. That's what we bring as a trusted event management company in Dubai.",
        "If you're ready to stop guessing and start planning, you're in the right place.",
      ].join("\n\n"),
      checklistTitle: "Why Clients Choose Gaila",
      bullets: [
        "Strategy before styling—always",
        "Creative that captivates, not just decorates",
        "Production built for Dubai's venue landscape",
        "Logistics that make complex events feel effortless",
        "Transparent reporting tied to real event outcomes",
        "A team invested in your event, not just your invoice",
      ],
      ctaLabel: "Request a proposal",
      ctaHref: "/contact",
    },
  },
  {
    id: "faq",
    type: "faq",
    enabled: true,
    eyebrow: "FAQ",
    title: "Event management questions, answered.",
    subtitle: "Common questions about working with an event management company in Dubai.",
    settings: {
      faqs: [
        {
          question: "How far in advance should I start planning an event in Dubai?",
          answer:
            "The timeline depends on the event type. Corporate dinners and product launches typically require 6–8 weeks. Conferences and summits need 3–6 months. Weddings and large celebrations benefit from 6–12 months of planning for venue availability and vendor coordination.",
        },
        {
          question: "Why should I hire an event management company in Dubai?",
          answer:
            "Hiring an event management company gives you access to experienced producers, creative directors, production specialists, and logistics coordinators without building a large in-house team. A professional team helps reduce risk, manage vendor relationships, and deliver a flawless guest experience.",
        },
        {
          question: "What event management services do you offer in Dubai?",
          answer:
            "Gaila provides a full range of event management services in Dubai, including corporate events, conferences and summits, weddings and celebrations, event production and AV, creative direction and décor, venue sourcing and logistics, experiential activations, and event strategy consulting.",
        },
        {
          question: "Can you manage both corporate and private events?",
          answer:
            "Yes. We manage corporate galas, product launches, conferences, award ceremonies, weddings, engagements, and private celebrations. Our team adapts the production scale and creative approach to match each brief and budget.",
        },
        {
          question: "Do you handle bilingual events in English and Arabic?",
          answer:
            "Yes. Bilingual programming is standard for our Dubai events — signage, host teams, printed materials, and stage content in English and Arabic where the guest list requires it.",
        },
      ],
    },
  },
  {
    id: "cta",
    type: "ctaBanner",
    enabled: true,
    title: "Ready to Plan Your Next Event with Gaila in Dubai?",
    subtitle:
      "Memorable events don't happen by chance. They happen when the right strategy meets flawless execution and a team that's genuinely invested in your success.",
    settings: {
      body: "If you're looking for an event management company in Dubai that's serious about delivering on every brief, let's talk.",
      ctaLabel: "Speak to our team",
      ctaHref: "tel:+971502827279",
    },
  },
];

export const servicesSections: PageSection[] = [
  {
    id: "services-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "SERVICES",
    title: "Event Management Services in Dubai Built Around One Thing — Your Event",
    subtitle:
      "Gaila offers a full suite of event management services in Dubai designed to work together as one connected production system. From corporate events and conferences to weddings, production, décor, and logistics — every service is built to create memorable experiences, manage complexity, and deliver on every brief.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Event production team at work",
      ctaLabel: "Request a proposal",
      ctaHref: "tel:+971502827279",
      secondaryCtaLabel: "See our case studies",
      secondaryCtaHref: "/case-studies",
      categories: heroCategories,
    },
  },
  {
    id: "services-grid",
    type: "servicesEditorial",
    enabled: true,
    eyebrow: "OUR SERVICES",
    title: "Event Services Tailored to Your Goals",
    subtitle:
      "Every event requires a different approach. That's why our services are designed to solve specific challenges while working together as part of a comprehensive event management ecosystem. Explore our core services and discover how Gaila helps organisations create unforgettable experiences.",
    settings: {
      limit: 8,
      layout: "stacked",
      cards: [...servicesOverviewCards],
    },
  },
  {
    id: "services-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Not sure which service fits your event?",
    subtitle:
      "Tell us what you're planning. We'll recommend the right starting point — one service or a full production engagement.",
    settings: { ctaLabel: "Send an event brief", ctaHref: "/contact?topic=services" },
  },
];

export const aboutSections: PageSection[] = [
  {
    id: "about-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "ABOUT US",
    title: "The Event Management Company Dubai Trusts to Deliver",
    subtitle: "",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Gaila team in Dubai",
      ctaLabel: "Plan your event",
      ctaHref: "/contact",
      secondaryCtaLabel: "See our work",
      secondaryCtaHref: "/case-studies",
      categories: heroCategories,
    },
  },
  {
    id: "about-who",
    type: "imageText",
    enabled: true,
    title: "Who We Are",
    subtitle:
      "Gaila is an event management company in Dubai built for organisations and families that are serious about their events. We combine strategy, creative direction, production, and logistics into one connected system — designed to help you create experiences that guests remember and stakeholders trust.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Gaila producers and creatives in Dubai",
      align: "left",
      body: "We're not a one-size-fits-all agency. We're a focused team of producers, creatives, and logistics specialists who care about one thing — events that actually deliver on the brief.",
      headingAs: "h2",
    },
  },
  {
    id: "about-why",
    type: "imageText",
    enabled: true,
    title: "Why We Started",
    subtitle:
      "Dubai is one of the most ambitious event markets in the world. We saw too many organisations investing in events that looked impressive but fell apart on the night. Gaila was built to change that — to be the company that connects creative vision to flawless execution, and ambition to reliable delivery.",
    settings: {
      image: IMG.heroDubai,
      imageAlt: "Dubai skyline — where Gaila was founded",
      align: "right",
      body: "",
      headingAs: "h2",
    },
  },
  {
    id: "about-believe",
    type: "imageText",
    enabled: true,
    title: "What We Believe",
    subtitle:
      "Great events aren't about guest counts or Instagram moments alone. They're about creating experiences people trust, programmes that achieve objectives, and production that runs flawlessly under pressure. Every decision we make is guided by the brief, shaped by creativity, and measured against real event outcomes.",
    settings: {
      image: IMG.decor,
      imageAlt: "Creative direction and décor at Gaila",
      align: "left",
      body: "",
      headingAs: "h2",
    },
  },
  {
    id: "about-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Work with Gaila",
    subtitle:
      "Tell us about your event for the next four quarters. We'll come back with an honest view on where we can — and where we can't — help.",
    settings: { ctaLabel: "Plan with Gaila", ctaHref: "/contact?topic=partnership" },
  },
];

export const newPageSections: PageSection[] = [
  {
    id: "page-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "New page",
    title: "Page heading",
    subtitle: "Add a short introduction for this page, then build the rest of the layout below.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Gaila studio",
      ctaLabel: "Plan your event",
      ctaHref: "/contact",
      secondaryCtaLabel: "Browse the site",
      secondaryCtaHref: "/",
      categories: heroCategories,
    },
  },
  {
    id: "page-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Ready to launch this page?",
    subtitle: "Use this shared CTA band or replace it with custom sections from the editor.",
    settings: { ctaLabel: "Speak to our team", ctaHref: "/contact" },
  },
];

export const paidMediaSections: PageSection[] = [
  {
    id: "paid-media-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Conference & summit management in Dubai",
    subtitle:
      "Conference and summit management is a results-driven discipline where every element — programme design, speaker logistics, registration, staging, and delegate experience — is measured against real outcomes. Unlike one-off gatherings, a well-run conference builds authority, generates leads, and compounds your brand's industry presence.",
    settings: {
      image: IMG.conference,
      imageAlt: "Conference staging and delegate experience in Dubai",
      ctaLabel: "Request a proposal",
      ctaHref: "tel:+971502827279",
      categories: [],
    },
  },
  {
    id: "paid-media-platforms",
    type: "servicesEditorial",
    enabled: true,
    title: "Conference Formats We Deliver",
    subtitle:
      "As a leading conference management company in Dubai, we match every organisation with the right format based on audience, objectives, and market expectations.",
    settings: {
      layout: "stacked",
      cards: [
        {
          title: "Industry Summits",
          description:
            "Multi-track programmes with keynote stages, panel discussions, and networking receptions designed to position your brand as a thought leader in your sector.",
        },
        {
          title: "Dealer & Partner Conferences",
          description:
            "Annual gatherings that align sales teams, reveal new products, and strengthen partner relationships — managed end-to-end from invitation to post-event follow-up.",
        },
        {
          title: "Hybrid & Virtual Conferences",
          description:
            "Live streaming, virtual breakout rooms, and on-demand content that extend your reach beyond the ballroom without compromising the in-room experience.",
        },
        {
          title: "Executive Roundtables",
          description:
            "Intimate, invitation-only sessions for C-suite audiences — curated guest lists, bespoke programming, and discreet production across Dubai's premium venues.",
        },
        {
          title: "Exhibition & Trade Shows",
          description:
            "Floor plans, exhibitor management, sponsor activations, and visitor journey design for events at DWTC, ADNEC, and boutique exhibition spaces.",
        },
        {
          title: "Award Ceremonies",
          description:
            "Stage design, nominee management, live production, and guest experience for industry awards that reflect the prestige of the recognition.",
        },
        {
          title: "Post-Event Content Programmes",
          description:
            "Session recordings, highlight reels, and delegate communications that extend the value of your conference long after the closing session.",
        },
      ],
    },
  },
  {
    id: "paid-media-tracking",
    type: "imageText",
    enabled: true,
    title: "Our Delegate Experience Framework",
    settings: {
      body:
        "A conference fails when delegates feel like an afterthought. Before we confirm a single vendor, we map the full delegate journey — registration, arrival, sessions, networking, catering, and departure — and stress-test every touchpoint.\n\nEvery conference we produce is tied to real success metrics — not just attendance numbers. Delegate satisfaction, sponsor ROI, pipeline generated, and media coverage — we measure what actually matters to your organisation.\n\nOur conference management services in Dubai are built on one principle — if the delegate experience isn't designed, it won't deliver.",
      image: IMG.conference,
      imageAlt: "Delegate experience planning for conferences",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "paid-media-roadmap",
    type: "processSteps",
    enabled: true,
    title: "The 90-Day Conference Roadmap",
    subtitle:
      "We don't guess. Every new conference starts with a structured 90-day production roadmap covering programme design, speaker logistics, venue setup, sponsor activations, and rehearsal schedules. By day 90, every element is confirmed and ready.",
    settings: {
      steps: [
        {
          title: "Days 1–30",
          text: "Brief, venue selection, programme design, speaker confirmations",
        },
        {
          title: "Days 31–60",
          text: "Registration launch, sponsor activations, production planning, vendor contracts",
        },
        {
          title: "Days 61–90",
          text: "Rehearsals, final run-of-show, delegate communications, show-day execution",
        },
      ],
    },
  },
  {
    id: "paid-media-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Request a proposal",
    subtitle: "Tell us your conference goals and timeline. We'll come back with a practical plan in the first call.",
    settings: {
      body:
        "Whether you need a full-service conference management partner in Dubai or a specialist production team to plug into your existing setup — we're built for both.",
      ctaLabel: "Request a proposal",
      ctaHref: "tel:+971502827279",
      variant: "dark",
    },
  },
];

export const seoDubaiSections: PageSection[] = [
  {
    id: "seo-dubai-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Corporate Events in Dubai That Deliver Real Business Outcomes",
    subtitle:
      "Most corporate events in Dubai fail to deliver on their brief — not because the venue was wrong, but because the planning, production, and guest experience were treated as separate problems. As a trusted corporate events company in Dubai, Gaila designs end-to-end experiences that reflect your brand and achieve measurable results.",
    settings: {
      image: IMG.corporate,
      imageAlt: "Corporate gala and event staging in Dubai",
      ctaLabel: "Request a proposal",
      ctaHref: "tel:+971502827279",
      categories: [],
    },
  },
  {
    id: "seo-dubai-overview",
    type: "imageText",
    enabled: true,
    eyebrow: "CORPORATE EVENTS IN DUBAI",
    title: "Corporate Event Management That Builds Last-Term Relationships",
    subtitle: "Why Corporate Events Are the Most Valuable Investment a Dubai Business Can Make",
    settings: {
      body:
        "In today's business landscape, organisations in Dubai need more than one channel to build relationships. While digital marketing delivers reach, corporate events create the face-to-face moments that compound into partnerships, pipeline, and brand loyalty — driving consistent engagement that grows year on year.\n\nFor businesses in Dubai competing in one of the most active corporate markets in the world, events are not optional. They're the difference between being remembered by the clients and partners who matter — and being invisible while your competitors host the gala they're talking about.",
      image: IMG.corporate,
      imageAlt: "Corporate event planning and guest experience",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-agency",
    type: "imageText",
    enabled: true,
    title: "What Does a Corporate Events Company in Dubai Actually Do?",
    subtitle:
      "A good corporate events company in Dubai does far more than book a ballroom. It builds a system that makes your event the most polished, most on-brand, and most operationally sound experience your guests will attend this year.",
    settings: {
      body:
        "At Gaila, our corporate event services in Dubai are built across five core pillars:",
      image: IMG.studioTeam,
      imageAlt: "Gaila corporate event producers in Dubai",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-pillars",
    type: "servicesEditorial",
    enabled: true,
    title: "Five Core Pillars of Our Corporate Event Services",
    settings: {
      layout: "stacked",
      cards: [
        {
          title: "Event Strategy & Briefing",
          description:
            "Every event starts with a clear brief. We conduct a comprehensive discovery covering objectives, audience, budget, success metrics, and brand requirements — ensuring every decision downstream supports your business goals.",
        },
        {
          title: "Creative Direction & Décor",
          description:
            "Every touchpoint is an opportunity to impress. We design spatial concepts, tablescapes, floral styling, signage, and branded moments — ensuring every guest feels the brand from arrival to farewell.",
        },
        {
          title: "Venue Sourcing & Logistics",
          description:
            "When you need a ballroom, a rooftop, or a desert setting, venue selection determines whether your event succeeds. We source venues across Dubai and the UAE, negotiate contracts, and manage load-in, guest transport, and run-of-show logistics.",
        },
        {
          title: "Production & Technical",
          description:
            "Flawless events require flawless production. We manage staging, lighting, sound, AV, live streaming, and show calling — ensuring your programme runs on time and every speaker is heard.",
        },
        {
          title: "Guest Experience & Follow-Through",
          description:
            "Post-event engagement is one of the strongest relationship signals. We design invitation flows, registration systems, on-site hospitality, and follow-up communications that convert attendance into lasting connections.",
        },
      ],
    },
  },
  {
    id: "seo-dubai-market",
    type: "imageText",
    enabled: true,
    title: "Corporate Events for Dubai's Unique Market",
    settings: {
      body:
        "Dubai's corporate event landscape is unlike any other market in the world. You have a highly international audience attending in multiple languages, a business environment that moves fast, and competition from both local organisations and global brands hosting events in the same calendar window. Effective corporate event management in Dubai needs to account for all of this.\n\nThat means bilingual programming in English and Arabic, an understanding of UAE business culture and seasonality, and production that works across hotel ballrooms, outdoor venues, and hybrid formats.\n\nOur team has deep experience in Dubai's event market — we know which venues deliver, which production setups perform best with UAE audiences, and how to build events that guests remember and stakeholders trust to repeat.",
      image: IMG.heroDubai,
      imageAlt: "Dubai skyline representing the corporate events market",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-strategy",
    type: "imageText",
    enabled: true,
    title: "What Makes a Great Corporate Event in 2026?",
    subtitle:
      "Corporate events in 2026 go beyond the traditional gala format. Hybrid attendance, immersive activations, and content capture are now expected — and the organisations that invest in experience design pull ahead of those treating events as a line item.",
    settings: {
      body:
        "The organisations that will lead their industries in Dubai over the next five years are the ones investing in:",
      footer: "As a corporate events company in Dubai, this is exactly how we build every engagement.",
      checklistTitle: "",
      bullets: [
        "Clear objectives — every event tied to a measurable business outcome",
        "Immersive experience design — guests who feel the brand, not just see a slideshow",
        "Flawless production — staging, AV, and show calling that runs without surprises",
        "Hybrid readiness — live streaming and content capture for audiences beyond the room",
        "Post-event follow-through — communications that convert attendance into pipeline",
      ],
      image: IMG.gala,
      imageAlt: "Modern corporate event design and production",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-why-gaila",
    type: "imageText",
    enabled: true,
    title: "Why Businesses Choose Gaila for Corporate Events in Dubai",
    settings: {
      body: "",
      checklistTitle: "",
      bullets: [
        "120-item pre-event planning checklist — the most thorough in the market",
        "Bilingual event programming — English and Arabic",
        "Venue sourcing built for Dubai's landscape",
        "Hybrid and live streaming included where the brief requires it",
        "Creative direction built for brand immersion — not generic décor",
        "Transparent post-event reporting tied to attendance and outcomes",
        "No shortcuts, no last-minute surprises — reliable delivery only",
        "Deep understanding of UAE business culture and guest expectations",
      ],
      image: IMG.studioTeam,
      imageAlt: "Gaila team delivering corporate events for Dubai brands",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Ready to Plan Your Next Corporate Event in Dubai?",
    subtitle:
      "If you're serious about creating an event that reflects your brand, engages your audience, and delivers measurable outcomes — our corporate event services in Dubai are built for you.",
    settings: {
      body:
        "We'll review your brief, identify your biggest opportunities, and show you exactly what it would take to deliver an event your guests remember.",
      ctaLabel: "Request a proposal",
      ctaHref: "tel:+971502827279",
      variant: "dark",
    },
  },
];

export const socialMediaSections: PageSection[] = [
  {
    id: "social-media-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Wedding & Celebration Planner in Dubai",
    subtitle:
      "As a wedding and celebration planner in Dubai, Gaila creates events that go beyond décor and guest lists. We design experiences that honour your story, reflect your culture, and leave every guest with a memory they'll talk about for years.",
    settings: {
      image: IMG.wedding,
      imageAlt: "Wedding celebration and event styling in Dubai",
      ctaLabel: "Plan your celebration",
      ctaHref: "tel:+971502827279",
      categories: [],
    },
  },
  {
    id: "social-media-brand",
    type: "imageText",
    enabled: true,
    title: "Create an Unforgettable Celebration Through Thoughtful Planning",
    settings: {
      body:
        "Weddings and milestone celebrations have become some of the most meaningful events in a family's life. However, success requires more than beautiful flowers. It requires a clear vision, consistent execution, creative storytelling, and a deep understanding of cultural traditions and guest expectations.\n\nAt Gaila, we provide wedding and celebration planning in Dubai designed to help couples and families create meaningful moments while managing every detail with precision. Our team develops bespoke plans that combine stunning creative direction, vendor coordination, and flawless day-of production to maximise joy, comfort, and lasting memories.\n\nAs a leading wedding planner in Dubai, we help families establish celebrations across hotel ballrooms, desert venues, yacht charters, and private estates. From concept development and creative direction to guest logistics and show-day management, every element is designed to honour your story and support a celebration you'll cherish forever.",
      image: IMG.wedding,
      imageAlt: "Wedding planning and celebration design in Dubai",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "social-media-services",
    type: "servicesEditorial",
    enabled: true,
    title: "Our Wedding & Celebration Services",
    settings: {
      layout: "stacked",
      cards: [
        {
          title: "Full Wedding Planning",
          description:
            "End-to-end planning from engagement to farewell — venue sourcing, vendor management, creative direction, and day-of coordination.",
        },
        {
          title: "Creative Direction & Décor",
          description:
            "Bespoke spatial design, floral styling, tablescapes, lighting, and signage that transform your venue into a reflection of your story.",
        },
        {
          title: "Vendor Coordination",
          description:
            "Curated vendor relationships across catering, photography, entertainment, florals, and transport — managed under one production team.",
        },
        {
          title: "Guest Logistics",
          description:
            "Invitation design, RSVP management, accommodation blocks, transport coordination, and on-site hospitality for local and international guests.",
        },
        {
          title: "Cultural & Bilingual Programming",
          description:
            "Celebrations that honour Arabic, Indian, Western, and multi-cultural traditions — with bilingual hosts, signage, and ceremony elements.",
        },
        {
          title: "Day-of Production",
          description:
            "A dedicated show team managing timeline, vendors, staging, and guest experience so you can be fully present on your day.",
        },
      ],
    },
  },
  {
    id: "social-media-why",
    type: "imageText",
    enabled: true,
    title: "Why Invest in Professional Wedding Planning?",
    settings: {
      body:
        "Whether you're planning an intimate gathering or a multi-day celebration, our wedding and event planning services help you create lasting memories while managing complexity behind the scenes.",
      checklistTitle: "",
      bullets: [
        "Reduce stress on your most important day",
        "Access curated vendor relationships",
        "Ensure creative consistency across every touchpoint",
        "Manage guest logistics for local and international attendees",
        "Handle cultural and bilingual requirements seamlessly",
        "Deliver flawless day-of production",
        "Create a celebration that reflects your story",
      ],
      image: IMG.studioTeam,
      imageAlt: "Gaila wedding planning team in Dubai",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "social-media-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Plan your celebration",
    subtitle: "Tell us about your event and timeline. We'll come back with a practical plan in the first call.",
    settings: {
      body:
        "Whether you need a full-service wedding planner in Dubai or a specialist team for creative direction and day-of production — we're built for both.",
      ctaLabel: "Plan your celebration",
      ctaHref: "tel:+971502827279",
      variant: "dark",
    },
  },
];

export const videoProductionSections: PageSection[] = [
  {
    id: "video-production-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "EVENT PRODUCTION & AV IN DUBAI",
    subtitle:
      "At Gaila, we provide event production and AV services in Dubai that combine technical precision, creative staging, and seamless execution. From lighting and sound to LED walls, live streaming, and show calling, every element is designed to support your event objectives and run flawlessly under pressure.",
    settings: {
      image: IMG.production,
      imageAlt: "Professional event production and AV in Dubai",
      ctaLabel: "Request a proposal",
      ctaHref: "tel:+971502827279",
      categories: [],
    },
  },
  {
    id: "video-production-overview",
    type: "imageText",
    enabled: true,
    title: "Professional Event Production That Brings Your Vision to Life",
    settings: {
      body:
        "Event production has become the backbone of every memorable gathering in Dubai. Whether you're hosting a 2,000-delegate summit, an intimate gala dinner, or a product launch with broadcast-quality streaming, professionally managed production ensures your message lands and your guests feel the difference.\n\nAt Gaila, we provide event production and AV services in Dubai that combine technical expertise, creative staging, and calm show-day execution. From rigging and lighting design to sound engineering, LED content, live streaming, and show calling, every project is built to run flawlessly under pressure.\n\nAs a trusted event production company in Dubai, we handle the entire technical scope — site surveys, CAD staging plans, equipment procurement, crew management, rehearsals, and live operation. Our team delivers production for ballrooms, outdoor venues, exhibition halls, and hybrid broadcast setups across the UAE.",
      image: IMG.production,
      imageAlt: "Event production crew setting up in Dubai",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "video-production-services",
    type: "servicesEditorial",
    enabled: true,
    title: "Our Event Production Services",
    settings: {
      layout: "stacked",
      cards: [
        {
          title: "Staging & Set Design",
          description:
            "Custom stage builds, backdrop design, and spatial layouts that transform any venue into a polished event environment.",
        },
        {
          title: "Lighting Design",
          description:
            "Ambient, architectural, and theatrical lighting that sets the mood, highlights speakers, and creates photo-worthy moments.",
        },
        {
          title: "Sound & Audio",
          description:
            "Crystal-clear audio for speeches, panels, performances, and ambient music — engineered for every venue size and acoustics profile.",
        },
        {
          title: "LED Walls & Visual Content",
          description:
            "High-resolution LED displays, content playback, and motion graphics that support presentations, branding, and immersive moments.",
        },
        {
          title: "Live Streaming & Hybrid Production",
          description:
            "Multi-camera live streams, virtual delegate platforms, and on-demand recording for hybrid and virtual audiences.",
        },
        {
          title: "Show Calling & Technical Direction",
          description:
            "Experienced show callers managing cue sheets, speaker transitions, and live operations so your programme runs on time, every time.",
        },
      ],
    },
  },
  {
    id: "video-production-why",
    type: "imageText",
    enabled: true,
    title: "Why Invest in Professional Event Production?",
    settings: {
      body: "",
      footer:
        "High-quality event production helps organisations communicate more effectively, connect with audiences faster, and create memorable guest experiences. Whether you need production for a single gala or an ongoing event programme, Gaila delivers technical solutions that make every event feel effortless.",
      checklistTitle: "",
      bullets: [
        "Flawless audio and visual for every speaker and moment",
        "Staging that transforms any venue",
        "Live streaming for hybrid and remote audiences",
        "Experienced show callers who manage the programme",
        "Technical rehearsals that prevent show-day surprises",
        "Equipment and crew managed under one team",
        "Content capture for post-event communications",
        "Production that scales from 50 to 5,000 guests",
      ],
      image: IMG.studioTeam,
      imageAlt: "Gaila event production team in Dubai",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "video-production-process",
    type: "processSteps",
    enabled: true,
    title: "Why Clients Choose Our Event Production Company in Dubai",
    subtitle:
      "From first site survey to show-day execution, our end-to-end workflow keeps every production on brief, on schedule, and ready for the moment guests arrive.",
    settings: {
      steps: [
        {
          title: "Site Survey",
          text: "We assess venue power, rigging points, load-in access, and acoustics so every technical decision is grounded in the actual space.",
        },
        {
          title: "Design",
          text: "Our team develops CAD staging plans, lighting plots, audio diagrams, and run-of-show documents that translate the brief into executable production.",
        },
        {
          title: "Build",
          text: "Professional crews, equipment, and direction bring the design to life — in ballrooms, outdoor venues, or exhibition halls across Dubai and the UAE.",
        },
        {
          title: "Rehearsal",
          text: "Technical rehearsals, speaker walkthroughs, and cue-to-cue run-throughs refine every element before the first guest arrives.",
        },
        {
          title: "Show Day",
          text: "Live operation with show calling, technical direction, and on-site troubleshooting — so your programme runs on time and every moment lands.",
        },
        {
          title: "Wrap & Review",
          text: "Equipment strike, content delivery, and a post-event debrief that informs future productions and maximises return on investment.",
        },
      ],
    },
  },
  {
    id: "video-production-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Request a proposal",
    subtitle: "Tell us about your event and timeline. We'll come back with a practical production plan in the first call.",
    settings: {
      body:
        "Whether you need production for a single gala or an ongoing event programme in Dubai — we're built for both.",
      ctaLabel: "Request a proposal",
      ctaHref: "tel:+971502827279",
      variant: "dark",
    },
  },
];

export const defaultPages = [
  {
    title: "Home",
    slug: "home",
    status: "published",
    template: "landing",
    showInHeader: true,
    headerLabel: "Home",
    headerOrder: 0,
    seo: {
      title: "Gaila | Event Management Company in Dubai",
      description:
        "Gaila is a Dubai event management company combining strategy, creative direction, production, and logistics into one accountable team for corporate events, conferences, and celebrations.",
    },
    sections: homeSections,
  },
  {
    title: "Services",
    slug: "services",
    status: "published",
    template: "standard",
    showInHeader: true,
    headerLabel: "Services",
    headerOrder: 1,
    seo: {
      title: "Event Management Services in Dubai | Gaila",
      description:
        "Explore Gaila event services in Dubai: corporate events, conferences, weddings, event production, creative direction, venue sourcing, experiential activations, and consulting.",
    },
    sections: servicesSections,
  },
  {
    title: "Conferences & Summits",
    slug: "service-paid-media",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Conference & Summit Management Dubai | Gaila",
      description:
        "Plan and deliver conferences and summits in Dubai with a team focused on programme design, delegate experience, hybrid streaming, and sponsor activations.",
    },
    sections: paidMediaSections,
  },
  {
    title: "Corporate Events",
    slug: "service-seo-dubai",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Corporate Events Dubai | Corporate Event Management | Gaila",
      description:
        "Corporate event management in Dubai — galas, product launches, award ceremonies, and leadership events with end-to-end planning, production, and guest experience.",
    },
    sections: seoDubaiSections,
  },
  {
    title: "Weddings & Celebrations",
    slug: "service-social-media",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Wedding Planner Dubai | Celebration Events | Gaila",
      description:
        "Wedding and celebration planning in Dubai — venue sourcing, creative direction, vendor coordination, and day-of production for unforgettable events.",
    },
    sections: socialMediaSections,
  },
  {
    title: "Event Production & AV",
    slug: "service-video-production",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Event Production & AV Dubai | Gaila",
      description:
        "Event production and AV services in Dubai — staging, lighting, sound, LED walls, live streaming, and show calling for conferences, galas, and launches.",
    },
    sections: videoProductionSections,
  },
  {
    title: "Case Studies",
    slug: "case-studies",
    status: "published",
    template: "standard",
    showInHeader: true,
    headerLabel: "Case Studies",
    headerOrder: 2,
    seo: {
      title: "Event Management Case Studies Dubai | Gaila",
      description:
        "Recent Dubai events for Fenty Beauty, Ford Middle East, Oberoi Yachts, 8th Café and more — galas, summits, launches, and celebrations.",
    },
    sections: [
      {
        id: "case-hero",
        type: "heroEditorial",
        enabled: true,
        eyebrow: "Selected work",
        title: "Events that deliver results.",
        subtitle:
          "A working selection of events we've produced across beauty, automotive, luxury, hospitality, and lifestyle — with the actual numbers, not the stock photos.",
        settings: {
          image: IMG.gala,
          imageAlt: "Editorial event photography",
          ctaLabel: "Plan your event",
          ctaHref: "/contact",
          secondaryCtaLabel: "Explore services",
          secondaryCtaHref: "/services",
          categories: heroCategories,
        },
      },
      {
        id: "case-marquee",
        type: "marquee",
        enabled: true,
        settings: {
          speedSeconds: 42,
          items: [
            "Fenty Beauty",
            "Ford Middle East",
            "Oberoi Yachts",
            "8th Café",
            "Baaqat Flowers",
            "Hospitality Group",
            "Galas · Summits · Launches",
          ],
        },
      },
      { id: "case-grid", type: "caseStudyGrid", enabled: true, title: "Recent events", settings: {} },
      {
        id: "case-imagetext",
        type: "imageText",
        enabled: true,
        eyebrow: "Our approach",
        title: "Built around the one outcome that decides whether an event worked.",
        subtitle: "Outcome-led production, not deck-led production.",
        settings: {
          image: IMG.decor,
          imageAlt: "Gaila team at work on an event",
          align: "left",
          body:
            "Every Gaila engagement starts with one question: what outcome will tell us this worked? We rebuild creative, production, and the guest journey around that number, then run weekly confirmations against it. The case studies on this page all share the same DNA — a clear outcome, honest reporting, and a production playbook the in-house team keeps using long after the event ends.",
        },
      },
      {
        id: "case-stats",
        type: "statsBand",
        enabled: true,
        eyebrow: "Outcomes that compound",
        title: "Numbers from the past 12 months.",
        settings: {
          stats: [
            { value: "3.2x", label: "Sponsor ROI for hospitality group gala" },
            { value: "200+", label: "Events delivered across Dubai and the UAE" },
            { value: "+120%", label: "Social engagement for Fenty Beauty launch" },
            { value: "180+", label: "Production days delivered" },
          ],
        },
      },
      {
        id: "cta",
        type: "ctaBanner",
        enabled: true,
        title: "Want an event like this for your brand?",
        subtitle: "Tell us what you're planning and we'll share a practical proposal in the first call.",
        settings: { ctaLabel: "Plan your event", ctaHref: "/contact" },
      },
    ],
  },
  {
    title: "Blog",
    slug: "blog",
    status: "published",
    template: "standard",
    showInHeader: true,
    headerLabel: "Blog",
    headerOrder: 3,
    seo: {
      title: "Event Planning Blog Dubai | Gaila",
      description:
        "Practical event planning, venue selection, hybrid formats, and Dubai-market insights for organisations hosting events across the UAE.",
    },
    sections: [
      {
        id: "blog-hero",
        type: "heroEditorial",
        enabled: true,
        eyebrow: "Blog",
        title: "Working notes from a Dubai event studio.",
        subtitle:
          "Field notes on corporate events, venue selection, hybrid formats, and event production from our work across the UAE.",
        settings: {
          image: IMG.studioTeam,
          imageAlt: "Editorial workspace",
          ctaLabel: "Plan your event",
          ctaHref: "/contact",
          secondaryCtaLabel: "Browse services",
          secondaryCtaHref: "/services",
          categories: heroCategories,
        },
      },
      {
        id: "blog-marquee",
        type: "marquee",
        enabled: true,
        settings: {
          speedSeconds: 45,
          items: [
            "Corporate Events",
            "Conferences",
            "Weddings",
            "Venue Selection",
            "Hybrid Events",
            "Event Production",
            "Dubai Venues",
          ],
        },
      },
      {
        id: "blog-grid",
        type: "caseStudyGrid",
        enabled: true,
        title: "Latest thinking",
        settings: { categorySlug: "insights" },
      },
      {
        id: "blog-quote",
        type: "quote",
        enabled: true,
        eyebrow: "How we write",
        settings: {
          quote:
            "We write the field notes we wish we'd had two years ago — what actually made Dubai events succeed, what wasted budget, and what we'd do differently on a six-figure production.",
          author: "Hassan Karim",
          role: "Head of Strategy · Gaila",
          image: IMG.studioTeam,
        },
      },
      {
        id: "blog-stats",
        type: "statsBand",
        enabled: true,
        eyebrow: "Editorial output",
        title: "Field notes from the studio, in numbers.",
        settings: {
          stats: [
            { value: "70+", label: "Field notes published since 2022" },
            { value: "Weekly", label: "Cadence — new note every Tuesday" },
            { value: "AR / EN", label: "Bilingual coverage across pieces" },
            { value: "14", label: "Client briefings that reused a piece" },
          ],
        },
      },
      {
        id: "blog-cta",
        type: "ctaBanner",
        enabled: true,
        title: "Want this kind of thinking on your event?",
        subtitle:
          "These notes come out of producing real Dubai events. If you'd like that thinking applied to yours, talk to the producers writing them.",
        settings: { ctaLabel: "Speak to our team", ctaHref: "/contact?topic=insights" },
      },
    ],
  },
  {
    title: "About",
    slug: "about",
    status: "published",
    template: "standard",
    showInHeader: true,
    headerLabel: "About",
    headerOrder: 4,
    seo: {
      title: "About Gaila | Event Management Company Dubai",
      description:
        "Gaila is an event management company in Dubai built for organisations and families serious about their events — strategy, creative direction, and production in one connected system.",
    },
    sections: aboutSections,
  },
  {
    title: "Contact",
    slug: "contact",
    status: "published",
    template: "contact",
    showInHeader: true,
    headerLabel: "Contact",
    headerOrder: 5,
    seo: {
      title: "Contact Gaila | Event Management Company Dubai",
      description:
        "Contact Gaila in Dubai — corporate events, conferences, weddings, production, and logistics for UAE brands and families.",
    },
    sections: [
      {
        id: "contact-hero",
        type: "heroEditorial",
        enabled: true,
        eyebrow: "Contact",
        title: "Tell us about your event.",
        subtitle:
          "We typically respond within one business day. For urgent enquiries, WhatsApp the number in the footer and we'll come back the same day.",
        settings: {
          image: IMG.heroDubai,
          imageAlt: "Dubai skyline",
          ctaLabel: "WhatsApp",
          ctaHref: "/contact",
          secondaryCtaLabel: "See our work",
          secondaryCtaHref: "/case-studies",
          categories: heroCategories,
        },
      },
      {
        id: "contact-form",
        type: "contactForm",
        enabled: true,
        title: "Start a conversation",
        subtitle:
          "Share a little about your event and your goals. The more context you can give, the more useful our first response will be.",
        settings: {},
      },
      {
        id: "contact-imagetext",
        type: "imageText",
        enabled: true,
        eyebrow: "Response time",
        title: "Briefs get a same-week reply, usually inside one business day.",
        subtitle: "Sunday — Thursday, 09:00 to 19:00 GST.",
        settings: {
          image: IMG.studioTeam,
          imageAlt: "Gaila team in the Dubai studio",
          align: "right",
          body:
            "Our team in Dubai monitors inbound enquiries from 09:00 to 19:00 GST, Sunday to Thursday. Briefs sent overnight get a same-morning response, and weekend events are covered on WhatsApp. The first reply is always written by a senior producer, not an account handler.",
        },
      },
      {
        id: "contact-faq",
        type: "faq",
        enabled: true,
        eyebrow: "Working with Gaila",
        title: "Quick answers before the first call.",
        settings: {
          faqs: [
            {
              question: "What's the fastest way to get started?",
              answer:
                "A 30-minute intro call. We'll ask about your event, timeline, and budget, then send a written proposal within two business days.",
            },
            {
              question: "Are you available outside the UAE?",
              answer:
                "Yes. Our roster includes events across the GCC, KSA, UK, and US. The studio is in Dubai but the team works across time zones.",
            },
            {
              question: "Do you work with first-time event organisers?",
              answer:
                "Selectively — we focus on clients ready to invest in proper planning and production. We'll be honest in the first call if Gaila isn't the right fit yet.",
            },
          ],
        },
      },
    ],
  },
];

export function sectionTemplate(type: SectionType): PageSection {
  if (!isSectionType(type)) {
    throw new Error(`Invalid section type: ${type}`);
  }

  return {
    id: `${type}-${Date.now()}`,
    type,
    enabled: true,
    title: "",
    eyebrow: "",
    subtitle: "",
    settings: {},
  };
}
