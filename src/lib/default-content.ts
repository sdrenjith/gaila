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
  eyebrow: "Krew Marketing · Dubai",
  headline: "Let's build something",
  headlineAccent: "that performs.",
  label: "Start a project",
  href: "/contact",
  visible: true,
} as const;

export const footerMenuItems: MenuItem[] = [
  { label: "About", href: "/about", order: 0, visible: true },
  { label: "Blog", href: "/blog", order: 1, visible: true },
  { label: "SEO Dubai", href: "/services/seo-dubai", order: 2, visible: true },
  { label: "Performance Marketing", href: "/services/paid-media", order: 3, visible: true },
  { label: "Social Media", href: "/services/social-media", order: 4, visible: true },
  { label: "Video Production", href: "/services/video-production", order: 5, visible: true },
  { label: "Brand & Creative", href: "/services/brand-creative", order: 6, visible: true },
  { label: "Contact", href: "/contact", order: 7, visible: true },
];

// Stable Unsplash URLs used as seed defaults. Editors can replace per record
// from the admin UI (upload or paste a different URL).
const IMG = {
  heroDubai:
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=80",
  studioTeam:
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=80",
  seo:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80",
  performance:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=80",
  social:
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1800&q=80",
  brand:
    "https://images.unsplash.com/photo-1611605698335-8b1569810432?auto=format&fit=crop&w=1800&q=80",
  video:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=80",
  beauty:
    "https://images.unsplash.com/photo-1522335789203-aaa0e7d04a96?auto=format&fit=crop&w=1800&q=80",
  car:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80",
  yacht:
    "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1800&q=80",
  cafe:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1800&q=80",
  flowers:
    "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1800&q=80",
  hospitality:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=80",
} as const;

export const services = [
  {
    kind: "service",
    title: "SEO & AI Search",
    slug: "seo-dubai",
    excerpt:
      "Most businesses in Dubai are invisible on Google. Not because their product is wrong — but because their SEO strategy is. As a trusted SEO agency in Dubai, Krew Marketing builds search visibility that compounds over time, turning your website into your most valuable sales asset.",
    body:
      "Krew Marketing delivers SEO services in Dubai built across technical SEO, on-page optimisation, local search, content strategy, and link building — with bilingual English and Arabic programmes, AI search optimisation, and transparent reporting tied to organic traffic and revenue.",
    coverImage: IMG.seo,
    tags: ["SEO", "AI Search", "Local SEO"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Average organic growth in 6 months", value: "+184%" },
      { label: "Technical audit depth", value: "140 checks" },
    ],
    seo: {
      title: "SEO Services Dubai | SEO Agency Dubai | Krew Marketing",
      description:
        "SEO services in Dubai that drive real organic growth — technical SEO, local search, bilingual strategy, AI search optimisation, and content built for long-term rankings.",
    },
  },
  {
    kind: "service",
    title: "Performance Marketing",
    slug: "paid-media",
    excerpt:
      "Performance marketing is a results-based approach to digital advertising where every campaign is measured against real business outcomes — leads generated, sales closed, revenue earned. Unlike traditional advertising, you only pay for what performs.",
    body:
      "Krew runs full-funnel paid media for Dubai brands across Google Search & Shopping, Performance Max, Meta Advantage+, TikTok Spark Ads, LinkedIn ABM, YouTube, and programmatic retargeting. Every account starts with a tracking and attribution audit, then follows a structured 90-day test roadmap before we scale what works.",
    coverImage: IMG.performance,
    tags: ["Google Ads", "Meta Ads", "LinkedIn", "Performance Max"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Median cost per qualified lead reduction", value: "-37%" },
      { label: "Optimisation cadence", value: "Weekly" },
    ],
    seo: {
      title: "Performance Marketing & PPC Agency Dubai | Krew Marketing",
      description:
        "Plan and scale Google Ads, Meta, TikTok, and LinkedIn campaigns with a Dubai performance marketing agency focused on qualified leads.",
    },
  },
  {
    kind: "service",
    title: "Social Media Marketing",
    slug: "social-media",
    excerpt:
      "As a social media marketing agency in Dubai, Krew Marketing builds social presence that goes beyond likes and follower counts. We create content that earns attention, builds genuine brand affinity, and converts audiences into customers.",
    body:
      "Krew Marketing provides social media marketing services in Dubai designed to help businesses build meaningful connections with their audience while achieving measurable business objectives. From content planning and creative production to community management and paid social advertising, we help brands establish a strong presence across Instagram, Facebook, LinkedIn, TikTok, X, and other emerging platforms.",
    coverImage: IMG.social,
    tags: ["Instagram", "TikTok", "Reels", "Content"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Reels produced per month", value: "12 — 24" },
      { label: "Average engagement lift", value: "+62%" },
    ],
    seo: {
      title: "Social Media Marketing Agency Dubai | Krew Marketing",
      description:
        "Social media marketing agency in Dubai — strategy, content creation, community management, paid social, reels, and analytics that build brand affinity and drive conversions.",
    },
  },
  {
    kind: "service",
    title: "Video Production",
    slug: "video-production",
    excerpt:
      "At Krew Marketing, we provide video production services in Dubai that combine strategic storytelling, creative direction, and high-quality production to create content that delivers measurable business results. From corporate films and commercial advertisements to social media content and brand documentaries, every project is designed to engage viewers and support your marketing objectives.",
    body:
      "Video has become one of the most powerful tools for capturing attention, building trust, and influencing purchasing decisions. Whether you're launching a new product, promoting a service, or strengthening your brand identity, professionally produced video content helps communicate your message in a way that resonates with modern audiences.\n\nAt Krew Marketing, we provide video production services in Dubai that combine strategic storytelling, creative direction, and high-quality production to create content that delivers measurable business results. From corporate films and commercial advertisements to social media content and brand documentaries, every project is designed to engage viewers and support your marketing objectives.\n\nAs a trusted video production company in Dubai, we handle the entire production process—from concept development and scriptwriting to filming, editing, motion graphics, and final delivery. Our team creates content optimized for websites, social media platforms, digital advertising campaigns, and broadcast channels.",
    coverImage: IMG.video,
    tags: ["Brand Films", "Commercials", "Corporate Video", "Social Content"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Shoot days delivered in 2025", value: "180+" },
      { label: "Average campaign turnaround", value: "3 — 5 weeks" },
    ],
    seo: {
      title: "Video Production Services Dubai | Krew Marketing",
      description:
        "Video production services in Dubai — corporate films, commercials, brand films, social content, event videography, and drone footage that delivers measurable business results.",
    },
  },
  {
    kind: "service",
    title: "Brand & Creative Direction",
    slug: "brand-creative",
    excerpt:
      "Brand strategy, visual identity, messaging frameworks, and campaign creative that travels across every channel — built for ambitious Dubai brands.",
    body:
      "Krew leads brands through positioning, naming, visual identity, voice, and the creative system that holds everything together — campaign visuals, packaging, decks, social templates, and ad creative concepts. We help in-house teams stop relying on ad-hoc designers and start operating from a clear, documented brand system.\nDeliverables include strategy decks, brand guidelines, asset libraries, motion templates, and quarterly creative refreshes.",
    coverImage: IMG.brand,
    tags: ["Branding", "Identity", "Creative Direction"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Brand sprint timeline", value: "4 — 6 weeks" },
      { label: "Deliverables", value: "Guidelines + asset system" },
    ],
    seo: {
      title: "Brand & Creative Agency Dubai | Krew Marketing",
      description:
        "Strategy-led brand identity, messaging, and creative direction for Dubai brands ready to look the part across every channel.",
    },
  },
  {
    kind: "service",
    title: "Web Design & Development",
    slug: "web-design",
    excerpt:
      "Fast, SEO-ready Next.js and Webflow websites and landing pages designed to convert paid and organic traffic into real enquiries.",
    body:
      "We design and build modern marketing sites with clear positioning, fast load times, strong SEO foundations, and a CMS marketing teams can manage without developers. Projects start with a positioning workshop, then move into UX flows, visual design, copywriting, build, QA, and a structured handover with documented content models and analytics.\nTypical builds: brand sites, product pages, multi-language sites (English / Arabic), and conversion-focused landing pages for paid campaigns.",
    coverImage: IMG.studioTeam,
    tags: ["Next.js", "Webflow", "Landing Pages", "CRO"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Lighthouse performance target", value: "95+" },
      { label: "Average lift in landing-page CVR", value: "+47%" },
    ],
    seo: {
      title: "Web Design & Development Agency Dubai | Krew Marketing",
      description:
        "Design and build a fast, SEO-friendly website with a Dubai web design agency focused on brand, conversion, and CMS control.",
    },
  },
  {
    kind: "service",
    title: "Influencer Marketing",
    slug: "influencer-marketing",
    excerpt:
      "Connect with trusted voices and relevant creators to increase brand awareness, build credibility, and reach highly engaged audiences through strategic influencer partnerships.",
    body:
      "Krew designs influencer programmes for Dubai and GCC brands — creator sourcing, brief development, contract coordination, content approvals, and performance reporting tied to reach, engagement, and conversion actions.\nWe match brands with creators whose audiences align with your category, run bilingual campaigns where needed, and integrate influencer content into paid social and organic channels for compounding reach.",
    coverImage: IMG.social,
    tags: ["Creators", "Partnerships", "UGC", "Campaigns"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Creator vetting criteria", value: "12-point scorecard" },
      { label: "Campaign reporting cadence", value: "Weekly" },
    ],
    seo: {
      title: "Influencer Marketing Agency Dubai | Krew Marketing",
      description:
        "Strategic influencer marketing in Dubai — creator partnerships, branded content, and campaigns that build credibility and reach engaged audiences.",
    },
  },
  {
    kind: "service",
    title: "Public Relations (PR)",
    slug: "public-relations",
    excerpt:
      "Strengthen your brand reputation through strategic media outreach, press coverage, corporate communications, brand storytelling, and public relations campaigns.",
    body:
      "Our PR team supports Dubai brands with media relations, press releases, executive profiling, launch communications, and ongoing reputation management across English and Arabic media.\nWe build journalist relationships, craft newsworthy narratives, coordinate interviews and features, and align PR moments with your wider marketing calendar — launches, awards, partnerships, and thought leadership.",
    coverImage: IMG.hospitality,
    tags: ["Media Relations", "Press", "Communications", "Storytelling"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Typical launch window", value: "4 — 6 weeks" },
      { label: "Markets", value: "UAE · GCC" },
    ],
    seo: {
      title: "Public Relations Agency Dubai | Krew Marketing",
      description:
        "Dubai PR agency for media outreach, press coverage, corporate communications, and brand storytelling for UAE and GCC brands.",
    },
  },
] satisfies Partial<ContentRecord>[];

export const servicesOverviewCards = [
  {
    title: "Performance Marketing",
    description:
      "Data-driven advertising campaigns designed to maximize return on investment, generate qualified leads, and accelerate business growth across Google, Meta, LinkedIn, TikTok, and other leading platforms.",
    href: "/services/paid-media",
    ctaLabel: "Explore Performance Marketing →",
    image: IMG.performance,
  },
  {
    title: "SEO",
    description:
      "Improve your search visibility, increase organic traffic, and attract customers actively searching for your products and services through strategic SEO solutions.",
    href: "/services/seo-dubai",
    ctaLabel: "Explore SEO Services →",
    image: IMG.seo,
  },
  {
    title: "Social Media",
    description:
      "Build meaningful customer relationships through creative content, platform-specific strategies, community management, and growth-focused social media campaigns.",
    href: "/services/social-media",
    ctaLabel: "Explore Social Media Marketing →",
    image: IMG.social,
  },
  {
    title: "Videography",
    description:
      "Create powerful visual content that captures attention, strengthens brand identity, and engages audiences across websites, social media, advertising campaigns, and digital platforms.",
    href: "/services/video-production",
    ctaLabel: "Explore Videography Services →",
    image: IMG.video,
  },
  {
    title: "Influencer Marketing",
    description:
      "Connect with trusted voices and relevant creators to increase brand awareness, build credibility, and reach highly engaged audiences through strategic influencer partnerships.",
    href: "/services/influencer-marketing",
    ctaLabel: "Explore Influencer Marketing →",
    image: IMG.social,
  },
  {
    title: "PR",
    description:
      "Strengthen your brand reputation through strategic media outreach, press coverage, corporate communications, brand storytelling, and public relations campaigns.",
    href: "/services/public-relations",
    ctaLabel: "Explore Public Relations Services →",
    image: IMG.hospitality,
  },
  {
    title: "Branding",
    description:
      "Develop a distinctive brand identity, messaging framework, and creative direction that helps your business stand out in a competitive marketplace.",
    href: "/services/brand-creative",
    ctaLabel: "Explore Branding Services →",
    image: IMG.brand,
  },
  {
    title: "Web Development",
    description:
      "Build fast, responsive, and conversion-focused websites designed to create exceptional user experiences and support business growth.",
    href: "/services/web-design",
    ctaLabel: "Explore Web Development Services →",
    image: IMG.studioTeam,
  },
] as const;

export const caseStudies = [
  {
    kind: "caseStudy",
    title: "Fenty Beauty — E-commerce & brand visibility uplift",
    slug: "fenty-beauty",
    excerpt:
      "Brand videography and commercial photography that matched Fenty Beauty's dynamic energy — 120% engagement lift and 200% click-through rate on product launch.",
    body:
      "Fenty Beauty has redefined beauty standards with its commitment to inclusivity, innovation, and vibrancy. Known for its wide-range foundation shades, bold colour cosmetics, and strong visual identity, Fenty needed creative content that matched its dynamic energy and upheld its high visual expectations.\nThe challenge: highlight product textures, shades, and packaging in high definition to help customers make informed choices online; create visually engaging assets for both digital campaigns and social media; maintain brand consistency across all touchpoints; and increase audience engagement and shareability via dynamic visual storytelling.\nOur solution combined studio-grade photography (capturing lip glosses, highlighters, and blushes with sharp contrast and Fenty's signature bold colour backdrops) with motion-led brand videography that played natively across feed, reels, and product detail pages. The result was a 120% engagement-rate lift, a 200% click-through rate on the featured product launch, and a 75% increase in social shares and reposts.",
    coverImage: IMG.beauty,
    tags: ["Beauty", "Brand Videography", "Photography"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Engagement rate", value: "+120%" },
      { label: "Click-through on launch", value: "+200%" },
      { label: "Social shares / reposts", value: "+75%" },
    ],
    seo: {
      title: "Fenty Beauty Dubai Campaign Case Study | Krew Marketing",
      description:
        "Brand videography and commercial photography for Fenty Beauty — 120% engagement lift and 200% click-through rate on product launch.",
    },
  },
  {
    kind: "caseStudy",
    title: "Ford Middle East — Always-on digital storytelling",
    slug: "ford-middleeast",
    excerpt:
      "An always-on social and brand-film programme for Ford Middle East across UAE, KSA, and the wider GCC — built around model launches and regional moments.",
    body:
      "Ford Middle East needed an always-on content engine across UAE, KSA, and the wider GCC — connecting model launches, dealer activations, and cultural moments into one consistent brand story.\nKrew operated as Ford's content partner: shooting commercial film on every new model arrival, building social-first cutdowns for Instagram and TikTok, producing localised Arabic and English creative for each campaign, and maintaining a content calendar tied to regional moments (Ramadan, National Day, off-roading season). Performance was tracked in a shared dashboard alongside dealer leads, configurator interactions, and brand-search lift.\nThe outcome: a steady cadence of premium content with consistent regional voice, lifts in qualified configurator sessions, and a creative system the in-house team could brief against quickly.",
    coverImage: IMG.car,
    tags: ["Automotive", "Brand Film", "Social", "GCC"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Campaigns shipped / year", value: "24+" },
      { label: "Markets covered", value: "GCC" },
    ],
    seo: {
      title: "Ford Middle East Marketing Case Study | Krew Marketing",
      description:
        "Always-on social, video, and commercial photography for Ford Middle East — bilingual creative built around model launches and regional moments.",
    },
  },
  {
    kind: "caseStudy",
    title: "Oberoi Yachts — Luxury launch campaign",
    slug: "oberoi-yachts",
    excerpt:
      "A luxury launch campaign for Oberoi Yachts — cinematic brand film, lifestyle photography, and a high-intent paid funnel into qualified charter enquiries.",
    body:
      "Oberoi Yachts needed a campaign that matched the calibre of the product — a fleet of luxury charters serving Dubai's high-net-worth and inbound luxury market.\nKrew produced a cinematic brand film shot on water, lifestyle photography across the fleet, and a tightly built paid funnel: Meta Advantage+ creative variants for English and Arabic UHNW audiences, Google search on high-intent yacht-charter queries, and a landing-page system tied to a same-day broker response.\nThe campaign delivered a steady stream of qualified charter enquiries during the peak season, with a sharper brand presentation in feed and a creative library the team has reused across follow-up activations.",
    coverImage: IMG.yacht,
    tags: ["Luxury", "Brand Film", "Paid Media"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Qualified charter enquiries", value: "+58%" },
      { label: "Average lead response", value: "Same day" },
    ],
    seo: {
      title: "Oberoi Yachts Luxury Campaign Case Study | Krew Marketing",
      description:
        "A luxury launch campaign for Oberoi Yachts — cinematic brand film, lifestyle photography, and a paid funnel into qualified charter enquiries.",
    },
  },
  {
    kind: "caseStudy",
    title: "8th Café — Neighbourhood social presence",
    slug: "8th-cafe",
    excerpt:
      "A neighbourhood-led social and content programme for 8th Café — bilingual Reels, photography, and weekly editorial that turned scrolls into footfall.",
    body:
      "8th Café wanted a social presence that reflected the brand experience inside the café — minimal, editorial, and rooted in the neighbourhood.\nKrew built a monthly content system: a weekly photography day on-site, three to five Reels per week with native Arabic and English captions, an editorial calendar tied to seasonal menus, and a community-management workflow with sub-2-hour reply times.\nWithin three months, weekday footfall lifted noticeably, content output was steady, and the brand finally had a library of high-quality assets it could reuse across delivery platforms, paid social, and partnerships.",
    coverImage: IMG.cafe,
    tags: ["F&B", "Social", "Photography"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Weekly Reels shipped", value: "3 — 5" },
      { label: "Reply SLA", value: "< 2 hours" },
    ],
    seo: {
      title: "8th Café Social Case Study | Krew Marketing",
      description:
        "A neighbourhood-led social and content programme for 8th Café — bilingual Reels, photography, and weekly editorial that drove footfall.",
    },
  },
  {
    kind: "caseStudy",
    title: "Baaqat Flowers — Performance + creative system",
    slug: "baaqat-flowers",
    excerpt:
      "A creative and performance system for Baaqat Flowers — premium photography, seasonal campaign assets, and a paid funnel that scales for every occasion.",
    body:
      "Baaqat Flowers needed creative and performance working together: premium photography that reflected the brand, modular campaign assets for major occasions (Valentine's, Mother's Day, Eid, weddings), and a paid funnel that scaled cleanly without the creative breaking down.\nKrew rebuilt the asset system around a single brand look, shot seasonal collections in dedicated production days, and structured the Meta and Google accounts around occasion-driven campaigns with creative variants for English, Arabic, and UAE-resident vs. inbound audiences. A real-time stock check fed into ad serving so out-of-stock SKUs paused automatically.\nThe outcome was steadier sales across major occasions, a sharper brand presentation, and a creative library the team can deploy without bottlenecks.",
    coverImage: IMG.flowers,
    tags: ["E-commerce", "Performance", "Creative System"],
    status: "published",
    featured: false,
    metrics: [
      { label: "Major-occasion ROAS", value: "+44%" },
      { label: "Creative variants per occasion", value: "12+" },
    ],
    seo: {
      title: "Baaqat Flowers Performance Case Study | Krew Marketing",
      description:
        "A creative and performance system for Baaqat Flowers — seasonal photography, occasion-driven paid media, and a scalable creative library.",
    },
  },
  {
    kind: "caseStudy",
    title: "Hospitality Group — 3.2x ROAS across 5 restaurants",
    slug: "hospitality-group-paid-social",
    excerpt:
      "A multi-concept Dubai hospitality group rebuilt their paid social and reservation funnel — 3.2x ROAS and a 41% lift in weeknight covers across 5 venues.",
    body:
      "A multi-concept hospitality group operating five venues in DIFC, JBR, and Dubai Marina was struggling with declining weeknight covers. Each restaurant was running siloed campaigns, with creative produced by separate freelancers and reservations tracked by hand.\nKrew became their fractional growth team. We consolidated paid social under one Meta account structure, built a creative system shared across the five brands, and tied the reservation system (SevenRooms) into GA4 and Meta via server-side events.\nWithin 90 days, blended ROAS reached 3.2x, weeknight covers were up 41% across the group, and the leadership team finally had a single dashboard showing covers, average spend per cover, and channel contribution by location.",
    coverImage: IMG.hospitality,
    tags: ["Hospitality", "Meta Ads", "Server-side Tagging", "Creative"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Blended ROAS", value: "3.2x" },
      { label: "Weeknight covers", value: "+41%" },
    ],
    seo: {
      title: "Dubai Hospitality Group Marketing Case Study | Krew Marketing",
      description:
        "A Dubai hospitality group rebuilt their paid social and reservation funnel — 3.2x ROAS and 41% weeknight covers lift across 5 restaurants.",
    },
  },
] satisfies Partial<ContentRecord>[];

export const blogPosts = [
  {
    kind: "blog",
    title: "The role of email marketing in Dubai's luxury brand industry",
    slug: "email-marketing-dubai-luxury",
    excerpt:
      "In a market this competitive, email remains one of the highest-ROI channels for Dubai luxury brands — when the list, segmentation, and creative are right.",
    body:
      "Dubai's luxury landscape is unlike anywhere else: a high-spend, multi-cultural audience moving constantly between brands, platforms, and languages. In that environment, email marketing remains one of the highest-ROI channels for luxury brands willing to invest in list quality, segmentation, and creative.\nFour areas matter most:\n• List quality — Dubai's luxury audience is segmented by spend tier, language preference (Arabic vs. English vs. multilingual), and travel patterns. A 5,000-subscriber list segmented well will out-earn a 50,000-subscriber list of cold acquisitions.\n• Segmentation that reflects behaviour — VIP buyers should not see the same campaigns as new browsers. Build flows around purchase tier, recency, category interest, and language.\n• Creative that respects the brand — emails should look like the brand, not the email platform's template gallery. Custom typography, editorial photography, motion, and considered Arabic copy.\n• Measurement — a clean revenue dashboard tied to LTV and channel contribution, not just open rates.\nLuxury brands that run email properly in Dubai consistently see it as a top-3 revenue channel. The ones that don't usually have a $50/month tool collecting first names.",
    coverImage: IMG.brand,
    tags: ["Email", "Luxury", "Dubai"],
    status: "published",
    featured: true,
    seo: {
      title: "Email Marketing for Dubai Luxury Brands | Krew Marketing",
      description:
        "Why email remains one of the highest-ROI channels for Dubai luxury brands — list quality, segmentation, creative, and measurement done right.",
    },
  },
  {
    kind: "blog",
    title: "Why Dubai is the hotspot for social media innovation in the Middle East",
    slug: "dubai-social-media-innovation",
    excerpt:
      "Dubai's blend of audience, infrastructure, and ambition has quietly made it the Middle East's most interesting social media market.",
    body:
      "If you spend any time inside Dubai's marketing scene, you notice it quickly: the city has become the most experimental social market in the Middle East. Brands are testing formats here months before the rest of the region picks them up, and the audience expectations have moved with them.\nThree forces drive it.\nFirst, the audience: Dubai's residents and inbound visitors come from across the world, fluent in multiple platform cultures. Content has to perform across feeds shaped by GCC nationals, expats, and international travellers, often within the same campaign.\nSecond, the infrastructure: production crews, talent agencies, post-production studios, and creator networks are all concentrated within a 30-minute drive. A brand can move from concept to shipped Reel in days rather than weeks.\nThird, the ambition: leadership teams in Dubai are willing to test. They expect to see results inside a quarter, but they're willing to fund proper creative experimentation to get there.\nThe practical implication for brands: if it's working in Dubai, it will scale across the GCC. If it's not working in Dubai, the rest of the region is unlikely to save it.",
    coverImage: IMG.social,
    tags: ["Social Media", "Dubai", "Middle East"],
    status: "published",
    featured: true,
    seo: {
      title: "Why Dubai Leads Middle East Social Media | Krew Marketing",
      description:
        "Dubai's audience, infrastructure, and ambition combine to make it the Middle East's most interesting social media market. Here's what to learn from it.",
    },
  },
  {
    kind: "blog",
    title: "Google Ads vs. Facebook Ads: which PPC service in Dubai is right for you?",
    slug: "google-ads-vs-facebook-ads-dubai",
    excerpt:
      "Google Ads and Facebook Ads serve different jobs in a Dubai brand's funnel. Here's how we think about the split for clients across the UAE.",
    body:
      "We get the question constantly: should we put our paid budget into Google or Facebook? The honest answer is almost always both — but in different proportions, for different jobs.\nGoogle Ads captures active demand. People searching 'best Dubai aesthetics clinic', 'off-plan investment Business Bay', or 'corporate video Dubai' are already in market. Google's strength is intercepting that intent with the right offer and landing page.\nFacebook (Meta) Ads creates and qualifies demand. People scrolling Instagram and Facebook are not searching for you, but with the right creative and audience signal you can introduce the brand, demonstrate the offer, and warm up an audience for both search and direct-response conversion.\nIn most Dubai accounts we run, a healthy split looks like 50–65% Google for high-intent capture, 30–40% Meta for demand generation and remarketing, and a small but consistent 5–10% in newer channels (TikTok, LinkedIn for B2B, programmatic) to keep audience and creative testing alive.\nThe wrong question is 'Google vs. Meta'. The right question is: where is demand for this brand created, where is it captured, and is the funnel ready to convert it on both?",
    coverImage: IMG.performance,
    tags: ["Paid Search", "Meta Ads", "Strategy"],
    status: "published",
    featured: false,
    seo: {
      title: "Google Ads vs Facebook Ads for Dubai Brands | Krew Marketing",
      description:
        "How Krew Marketing thinks about the Google vs. Meta split for Dubai brands — where demand is created, where it's captured, and how to fund both.",
    },
  },
  {
    kind: "blog",
    title: "Local SEO signals that actually move Dubai rankings",
    slug: "local-seo-signals-dubai",
    excerpt:
      "Citations alone won't move the needle anymore. Here's what we see consistently driving local-pack and service-page rankings across Dubai and the UAE.",
    body:
      "Local SEO in Dubai has matured fast. The basics — claimed Google Business Profile, NAP consistency, a handful of citations — get you in the conversation. They don't get you ranked.\nWhat we see moving rankings across the city in 2026:\n• Service + location pages with real depth: pricing ranges, FAQs, schema, internal links, and bilingual copy. Thin location pages are now actively demoted.\n• Active review programmes on Google Business Profile with replies in the same language as the review.\n• Local content programmes — neighbourhood guides, comparison pages, and event coverage that genuinely help searchers.\n• Geo-modified anchor text earned through PR with UAE publishers, not bought through link networks.\n• Schema everywhere: LocalBusiness, FAQ, HowTo, Article, Product, plus consistent identifiers across the site.\nThe brands that take local SEO seriously in Dubai right now own multiple local-pack positions in their service area within six to nine months. The brands that don't are still arguing about which keyword to add to their meta title.",
    coverImage: IMG.seo,
    tags: ["SEO", "Local SEO"],
    status: "published",
    featured: false,
    seo: {
      title: "Local SEO Dubai: Signals That Move Rankings | Krew Marketing",
      description:
        "Which local SEO signals actually move Dubai rankings in 2026 — service pages, reviews, schema, and the new Google Business Profile playbook.",
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
    eyebrow: "Creative digital agency · Dubai",
    title: "Dubai's Creative Digital Marketing Agency | for Ambitious Brands",
    subtitle:
      "Krew Marketing is a creative digital marketing agency in Dubai combining strategy, brand identity, video production, and paid media into one performance-driven engine. Trusted by leading brands across the UAE to earn attention and deliver real revenue.",
    settings: {
      video: "https://videos.pexels.com/video-files/3209828/3209828-uhd_3840_2160_25fps.mp4",
      poster: IMG.heroDubai,
      image: IMG.heroDubai,
      imageAlt: "Dubai skyline at golden hour",
      ctaLabel: "Start a project",
      ctaHref: "https://wa.me/971502827279",
      secondaryCtaLabel: "Book a strategy call",
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
        "Social",
        "Digital",
        "Production",
        "SEO & AI Search",
        "Performance Marketing",
        "Brand Films",
        "Commercial Photography",
        "Google Business Profile",
      ],
    },
  },
  {
    id: "services-editorial",
    type: "servicesEditorial",
    enabled: true,
    eyebrow: "What we do",
    title: "Five services. One accountable studio.",
    subtitle:
      "Engage Krew for a single service or run the full creative and performance engine. Every engagement is led by a senior strategist with specialist practitioners on the work.",
    settings: { limit: 6 },
  },
  {
    id: "stats",
    type: "statsBand",
    enabled: true,
    title: "Senior strategy, sharp execution, clear reporting.",
    settings: {
      stats: [
        { value: "120+", label: "Campaigns shipped across Dubai and the UAE" },
        { value: "30+", label: "Active UAE clients across 6 industries" },
        { value: "5.0", label: "Average Google rating from clients" },
        { value: "98%", label: "Client retention after the first quarter" },
      ],
    },
  },
  {
    id: "process",
    type: "processSteps",
    enabled: true,
    eyebrow: "How we work",
    title: "A Proven Process Built for Dubai's Competitive Market",
    settings: {
      steps: [
        {
          title: "Discover",
          text: "We start by auditing your current digital presence — SEO, social, paid media, website, and brand positioning. We identify gaps, missed opportunities, and quick wins tailored to your Dubai market.",
        },
        {
          title: "Strategize",
          text: "Our team crafts a custom roadmap aligned with your revenue goals — whether that's SEO rankings, lead generation, brand awareness, or market expansion across the UAE.",
        },
        {
          title: "Execute",
          text: "From performance marketing and content creation to branding and video production, we execute across all channels with precision, creativity, and full Arabic & English capability.",
        },
        {
          title: "Optimise",
          text: "We monitor, test, and refine continuously. Weekly performance reviews, A/B testing, and data-driven adjustments ensure every dirham spent delivers maximum return.",
        },
        {
          title: "Scale",
          text: "Once we find what works, we scale it. More channels, bigger campaigns, stronger ROI — backed by the same senior team from day one.",
        },
      ],
    },
  },
  {
    id: "case-studies",
    type: "caseStudyGrid",
    enabled: true,
    eyebrow: "Work that delivers",
    title: "Campaigns engineered around outcomes.",
    subtitle:
      "Fenty Beauty, Ford Middle East, Oberoi Yachts, 8th Café and more — real brands, real numbers, not stock metrics.",
    settings: { categorySlug: "case-studies" },
  },
  {
    id: "client-quote",
    type: "quote",
    enabled: true,
    eyebrow: "Studio note",
    settings: {
      quote:
        "Krew rebuilt our tracking, our paid funnel, and our weeknight covers — without ever sending us another agency deck.",
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
    title: "What clients say after working with Krew.",
    subtitle:
      "Unedited Google reviews from leadership teams across Dubai Marina, Downtown Dubai, Business Bay, JLT, and Dubai Internet City.",
    settings: {},
  },
  {
    id: "insights",
    type: "imageText",
    enabled: true,
    eyebrow: "Creative agency · Dubai",
    title: "Marketing that performs—not just impresses.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Krew Marketing creative team in Dubai",
      align: "right",
      body: [
        "Most businesses in Dubai have an online presence. Few have a strategy that actually converts it into revenue. As a creative digital marketing agency in Dubai, that's the gap Krew Marketing was built to close.",
        "We are a full-service creative agency in Dubai combining strategy, branding, content, and performance built for businesses that want marketing that actually performs, not just looks good.",
        "We work with brands at every stage—startups finding their footing, established companies hitting a growth ceiling, and ambitious businesses ready to lead their category. Across retail, hospitality, real estate, finance, and beyond, we've helped brands across the UAE turn their digital presence into a genuine growth engine.",
        "Our work spans SEO, performance marketing, advertising, social media, branding, content creation, and web design—but we never treat these as isolated services. Every channel is connected to a single goal: growing your business in a way that's sustainable, measurable, and built to scale.",
        "Dubai's market is competitive. Audiences are sophisticated. And the brands winning online aren't the ones spending the most — they're the ones with the clearest strategy and sharpest execution. That's what we bring as a trusted advertising agency in Dubai.",
        "If you're ready to stop guessing and start growing, you're in the right place.",
      ].join("\n\n"),
      checklistTitle: "Why Businesses Choose Krew",
      bullets: [
        "Strategy before tactics—always",
        "Creative that converts, not just impresses",
        "SEO and organic growth built for Dubai's market",
        "Paid media that maximises every dirham spent",
        "Transparent reporting tied to real business metrics",
        "A team invested in your growth, not just your retainer",
      ],
      ctaLabel: "Book a strategy call",
      ctaHref: "/contact",
    },
  },
  {
    id: "faq",
    type: "faq",
    enabled: true,
    eyebrow: "FAQ",
    title: "Digital marketing questions, answered.",
    subtitle: "Common questions about working with a digital marketing agency in Dubai.",
    settings: {
      faqs: [
        {
          question: "How long does it take to see results from digital marketing?",
          answer:
            "The timeline depends on the marketing channel. Paid advertising campaigns can generate results within days, while SEO and content marketing strategies typically require several months to build sustainable organic visibility and long-term growth.",
        },
        {
          question: "Why should I hire a digital marketing agency in Dubai?",
          answer:
            "Hiring a digital marketing agency gives your business access to experienced marketers, creative specialists, advertising experts, and data-driven strategies without the cost of building a large in-house team. A professional agency can help improve brand awareness, lead generation, and marketing ROI.",
        },
        {
          question: "What digital marketing services do you offer in Dubai?",
          answer:
            "Krew Marketing provides a full range of digital marketing services in Dubai, including SEO, performance marketing, Google Ads, social media marketing, content creation, video production, influencer marketing, public relations, branding, and website development.",
        },
        {
          question: "Can digital marketing generate qualified leads for my business?",
          answer:
            "Yes. A well-executed digital marketing strategy helps attract high-intent prospects through search engines, social media platforms, paid advertising, and content marketing. By targeting the right audience with the right message, businesses can generate consistent and qualified leads.",
        },
        {
          question: "What advertising services do you offer in Dubai?",
          answer:
            "Our advertising services in Dubai include Google Ads management, Meta advertising, LinkedIn advertising, YouTube advertising, TikTok advertising, remarketing campaigns, display advertising, lead generation campaigns, and performance marketing strategies designed to maximize return on investment.",
        },
      ],
    },
  },
  {
    id: "cta",
    type: "ctaBanner",
    enabled: true,
    title: "Ready to Grow with a Creative Digital Marketing Agency in Dubai?",
    subtitle:
      "Growth doesn't happen by chance. It happens when the right strategy meets sharp execution and a team that's genuinely invested in your success.",
    settings: {
      body: "If you're looking for an advertising agency in Dubai that's serious about long-term results, let's talk.",
      ctaLabel: "Book a strategy call",
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
    title: "Digital Marketing Services in Dubai Built Around One Thing — Your Growth",
    subtitle:
      "Krew Marketing offers a full suite of digital marketing services in Dubai designed to work together as one connected growth system. From SEO and paid advertising to branding, social media, content creation, and web development — every service is built to attract the right audience, convert interest into revenue, and scale what's working.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Creative team at work",
      ctaLabel: "Book a strategy call",
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
    title: "Digital Marketing Services Tailored to Your Business Goals",
    subtitle:
      "Every business requires a different growth strategy. That's why our services are designed to solve specific challenges while working together as part of a comprehensive digital marketing ecosystem. Explore our core services and discover how Krew Marketing helps businesses build visibility, generate leads, and drive measurable growth.",
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
    title: "Not sure which service fits your goals?",
    subtitle:
      "Tell us what you want to grow. We'll recommend the right starting point — one service or a full studio engagement.",
    settings: { ctaLabel: "Send a project brief", ctaHref: "/contact?topic=services" },
  },
];

export const aboutSections: PageSection[] = [
  {
    id: "about-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "ABOUT US",
    title: "The Creative Digital Marketing Agency Dubai Brands Trust to Grow",
    subtitle: "",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Krew Marketing team in Dubai",
      ctaLabel: "Work with us",
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
      "Krew Marketing is a creative digital marketing agency in Dubai built for businesses that are serious about growth. We combine strategy, creativity, and performance into one connected system — designed to help brands cut through the noise, reach the right audience, and turn marketing into measurable revenue.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Krew Marketing strategists and creatives in Dubai",
      align: "left",
      body: "We're not a one-size-fits-all agency. We're a focused team of strategists, creatives, and performance marketers who care about one thing — results that actually move your business forward.",
      headingAs: "h2",
    },
  },
  {
    id: "about-why",
    type: "imageText",
    enabled: true,
    title: "Why We Started",
    subtitle:
      "Dubai is one of the most competitive business environments in the world. We saw too many ambitious brands investing in marketing that looked good but delivered nothing. Krew was built to change that — to be the agency that connects creativity to commercial outcomes, and strategy to real growth.",
    settings: {
      image: IMG.heroDubai,
      imageAlt: "Dubai skyline — where Krew Marketing was founded",
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
      "Great marketing isn't about impressions or follower counts. It's about building brands that people trust, campaigns that convert, and strategies that compound over time. Every decision we make is guided by data, shaped by creativity, and measured against real business outcomes.",
    settings: {
      image: IMG.brand,
      imageAlt: "Brand and creative work at Krew Marketing",
      align: "left",
      body: "",
      headingAs: "h2",
    },
  },
  {
    id: "about-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Work with Krew Marketing",
    subtitle:
      "Tell us about your goals for the next four quarters. We'll come back with an honest view on where we can — and where we can't — help.",
    settings: { ctaLabel: "Plan with Krew", ctaHref: "/contact?topic=partnership" },
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
      imageAlt: "Krew Marketing studio",
      ctaLabel: "Start a project",
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
    settings: { ctaLabel: "Talk to Krew", ctaHref: "/contact" },
  },
];

export const paidMediaSections: PageSection[] = [
  {
    id: "paid-media-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Performance marketing agency in dubai",
    subtitle:
      "Performance marketing is a results-based approach to digital advertising where every campaign is measured against real business outcomes — leads generated, sales closed, revenue earned. Unlike traditional advertising, you only pay for what performs.",
    settings: {
      image: IMG.performance,
      imageAlt: "Performance marketing analytics and campaign dashboards",
      ctaLabel: "Book a strategy call",
      ctaHref: "tel:+971502827279",
      categories: [],
    },
  },
  {
    id: "paid-media-platforms",
    type: "servicesEditorial",
    enabled: true,
    title: "Platforms We Work With",
    subtitle:
      "As a leading performance marketing agency in Dubai, we match every brand with the right platform based on audience, goals, and market behaviour.",
    settings: {
      layout: "stacked",
      cards: [
        {
          title: "Google Search & Shopping",
          description:
            "Capture high-intent buyers at the exact moment they're searching for what you offer. We manage keyword strategy, bidding, ad copy, and landing page alignment to drive qualified traffic that converts.",
        },
        {
          title: "Performance Max",
          description:
            "Google's most powerful campaign type, managed properly. We build asset groups, audience signals, and conversion tracking that make PMax work the way it's supposed to — not just spend your budget.",
        },
        {
          title: "Meta Advantage+ — Facebook & Instagram",
          description:
            "Creative-led campaigns built for Dubai's social-first audience. We combine Advantage+ automation with strong creative strategy to reduce cost per result and scale what's working.",
        },
        {
          title: "TikTok Spark Ads",
          description:
            "Dubai's fastest-growing platform for brand discovery. We build native-feeling TikTok campaigns that blend into the feed, capture attention, and drive measurable action.",
        },
        {
          title: "LinkedIn ABM",
          description:
            "The most effective B2B advertising platform in the UAE. We run account-based marketing campaigns that put your brand in front of the right decision-makers at the right companies.",
        },
        {
          title: "YouTube Advertising",
          description:
            "Video-first campaigns that build brand awareness and drive retargeting audiences at scale — across Dubai and the wider GCC region.",
        },
        {
          title: "Programmatic Retargeting",
          description:
            "Re-engage your warmest audiences across the web. We build retargeting funnels that bring back visitors who didn't convert and guide them toward action.",
        },
      ],
    },
  },
  {
    id: "paid-media-tracking",
    type: "imageText",
    enabled: true,
    title: "Our Tracking & Attribution Setup",
    settings: {
      body:
        "Bad data leads to bad decisions. Before we spend a single dirham on ads, we audit your entire tracking infrastructure — GA4 configuration, Google Tag Manager setup, server-side tracking, and offline conversion imports. You can't optimise what you can't measure accurately.\n\nEvery campaign we run is tied to real conversion events — not just clicks or sessions. Leads, calls, purchases, pipeline value — we track what actually matters to your business.\n\nOur performance marketing services in Dubai are built on one principle — if you can't measure it, you can't improve it.",
      image: IMG.performance,
      imageAlt: "Analytics and conversion tracking setup",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "paid-media-roadmap",
    type: "processSteps",
    enabled: true,
    title: "The 90-Day Test Roadmap",
    subtitle:
      "We don't guess. Every new account starts with a structured 90-day testing roadmap covering creative variations, audience segments, bidding strategies, and landing page tests. By day 90 we know exactly what's working, what isn't, and where to scale.",
    settings: {
      steps: [
        {
          title: "Days 1–30",
          text: "Audit, setup, tracking verification, campaign launch",
        },
        {
          title: "Days 31–60",
          text: "Data collection, creative testing, audience refinement",
        },
        {
          title: "Days 61–90",
          text: "Scale winning campaigns, cut underperformers, build growth roadmap",
        },
      ],
    },
  },
  {
    id: "paid-media-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Book a strategy call",
    subtitle: "Tell us your goal and timeline. We'll come back with a practical plan in the first call.",
    settings: {
      body:
        "Whether you need a full-service advertising agency in Dubai or a specialist paid media team to plug into your existing setup — we're built for both.",
      ctaLabel: "Book a strategy call",
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
    title: "SEO Services in Dubai That Drive Real Organic Growth",
    subtitle:
      "Most businesses in Dubai are invisible on Google. Not because their product is wrong — but because their SEO strategy is. As a trusted SEO agency in Dubai, Krew Marketing builds search visibility that compounds over time, turning your website into your most valuable sales asset.",
    settings: {
      image: IMG.seo,
      imageAlt: "SEO analytics and organic search growth dashboards",
      ctaLabel: "Book a Free SEO Audit",
      ctaHref: "tel:+971502827279",
      categories: [],
    },
  },
  {
    id: "seo-dubai-overview",
    type: "imageText",
    enabled: true,
    eyebrow: "SEO AGENCY IN DUBAI",
    title: "SEO Services in Dubai That Drive Long-Term Organic Growth",
    subtitle: "Why SEO Is the Most Valuable Investment a Dubai Business Can Make",
    settings: {
      body:
        "In today's digital landscape, businesses in Dubai need more than one channel to grow. While paid advertising delivers immediate results, SEO builds the long-term foundation that compounds over time — driving consistent organic traffic, qualified leads, and brand authority that grows month on month without paying for every click.\n\nFor businesses in Dubai competing in one of the most active digital markets in the world, SEO is not optional. It's the difference between being found by customers who are actively searching for what you offer — and being invisible while your competitors take that traffic.",
      image: IMG.seo,
      imageAlt: "Organic search growth and SEO strategy",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-agency",
    type: "imageText",
    enabled: true,
    title: "What Does an SEO Agency in Dubai Actually Do?",
    subtitle:
      "A good SEO agency in Dubai does far more than chase keyword rankings. It builds a system that makes your website the most relevant, most authoritative, and most technically sound result for the searches that matter to your business.",
    settings: {
      body:
        "At Krew Marketing, our SEO services in Dubai are built across five core pillars:",
      image: IMG.studioTeam,
      imageAlt: "Krew Marketing SEO strategists in Dubai",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-pillars",
    type: "servicesEditorial",
    enabled: true,
    title: "Five Core Pillars of Our SEO Services",
    settings: {
      layout: "stacked",
      cards: [
        {
          title: "Technical SEO",
          description:
            "Search engines can only rank what they can find and understand. We conduct a 140-point technical audit covering site speed, Core Web Vitals, crawlability, indexation, mobile usability, structured data, and internal architecture — fixing every issue that's preventing your pages from ranking.",
        },
        {
          title: "On-Page SEO & Content Optimisation",
          description:
            "Every page on your website is an opportunity to rank. We optimise title tags, meta descriptions, heading structure, content depth, keyword placement, and internal linking — ensuring every page sends the right signals to Google.",
        },
        {
          title: "Local SEO in Dubai",
          description:
            "When someone searches \"near me\" or adds \"Dubai\" to their query, local SEO determines whether your business appears. We optimise your Google Business Profile, build local citations across UAE directories, create location-specific landing pages, and implement local schema markup to maximise your visibility in Dubai's local search results and Map Pack.",
        },
        {
          title: "SEO Content Strategy",
          description:
            "Google ranks websites that demonstrate genuine expertise and authority on a topic. We develop keyword-targeted content strategies that answer the real questions your audience is searching for — building topical authority that lifts rankings across your entire website, not just individual pages.",
        },
        {
          title: "Link Building & Domain Authority",
          description:
            "Backlinks from authoritative, relevant websites are one of Google's strongest ranking signals. We build high-quality links through digital PR, content partnerships, and outreach — strengthening your domain authority and supporting rankings across your full keyword portfolio.",
        },
      ],
    },
  },
  {
    id: "seo-dubai-market",
    type: "imageText",
    enabled: true,
    title: "SEO for Dubai's Unique Market",
    settings: {
      body:
        "Dubai's search landscape is unlike any other market in the world. You have a highly international audience searching in multiple languages, a business environment that moves fast, and competition from both local businesses and global brands targeting the same customers. Effective SEO services in Dubai need to account for all of this.\n\nThat means bilingual optimisation in English and Arabic, an understanding of UAE search behaviour and seasonality, and strategies that work across both local and international search intent.\n\nOur team has deep experience in Dubai's digital market — we know which keywords drive qualified traffic, which content formats perform best with UAE audiences, and how to build the kind of authority that Google rewards in this region.",
      image: IMG.heroDubai,
      imageAlt: "Dubai skyline representing the local SEO market",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-strategy",
    type: "imageText",
    enabled: true,
    title: "What Makes a Good SEO Strategy in 2026?",
    subtitle:
      "SEO in 2026 goes beyond Google's traditional search results. AI-powered tools like Google AI Overviews, ChatGPT, and Perplexity are now answering search queries directly — pulling from websites that demonstrate genuine expertise, authority, and trustworthiness.",
    settings: {
      body:
        "The businesses that will dominate search in Dubai over the next five years are the ones investing in:",
      footer: "As an SEO agency in Dubai, this is exactly how we build every campaign.",
      checklistTitle: "",
      bullets: [
        "Technical excellence — fast, crawlable, well-structured websites",
        "Topical authority — deep, expert content that covers a subject comprehensively",
        "Genuine backlinks — earned through quality, not bought through shortcuts",
        "AI search optimisation — content structured for both Google and AI answer engines",
        "Local search dominance — owning the Map Pack for high-intent Dubai searches",
      ],
      image: IMG.seo,
      imageAlt: "Modern SEO strategy and AI search optimisation",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-why-krew",
    type: "imageText",
    enabled: true,
    title: "Why Businesses Choose Krew for SEO in Dubai",
    settings: {
      body: "",
      checklistTitle: "",
      bullets: [
        "140-point technical audit — the most thorough in the market",
        "Bilingual SEO strategy — English and Arabic",
        "Local SEO built for Dubai's search landscape",
        "AI search optimisation included in every campaign",
        "Content strategy built for topical authority — not just keywords",
        "Transparent monthly reporting tied to organic traffic and revenue",
        "No shortcuts, no black-hat tactics — sustainable rankings only",
        "Deep understanding of UAE market behaviour and search intent",
      ],
      image: IMG.studioTeam,
      imageAlt: "Krew Marketing team delivering SEO for Dubai brands",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "seo-dubai-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Ready to Grow Your Organic Traffic in Dubai?",
    subtitle:
      "If you're serious about building long-term search visibility, attracting qualified leads, and growing your brand online — our SEO services in Dubai are built for you.",
    settings: {
      body:
        "We'll analyse your website, identify your biggest ranking opportunities, and show you exactly what it would take to dominate search in Dubai.",
      ctaLabel: "Book a Free SEO Audit",
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
    title: "Social Media Marketing Agency in Dubai",
    subtitle:
      "As a social media marketing agency in Dubai, Krew Marketing builds social presence that goes beyond likes and follower counts. We create content that earns attention, builds genuine brand affinity, and converts audiences into customers.",
    settings: {
      image: IMG.social,
      imageAlt: "Social media content creation and brand storytelling",
      ctaLabel: "Book a strategy call",
      ctaHref: "tel:+971502827279",
      categories: [],
    },
  },
  {
    id: "social-media-brand",
    type: "imageText",
    enabled: true,
    title: "Build a Stronger Brand Through Strategic Social Media Marketing",
    settings: {
      body:
        "Social media has become one of the most powerful channels for building brand awareness, engaging customers, and driving business growth. However, success requires more than simply posting content. It requires a clear strategy, consistent execution, creative storytelling, and a deep understanding of audience behavior.\n\nAt Krew Marketing, we provide social media marketing services in Dubai designed to help businesses build meaningful connections with their audience while achieving measurable business objectives. Our team develops platform-specific strategies that combine engaging content, audience insights, and performance-driven campaigns to maximize reach, engagement, and conversions.\n\nAs a leading social media marketing agency in Dubai, we help brands establish a strong presence across Instagram, Facebook, LinkedIn, TikTok, X, and other emerging platforms. From content planning and creative production to community management and paid social advertising, every element is designed to strengthen your brand and support long-term growth.",
      image: IMG.social,
      imageAlt: "Strategic social media marketing for Dubai brands",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "social-media-services",
    type: "servicesEditorial",
    enabled: true,
    title: "Our Social Media Marketing Services",
    settings: {
      layout: "stacked",
      cards: [
        {
          title: "Social Media Strategy",
          description:
            "Develop a clear roadmap aligned with your business goals, audience, and industry trends.",
        },
        {
          title: "Content Creation",
          description:
            "Create high-quality visuals, videos, reels, graphics, and written content that capture attention and encourage engagement.",
        },
        {
          title: "Social Media Management",
          description:
            "Maintain a consistent brand presence through content scheduling, audience engagement, and community management.",
        },
        {
          title: "Paid Social Advertising",
          description:
            "Reach highly targeted audiences through performance-focused campaigns on Meta, LinkedIn, TikTok, and other social platforms.",
        },
        {
          title: "Reels & Short-Form Video Marketing",
          description:
            "Leverage engaging short-form content to increase reach, visibility, and audience interaction.",
        },
        {
          title: "Social Media Analytics & Reporting",
          description:
            "Track performance, audience growth, engagement, and campaign effectiveness through detailed reporting and strategic insights.",
        },
      ],
    },
  },
  {
    id: "social-media-why",
    type: "imageText",
    enabled: true,
    title: "Why Invest in Social Media Marketing?",
    settings: {
      body:
        "Whether you're building a new brand or scaling an established business, our social media marketing services help you connect with the right audience, create lasting impressions, and grow your business online.",
      checklistTitle: "",
      bullets: [
        "Increase Brand Awareness",
        "Build Customer Trust",
        "Generate Qualified Leads",
        "Improve Audience Engagement",
        "Strengthen Brand Authority",
        "Drive Website Traffic",
        "Support Long-Term Business Growth",
      ],
      image: IMG.studioTeam,
      imageAlt: "Krew Marketing social media team in Dubai",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "social-media-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Book a strategy call",
    subtitle: "Tell us your goal and timeline. We'll come back with a practical plan in the first call.",
    settings: {
      body:
        "Whether you need a full-service social media marketing agency in Dubai or a specialist team to plug into your existing setup — we're built for both.",
      ctaLabel: "Book a strategy call",
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
    title: "VIDEO PRODUCTION SERVICES IN DUBAI",
    subtitle:
      "At Krew Marketing, we provide video production services in Dubai that combine strategic storytelling, creative direction, and high-quality production to create content that delivers measurable business results. From corporate films and commercial advertisements to social media content and brand documentaries, every project is designed to engage viewers and support your marketing objectives.",
    settings: {
      image: IMG.video,
      imageAlt: "Professional video production and cinematography in Dubai",
      ctaLabel: "Book a strategy call",
      ctaHref: "tel:+971502827279",
      categories: [],
    },
  },
  {
    id: "video-production-overview",
    type: "imageText",
    enabled: true,
    title: "Professional Video Production That Brings Your Brand to Life",
    settings: {
      body:
        "Video has become one of the most powerful tools for capturing attention, building trust, and influencing purchasing decisions. Whether you're launching a new product, promoting a service, or strengthening your brand identity, professionally produced video content helps communicate your message in a way that resonates with modern audiences.\n\nAt Krew Marketing, we provide video production services in Dubai that combine strategic storytelling, creative direction, and high-quality production to create content that delivers measurable business results. From corporate films and commercial advertisements to social media content and brand documentaries, every project is designed to engage viewers and support your marketing objectives.\n\nAs a trusted video production company in Dubai, we handle the entire production process—from concept development and scriptwriting to filming, editing, motion graphics, and final delivery. Our team creates content optimized for websites, social media platforms, digital advertising campaigns, and broadcast channels.",
      image: IMG.video,
      imageAlt: "Video production crew filming brand content in Dubai",
      align: "left",
      headingAs: "h2",
    },
  },
  {
    id: "video-production-services",
    type: "servicesEditorial",
    enabled: true,
    title: "Our Video Production Services",
    settings: {
      layout: "stacked",
      cards: [
        {
          title: "Corporate Video Production",
          description:
            "Showcase your company, culture, services, and expertise through professional corporate films that build credibility and trust.",
        },
        {
          title: "Commercial Video Production",
          description:
            "Create compelling advertisements designed to increase brand awareness, engagement, and conversions.",
        },
        {
          title: "Brand Films",
          description:
            "Tell your brand story through cinematic content that connects emotionally with your target audience.",
        },
        {
          title: "Social Media Video Content",
          description:
            "Produce short-form videos, reels, and platform-specific content optimized for Instagram, TikTok, LinkedIn, Facebook, and YouTube.",
        },
        {
          title: "Event Videography",
          description:
            "Capture conferences, exhibitions, product launches, and corporate events with professional event coverage.",
        },
        {
          title: "Drone Videography",
          description:
            "Add dynamic aerial perspectives that elevate your brand's visual storytelling and production quality.",
        },
      ],
    },
  },
  {
    id: "video-production-why",
    type: "imageText",
    enabled: true,
    title: "Why Invest in Professional Video Production?",
    settings: {
      body: "",
      footer:
        "High-quality video content helps businesses communicate more effectively, connect with audiences faster, and create memorable brand experiences. Whether you need a single campaign video or an ongoing content production partner, Krew Marketing delivers creative solutions that help your business grow.",
      checklistTitle: "",
      bullets: [
        "Increase Brand Awareness",
        "Improve Audience Engagement",
        "Build Customer Trust",
        "Enhance Social Media Performance",
        "Strengthen Marketing Campaigns",
        "Increase Conversion Rates",
        "Create Long-Term Brand Assets",
        "Stand Out From Competitors",
      ],
      image: IMG.studioTeam,
      imageAlt: "Krew Marketing video production team in Dubai",
      align: "right",
      headingAs: "h2",
    },
  },
  {
    id: "video-production-process",
    type: "processSteps",
    enabled: true,
    title: "Why Businesses Choose Our Video Production Company in Dubai",
    subtitle:
      "From first brief to final delivery, our end-to-end workflow keeps every project on strategy, on schedule, and optimised for the channels where your audience actually watches.",
    settings: {
      steps: [
        {
          title: "Strategy",
          text: "We align on business goals, audience insights, and distribution channels so every creative decision supports measurable outcomes.",
        },
        {
          title: "Concept",
          text: "Our team develops scripts, storyboards, and visual treatments that translate your brand message into a compelling narrative.",
        },
        {
          title: "Production",
          text: "Professional crews, equipment, and direction bring the concept to life — on location, in studio, or on set across Dubai and the UAE.",
        },
        {
          title: "Editing",
          text: "Post-production, colour grading, motion graphics, and sound design refine raw footage into polished, platform-ready content.",
        },
        {
          title: "Distribution",
          text: "We deliver master files and cutdowns optimised for websites, social platforms, paid media, presentations, and broadcast.",
        },
        {
          title: "Performance Analysis",
          text: "We track engagement, view-through, and conversion metrics to inform future content and maximise return on production investment.",
        },
      ],
    },
  },
  {
    id: "video-production-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Book a strategy call",
    subtitle: "Tell us your goal and timeline. We'll come back with a practical plan in the first call.",
    settings: {
      body:
        "Whether you need a single campaign film or an ongoing video production partner in Dubai — we're built for both.",
      ctaLabel: "Book a strategy call",
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
      title: "Krew Marketing | Creative Digital Agency in Dubai",
      description:
        "Krew Marketing is a Dubai creative digital agency combining strategy, brand, video production, social, performance marketing, and SEO into one accountable team.",
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
      title: "Digital Marketing Services in Dubai | Krew Marketing",
      description:
        "Explore Krew Marketing services in Dubai: performance marketing, SEO, social media, video production, influencer marketing, PR, branding, and web development.",
    },
    sections: servicesSections,
  },
  {
    title: "Performance Marketing",
    slug: "service-paid-media",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Performance Marketing & PPC Agency Dubai | Krew Marketing",
      description:
        "Plan and scale Google Ads, Meta, TikTok, and LinkedIn campaigns with a Dubai performance marketing agency focused on qualified leads.",
    },
    sections: paidMediaSections,
  },
  {
    title: "SEO Services Dubai",
    slug: "service-seo-dubai",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "SEO Services Dubai | SEO Agency Dubai | Krew Marketing",
      description:
        "SEO services in Dubai that drive real organic growth — technical SEO, local search, bilingual strategy, AI search optimisation, and content built for long-term rankings.",
    },
    sections: seoDubaiSections,
  },
  {
    title: "Social Media Marketing",
    slug: "service-social-media",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Social Media Marketing Agency Dubai | Krew Marketing",
      description:
        "Social media marketing agency in Dubai — strategy, content creation, community management, paid social, reels, and analytics that build brand affinity and drive conversions.",
    },
    sections: socialMediaSections,
  },
  {
    title: "Video Production",
    slug: "service-video-production",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Video Production Services Dubai | Krew Marketing",
      description:
        "Video production services in Dubai — corporate films, commercials, brand films, social content, event videography, and drone footage that delivers measurable business results.",
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
      title: "Digital Marketing Case Studies Dubai | Krew Marketing",
      description:
        "Recent Dubai campaigns for Fenty Beauty, Ford Middle East, Oberoi Yachts, 8th Café and more — brand film, social, SEO, and performance marketing.",
    },
    sections: [
      {
        id: "case-hero",
        type: "heroEditorial",
        enabled: true,
        eyebrow: "Selected work",
        title: "Work that delivers results.",
        subtitle:
          "A working selection of campaigns we've built across beauty, automotive, luxury, hospitality, and lifestyle — with the actual numbers, not the stock photos.",
        settings: {
          image: IMG.beauty,
          imageAlt: "Editorial brand photography",
          ctaLabel: "Start a conversation",
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
            "Brand · Creative · Performance",
          ],
        },
      },
      { id: "case-grid", type: "caseStudyGrid", enabled: true, title: "Recent campaigns", settings: {} },
      {
        id: "case-imagetext",
        type: "imageText",
        enabled: true,
        eyebrow: "Our approach",
        title: "Built around the one number that decides whether a campaign worked.",
        subtitle: "Outcome-led work, not deck-led work.",
        settings: {
          image: IMG.brand,
          imageAlt: "Krew studio at work on a campaign",
          align: "left",
          body:
            "Every Krew engagement starts with one question: what outcome will tell us this worked? We rebuild tracking, creative, and the paid funnel around that number, then run weekly optimisation against it. The case studies on this page all share the same DNA — a clear outcome, honest reporting, and a creative library the in-house team keeps using long after the campaign ends.",
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
            { value: "3.2x", label: "Blended ROAS for hospitality group" },
            { value: "+184%", label: "Organic growth for retained SEO clients" },
            { value: "+120%", label: "Engagement lift for Fenty Beauty launch" },
            { value: "180+", label: "Production days delivered" },
          ],
        },
      },
      {
        id: "cta",
        type: "ctaBanner",
        enabled: true,
        title: "Want a campaign like this for your brand?",
        subtitle: "Tell us what you're trying to grow and we'll share a practical plan in the first call.",
        settings: { ctaLabel: "Start a conversation", ctaHref: "/contact" },
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
      title: "Digital Marketing Blog Dubai | Krew Marketing",
      description:
        "Practical SEO, paid media, social, content, and Arabic-market insights for brands growing in Dubai and the wider UAE.",
    },
    sections: [
      {
        id: "blog-hero",
        type: "heroEditorial",
        enabled: true,
        eyebrow: "Blog",
        title: "Working notes from a Dubai marketing studio.",
        subtitle:
          "Field notes on SEO, performance marketing, Arabic content, and the marketing tech stack from our work across the UAE.",
        settings: {
          image: IMG.studioTeam,
          imageAlt: "Editorial workspace",
          ctaLabel: "Start a project",
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
            "SEO Dubai",
            "Performance Marketing",
            "AI Search Optimization",
            "Arabic Content",
            "Local SEO",
            "Paid Social",
            "Server-side Tagging",
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
            "We write the field notes we wish we'd had two years ago — what actually moved Dubai accounts, what wasted budget, and what we'd do differently on a six-figure media plan.",
          author: "Hassan Karim",
          role: "Head of Strategy · Krew Marketing",
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
        title: "Want this kind of thinking on your account?",
        subtitle:
          "These notes come out of running real Dubai campaigns. If you'd like that thinking applied to yours, talk to the strategists writing them.",
        settings: { ctaLabel: "Talk to our strategists", ctaHref: "/contact?topic=insights" },
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
      title: "About Krew Marketing | Creative Digital Marketing Agency Dubai",
      description:
        "Krew Marketing is a creative digital marketing agency in Dubai built for businesses serious about growth — strategy, creativity, and performance in one connected system.",
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
      title: "Contact Krew Marketing | Abu Dhabi Creative Digital Agency",
      description:
        "Contact Krew Marketing in Abu Dhabi — strategy, brand, video production, social, SEO, and performance marketing for UAE brands.",
    },
    sections: [
      {
        id: "contact-hero",
        type: "heroEditorial",
        enabled: true,
        eyebrow: "Contact",
        title: "Tell us what you want to grow.",
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
          "Share a little about your business and your goal. The more context you can give, the more useful our first response will be.",
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
          imageAlt: "Krew Marketing team in the Abu Dhabi studio",
          align: "right",
          body:
            "Our team in Abu Dhabi monitors inbound enquiries from 09:00 to 19:00 GST, Sunday to Thursday. Briefs sent overnight get a same-morning response, and weekend launches are covered on WhatsApp. The first reply is always written by a senior strategist, not an account handler.",
        },
      },
      {
        id: "contact-faq",
        type: "faq",
        enabled: true,
        eyebrow: "Working with Krew",
        title: "Quick answers before the first call.",
        settings: {
          faqs: [
            {
              question: "What's the fastest way to get started?",
              answer:
                "A 30-minute intro call. We'll ask about your goal, current setup, and constraints, then send a written recommendation within two business days.",
            },
            {
              question: "Are you available outside the UAE?",
              answer:
                "Yes. Our roster includes brands across the GCC, KSA, UK, and US. The studio is in Abu Dhabi but the team works across time zones.",
            },
            {
              question: "Do you work with start-ups?",
              answer:
                "Selectively — we focus on brands ready to invest in proper creative and tracking. We'll be honest in the first call if Krew isn't the right fit yet.",
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
