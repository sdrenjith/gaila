import { isSectionType } from "@/lib/section-types";
import { buildDefaultGalleryCategories, IMG, LOCAL_IMAGES } from "@/lib/local-images";
import type { ContentRecord, MenuItem, PageSection, SectionType } from "@/types/cms";

export const headerMenuItems: MenuItem[] = [
  { label: "Home", href: "/", order: 0, visible: true },
  { label: "About Us", href: "/about-us", order: 1, visible: true },
  { label: "Contact", href: "/contact", order: 2, visible: true },
  {
    label: "Service",
    href: "/services",
    order: 3,
    visible: true,
    children: [
      { label: "Wedding Planning", href: "/services/wedding-planning", order: 0, visible: true },
      { label: "Newborn Hospital Decor", href: "/services/newborn-hospital-decor", order: 1, visible: true },
      { label: "Graduation Setup", href: "/services/graduation-setup", order: 2, visible: true },
      { label: "Corporate Events", href: "/services/corporate-events", order: 3, visible: true },
      { label: "Dessert Events", href: "/services/dessert-events", order: 4, visible: true },
    ],
  },
  { label: "Gallery", href: "/gallery", order: 4, visible: true },
  { label: "Blog", href: "/blog", order: 5, visible: true },
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
  { label: "About Us", href: "/about-us", order: 0, visible: true },
  { label: "Blog", href: "/blog", order: 1, visible: true },
  { label: "Wedding Planning", href: "/services/wedding-planning", order: 2, visible: true },
  { label: "Newborn Hospital Decor", href: "/services/newborn-hospital-decor", order: 3, visible: true },
  { label: "Graduation Setup", href: "/services/graduation-setup", order: 4, visible: true },
  { label: "Corporate Events", href: "/services/corporate-events", order: 5, visible: true },
  { label: "Dessert Events", href: "/services/dessert-events", order: 6, visible: true },
  { label: "Contact", href: "/contact", order: 7, visible: true },
];

const heroBackgroundSlides = IMG.heroBackgrounds.map((image, index) => ({
  image,
  alt: `Gaila event styling ${index + 1}`,
}));

const gallerySliderItems = [
  { image: LOCAL_IMAGES.weddings[1], alt: "Wedding reception hall", caption: "Luxury wedding reception" },
  { image: LOCAL_IMAGES.weddings[13], alt: "Outdoor wedding table styling", caption: "Garden wedding florals" },
  { image: LOCAL_IMAGES.events[5], alt: "Graduation celebration setup", caption: "Graduation celebration" },
  { image: LOCAL_IMAGES.corporate[0], alt: "Corporate gala dinner", caption: "Corporate gala styling" },
  { image: LOCAL_IMAGES.desserts[4], alt: "Dessert table display", caption: "Dessert table artistry" },
  { image: LOCAL_IMAGES.events[2], alt: "Newborn welcome decor", caption: "Newborn hospital decor" },
  { image: LOCAL_IMAGES.gallery[11], alt: "Event stage design", caption: "Custom stage production" },
  { image: LOCAL_IMAGES.weddings[12], alt: "Floral wedding details", caption: "Floral design details" },
];

const portfolioGalleryCategories = buildDefaultGalleryCategories();

export const services = [
  {
    kind: "service",
    title: "Wedding Planning",
    slug: "wedding-planning",
    excerpt:
      "Crafting beautiful, seamless, and culturally rich weddings in Dubai. From venue curation and custom stage set design to vendor coordination and flawless day-of show calling, we handle every detail so you can focus on the celebration.",
    body:
      "A luxury wedding in Dubai is more than just a gathering; it is the realization of a lifelong dream. At Gaila, we offer bespoke wedding planning services designed for couples who value elegance, personalization, and stress-free execution.\n\nOur process begins with an in-depth creative consult to outline your design vision, spatial styling, and flow. We curate the best vendors across the UAE — catering, lighting, sound, photography, and entertainment — and coordinate them under one single team.\n\nOn the wedding day, our producers manage the complete timeline, coordinate setup, and direct proceedings with calm technical show calling, ensuring your guests enjoy a flawless experience.",
    coverImage: LOCAL_IMAGES.weddings[1],
    tags: ["Weddings", "Design & Styling", "Vendor Management", "Show Day Production"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Weddings designed annually", value: "40+" },
      { label: "Pre-wedding check points", value: "180+" },
      { label: "Guest satisfaction", value: "100%" },
    ],
    seo: {
      title: "Wedding Planner Dubai | Luxury Wedding Planning & Design | Gaila",
      description:
        "Bespoke wedding planning and design in Dubai. We handle venue sourcing, floral styling, staging, custom décor, and show coordination for your perfect day.",
    },
  },
  {
    kind: "service",
    title: "Newborn Hospital Decor",
    slug: "newborn-hospital-decor",
    excerpt:
      "Welcome your bundle of joy with stunning, custom hospital room setups. We design elegant, personalized spaces with luxury balloon installs, themed florals, customized door wreaths, and boutique catering setups for family and guests.",
    body:
      "Welcoming a newborn is a milestone moment that deserves a beautiful, welcoming space. Gaila specializes in creating luxury newborn hospital room decor in Dubai, transforming standard suites into cozy, photogenic baby-welcome areas.\n\nWe collaborate closely with families to choose color palettes, themes, and personalized touches. Our installations include customized acrylic signage, premium organic balloon clouds, delicate fresh floral arrangements, personalized bed linens, and a stylish refreshment station for your guests.\n\nOur team works efficiently and quietly with hospital staff, managing set up and strike seamlessly so you can focus entirely on your new arrival.",
    coverImage: LOCAL_IMAGES.events[2],
    tags: ["Newborn Decor", "Balloon Clouds", "Hospital Suites", "Baby Welcoming"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Newborn setups delivered", value: "150+" },
      { label: "Hospital suites styled", value: "12+" },
      { label: "Theme options available", value: "Unlimited" },
    ],
    seo: {
      title: "Newborn Hospital Decor Dubai | Baby Welcome Room Styling | Gaila",
      description:
        "Bespoke newborn hospital room decor in Dubai. Elegant balloon arches, fresh florals, custom signs, and guest refreshment styling for your baby welcome.",
    },
  },
  {
    kind: "service",
    title: "Graduation Setup",
    slug: "graduation-setup",
    excerpt:
      "Celebrate achievements with premium graduation stage setups and private party designs. From formal university stages and AV production to backyard celebration marquees and customized photo backdrops.",
    body:
      "Graduating is a monumental achievement that deserves an equally spectacular celebration. Whether you are hosting a formal institutional ceremony or a private graduation garden party, Gaila provides complete design, setup, and AV management.\n\nWe design custom stages, custom photo backdrops, customized seating, balloon cascades, and custom signage themed to your institution's colors or your personal preference.\n\nOur technical team manages sound, lighting, and screens for speeches, while our catering and decor teams style dessert tables and dining areas to create a premium, festive atmosphere.",
    coverImage: LOCAL_IMAGES.events[4],
    tags: ["Graduation Ceremonies", "Stage Building", "AV & Sound", "Private Parties"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Graduations styled in UAE", value: "95+" },
      { label: "Stages custom built", value: "60+" },
      { label: "Bespoke photo backdrops", value: "100%" },
    ],
    seo: {
      title: "Graduation Party Setup Dubai | Graduation Ceremony Stages | Gaila",
      description:
        "Premium graduation stage setups and private party design in Dubai. Stage building, lighting, sound, custom photo booths, and event styling.",
    },
  },
  {
    kind: "service",
    title: "Corporate Events",
    slug: "corporate-events",
    excerpt:
      "Designing end-to-end corporate experiences that reflect your brand, engage your audience, and achieve measurable outcomes. From leadership summits and product launches to annual gala dinners in Dubai.",
    body:
      "A successful corporate event is a powerful branding tool. Gaila delivers end-to-end corporate event management in Dubai for summits, launches, award nights, and networking receptions.\n\nWe provide professional bilingual English and Arabic programming, high-end stage design, rigging, lighting, LED screens, and custom AV production. We oversee guest logistics, valet coordination, registration check-ins, and post-event reporting.\n\nOur client roster includes global automotive, luxury beauty, and leading hospitality groups who trust Gaila's meticulous 120-item planning checklist for zero-defect show days.",
    coverImage: LOCAL_IMAGES.corporate[0],
    tags: ["Corporate Events", "Galas & Awards", "Product Launches", "AV Staging"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Corporate events delivered", value: "200+" },
      { label: "Pre-event check items", value: "120" },
      { label: "Sponsor ROI average", value: "3.2x" },
    ],
    seo: {
      title: "Corporate Event Management Dubai | Gala & Summit Planners | Gaila",
      description:
        "Leading corporate event management in Dubai. Product launches, galas, leadership summits, and award ceremonies with flawless AV, staging, and logistics.",
    },
  },
  {
    kind: "service",
    title: "Dessert Events",
    slug: "dessert-events",
    excerpt:
      "Bespoke dessert displays, custom cake backdrops, and sweet styling for weddings, baby showers, birthdays, and corporate celebrations. Designed to look breathtaking and taste incredible.",
    body:
      "A dessert table is often the centerpiece of a social event. Gaila designs and constructs immersive dessert tables and sweet installations that blend exquisite styling with gourmet pastries.\n\nWe curate a visually stunning themed backdrop, matching floral installations, custom stands, and personalized menu labels. We source luxury chocolates, custom cakes, themed cookies, and premium cupcakes from top-tier pastry chefs in Dubai.\n\nWhether it's a golden dessert cart for a wedding, a pastel treat stand for a newborn welcome, or a branded dessert bar for a product launch, we style a highlight moment your guests will queue to photograph.",
    coverImage: LOCAL_IMAGES.desserts[4],
    tags: ["Dessert Tables", "Sweet Styling", "Custom Backdrops", "Corporate Dessert Bars"],
    status: "published",
    featured: true,
    metrics: [
      { label: "Dessert displays styled", value: "110+" },
      { label: "Custom themes developed", value: "75+" },
      { label: "Vendor partners in Dubai", value: "15+" },
    ],
    seo: {
      title: "Dessert Table Styling Dubai | Sweet & Cake Displays | Gaila",
      description:
        "Bespoke dessert table styling and cake display backdrops in Dubai. Customized dessert tables, candy bars, and floral setups for premium events.",
    },
  },
] satisfies Partial<ContentRecord>[];

export const servicesOverviewCards = [
  {
    title: "Wedding Planning",
    description:
      "Crafting beautiful, seamless, and culturally rich weddings in Dubai. Venue curation, floral styling, staging, custom décor, and show coordination.",
    href: "/services/wedding-planning",
    ctaLabel: "Explore Wedding Planning →",
    image: LOCAL_IMAGES.weddings[1],
  },
  {
    title: "Newborn Hospital Decor",
    description:
      "Welcome your bundle of joy with stunning, custom hospital room setups. Balloon arches, fresh florals, custom signs, and guest refreshments styling.",
    href: "/services/newborn-hospital-decor",
    ctaLabel: "Explore Newborn Decor →",
    image: LOCAL_IMAGES.events[2],
  },
  {
    title: "Graduation Setup",
    description:
      "Celebrate achievements with premium graduation stage setups and private party designs. Custom stages, backdrops, lighting, and sound.",
    href: "/services/graduation-setup",
    ctaLabel: "Explore Graduation Setup →",
    image: LOCAL_IMAGES.events[4],
  },
  {
    title: "Corporate Events",
    description:
      "Designing end-to-end corporate experiences. Product launches, galas, leadership summits, and award ceremonies with flawless AV, staging, and logistics.",
    href: "/services/corporate-events",
    ctaLabel: "Explore Corporate Events →",
    image: LOCAL_IMAGES.corporate[0],
  },
  {
    title: "Dessert Events",
    description:
      "Bespoke dessert displays, custom cake backdrops, and sweet styling for weddings, baby showers, birthdays, and corporate celebrations.",
    href: "/services/dessert-events",
    ctaLabel: "Explore Dessert Styling →",
    image: LOCAL_IMAGES.desserts[4],
  },
] as const;

export const caseStudies = [] satisfies Partial<ContentRecord>[];

export const blogPosts = [
  {
    kind: "blog",
    title: "5 Luxury Wedding Design Trends Gaining Traction in Dubai",
    slug: "luxury-wedding-design-trends-dubai",
    excerpt:
      "From immersive floral tunnels and projection-mapped tables to custom structural stages, here is what luxury couples are choosing for their celebrations in Dubai.",
    body:
      "Dubai's wedding market is moving faster than ever. Couples are no longer looking for template ballrooms — they want immersive, architectural, and highly personalized spaces that tell their unique love story.\n\nFive trends are defining luxury weddings this season:\n\n1. Structural Staging: Instead of standard stage risers, designers are crafting multi-tiered architectural sets inspired by classical domes or modern minimalist geometry.\n\n2. Projection Mapping: Using custom animations to map dynamic visuals onto wedding cakes, stage backdrops, and dining tables, shifting themes throughout the evening.\n\n3. Immersive Floral Tunnels: Creating entryways lined with fresh blooms, baby's breath, and cascading foliage that immediately transports guests into a fairy-tale garden.\n\n4. Editorial Lighting: Transitioning from standard spotlights to curated, warm architectural illumination and custom-blown glass pendant lights that photograph beautifully.\n\n5. Bespoke Dessert Bars: Moving away from the singular cake moment to fully styled sweet lounges containing custom desserts, chocolates, and pastries that double as interactive art pieces.\n\nCouples who hire professional designers early are able to weave these visual elements into a single, cohesive narrative.",
    coverImage: LOCAL_IMAGES.weddings[1],
    tags: ["Wedding Trends", "Floral Styling", "Event Design"],
    status: "published",
    featured: true,
    seo: {
      title: "Wedding Design Trends Dubai | Luxury Planners | Gaila",
      description:
        "Explore the top luxury wedding design and decor trends in Dubai: projection mapping, architectural stages, immersive entryways, and bespoke desserts.",
    },
  },
  {
    kind: "blog",
    title: "Newborn Welcoming: The Art of Styling Hospital Suite Decor",
    slug: "newborn-hospital-decor-styling-guide",
    excerpt:
      "Welcoming a new baby is a milestone family moment. Here is how to style an elegant hospital room setup that feels cozy for mom and welcoming for guests.",
    body:
      "Transforming a private hospital suite into a warm, celebratory baby-welcome space has become a beautiful tradition in Dubai. It allows new parents to celebrate the birth with visiting family and friends in a stylish, comfortable environment.\n\nHere are the elements that create a balanced, premium newborn room setup:\n\n• The Entrance: A custom-designed door wreath or acrylic door sign welcoming guests and announcing the baby's name.\n\n• Organic Balloon Installations: Soft pastel or metallic balloon cascades positioned near the greeting area. Avoiding overpowering the room, focusing on structural corners.\n\n• Personal Bed Linens: Custom-ordered bed covers and pillowcases in matching shades to keep the mom's recovery space looking polished and clean.\n\n• Sweet & Refreshment Bar: A small themed table containing coffee, tea, chocolates, and decorated cookies styled with floral arrangements and custom risers.\n\n• Safe Floral Choices: Choosing low-fragrance, pollen-free flowers like hydrangeas or roses to ensure the environment remains clean and non-allergenic for the newborn.\n\nCoordinating with hospital administration regarding setup times and suite dimensions is key to a smooth, stress-free morning.",
    coverImage: LOCAL_IMAGES.events[2],
    tags: ["Newborn Decor", "Hospital Setup", "Baby Welcoming"],
    status: "published",
    featured: true,
    seo: {
      title: "Newborn Hospital Room Decor Guide Dubai | Gaila",
      description:
        "How to plan and style an elegant newborn hospital suite decoration in Dubai. Tips on balloons, florals, personalized linens, and guest refreshments.",
    },
  },
  {
    kind: "blog",
    title: "Planning the Perfect Graduation Ceremony Stage & AV",
    slug: "planning-graduation-ceremony-stage-av",
    excerpt:
      "Stage design, sound projection, and photo backdrops are critical to graduation events. Here is how to engineer a flawless celebration for graduates.",
    body:
      "A graduation is a highly emotional, formal ceremony that requires absolute technical precision. Unlike standard parties, graduations have strict scheduling, hundreds of graduates walking the stage, and critical audio moments that must not fail.\n\nThree technical scopes decide the success of a graduation event:\n\n1. Stage Safety & Sightlines: Building sturdy, wide stage ramps and stairs to prevent tripping. Ensuring high sightlines so parents at the back have a clear view as diplomas are handed out.\n\n2. Pristine Sound Distribution: Employing delayed audio arrays to ensure speeches are clearly audible throughout the hall, preventing echo or feedback near microphones.\n\n3. Branded Photo Backdrops: Setting up multiple high-quality backdrops in the foyer with professional lighting so graduates and families can capture high-resolution commemorative photos.\n\nCombining strict rehearsals for name calls with a robust AV checklist ensures the ceremony runs on time and remains a proud memory for everyone.",
    coverImage: LOCAL_IMAGES.events[4],
    tags: ["Graduation planning", "Stage AV", "Sound Engineering"],
    status: "published",
    featured: false,
    seo: {
      title: "Graduation Stage Setup & AV Planning Dubai | Gaila",
      description:
        "AV requirements, staging, lighting, and sound distribution for graduation ceremonies and private parties in Dubai.",
    },
  },
] satisfies Partial<ContentRecord>[];

const heroCategories = [
  { label: "Services", href: "/services", meta: "5 Areas" },
  { label: "Gallery", href: "/gallery", meta: "Portfolio" },
  { label: "Blog", href: "/blog", meta: "Journal" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

export const homeSections: PageSection[] = [
  {
    id: "hero-editorial",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Event Styling & Production · Dubai",
    title: "Dubai's Premier Event Management & Design Studio",
    subtitle:
      "Gaila plans, designs, and produces breathtaking weddings, newborn hospital welcomes, graduation ceremonies, corporate events, and dessert table displays. We combine creative vision with flawless logistics.",
    settings: {
      video: "",
      poster: IMG.featuredEvent,
      image: IMG.featuredEvent,
      imageAlt: "Gaila wedding reception hall with full guest seating",
      backgroundImages: heroBackgroundSlides,
      backgroundIntervalSeconds: 6,
      ctaLabel: "Plan your event",
      ctaHref: "/contact",
      secondaryCtaLabel: "Browse gallery",
      secondaryCtaHref: "/gallery",
      categories: heroCategories,
      rotatingTitles: [
        "Bespoke Wedding Planning & Design",
        "Luxury Newborn Hospital Decor",
        "Breathtaking Dessert Table Displays",
        "Premium Graduation Party Setups",
        "Flawless Corporate Event Production",
      ],
      rotationSeconds: 4,
    },
  },
  {
    id: "capability-marquee",
    type: "marquee",
    enabled: true,
    settings: {
      speedSeconds: 30,
      items: [
        "Wedding Planning",
        "Newborn Decor",
        "Graduations",
        "Corporate Galas",
        "Dessert Displays",
        "Stage Building",
        "AV & Lighting",
        "Floral Design",
        "Bespoke Styling",
        "Logistics",
      ],
    },
  },
  {
    id: "services-editorial",
    type: "servicesEditorial",
    enabled: true,
    eyebrow: "What we do",
    title: "Five Event Styling Services. One Accountable Team.",
    subtitle:
      "Engage Gaila for a private milestone or a corporate production. We manage every detail end-to-end with an in-house styling and setup team.",
    settings: {
      limit: 5,
      intervalSeconds: 3.5,
      sliderImages: [
        { image: LOCAL_IMAGES.weddings[1], alt: "Wedding celebration hall with guests" },
        { image: LOCAL_IMAGES.weddings[6], alt: "Elegant wedding floral styling" },
        { image: LOCAL_IMAGES.events[2], alt: "Newborn hospital room decor" },
        { image: LOCAL_IMAGES.corporate[7], alt: "Corporate gala production" },
        { image: LOCAL_IMAGES.desserts[4], alt: "Premium dessert table styling" },
        { image: LOCAL_IMAGES.gallery[10], alt: "Event gallery highlight" },
      ],
    },
  },
  {
    id: "stats",
    type: "statsBand",
    enabled: true,
    eyebrow: "Our numbers",
    title: "Experience that speaks for itself.",
    settings: {
      stats: [
        { value: "500+", label: "Premium Events Styled & Delivered in UAE" },
        { value: "100%", label: "Bespoke Visual Concept Customization" },
        { value: "5.0", label: "Average Google Rating from Families & Brands" },
        { value: "100%", label: "Bilingual Coordination & Flawless Setup" },
      ],
    },
  },
  {
    id: "process",
    type: "processSteps",
    enabled: true,
    eyebrow: "How we work",
    title: "Five steps to an unforgettable event",
    settings: {
      steps: [
        {
          title: "1. Creative Consult",
          text: "We sit down to understand your theme, vision, venue guidelines, and budget. We establish the primary visual direction and layout options.",
        },
        {
          title: "2. Visual Concept & Renders",
          text: "Our design team creates mood boards, spatial layouts, and 3D mockups. You see exactly how the decor, lighting, and stages look before setup.",
        },
        {
          title: "3. Curation & Crafting",
          text: "We coordinate with premium partners across the UAE for catering, flowers, fabrics, and desserts, aligning every item with the visual theme.",
        },
        {
          title: "4. Staging & Production",
          text: "Our crew builds the setup on-site, routes the AV cables, arranges the florals, and finishes the dessert display without disturbing your venue or hospital space.",
        },
        {
          title: "5. The Event & Strike",
          text: "Enjoy your moment stress-free while our event managers run the day-of program. Once the celebration ends, we pack and strike cleanly.",
        },
      ],
    },
  },
  {
    id: "editorial-slider",
    type: "editorialImageSlider",
    enabled: true,
    eyebrow: "Recent work",
    title: "Moments we styled across Dubai",
    subtitle: "Swipe through weddings, newborn welcomes, graduations, corporate galas, and dessert displays from recent Gaila productions.",
    settings: {
      intervalSeconds: 5,
      ctaLabel: "Browse full gallery",
      ctaHref: "/gallery",
      items: gallerySliderItems,
    },
  },
  {
    id: "home-gallery",
    type: "gallery",
    enabled: true,
    eyebrow: "Event gallery",
    title: "Immersive snapshots of Gaila events.",
    subtitle: "Take a look at our recent setups: wedding stages, balloon clouds, dessert bars, and graduation celebrations.",
    settings: {
      columns: 4,
      items: [
        { image: LOCAL_IMAGES.weddings[1], alt: "Wedding stage styling", caption: "Elegant reception hall with full guest seating" },
        { image: LOCAL_IMAGES.events[2], alt: "Newborn welcoming setup", caption: "Bespoke hospital room welcome decor" },
        { image: LOCAL_IMAGES.desserts[4], alt: "Dessert table installation", caption: "Gold accents and pastel treat displays" },
        { image: LOCAL_IMAGES.events[4], alt: "Graduation party setup", caption: "Bold stage backdrop and celebration styling" },
        { image: LOCAL_IMAGES.corporate[0], alt: "Corporate gala dinner", caption: "High-end table layouts and production" },
        { image: LOCAL_IMAGES.weddings[13], alt: "Floral details", caption: "Outdoor garden wedding table styling" },
        { image: LOCAL_IMAGES.gallery[8], alt: "Event production", caption: "Custom stage and lighting design" },
        { image: LOCAL_IMAGES.desserts[10], alt: "Sweet table styling", caption: "Enhanced dessert display photography" },
        { image: LOCAL_IMAGES.weddings[12], alt: "Floral wedding arch", caption: "Premium floral design and arch styling" },
      ],
    },
  },
  {
    id: "client-quote",
    type: "quote",
    enabled: true,
    eyebrow: "Client note",
    settings: {
      quote:
        "Gaila created a stunning baby welcome room at the hospital in less than three hours. The balloon arches and fresh flowers were absolutely perfect, and the chocolate cart was a massive hit with all our guests!",
      author: "Fatima Al Mansoori",
      role: "Newborn Welcome Client · Jumeirah",
      image: IMG.babyDecor,
    },
  },
  {
    id: "google-reviews-scroll",
    type: "scrollProgressCircle",
    enabled: true,
    eyebrow: "Google reviews",
    title: "What clients say after working with Gaila.",
    subtitle:
      "Unedited Google reviews from clients across Dubai Marina, Downtown Dubai, Business Bay, and Jumeirah.",
    settings: {
      mode: "reviews",
      scrollHeightVh: 0,
      reviewLimit: 5,
      steps: [],
    },
  },
  {
    id: "faq",
    type: "faq",
    enabled: true,
    eyebrow: "FAQ",
    title: "Common questions about our events.",
    subtitle: "Common questions about working with Gaila event styling and production.",
    settings: {
      faqs: [
        {
          question: "How early should I book Gaila for an event?",
          answer:
            "We recommend booking weddings and large graduation setups 3 to 6 months in advance. Newborn hospital room decors can be planned 4 to 8 weeks before your expected due date. Corporate events typically require a 6 to 8-week planning runway.",
        },
        {
          question: "Do you design custom themes and backdrops?",
          answer:
            "Yes, absolutely! Every Gaila event is designed from scratch. We do not use generic rental packages. Our creative team develops custom mood boards and builds unique stages, backdrops, and balloon arrangements tailored to your style.",
        },
        {
          question: "Which hospitals and venues do you cover in the UAE?",
          answer:
            "Our team delivers decors and setups to all major private hospitals and premium event venues/hotels across Dubai, Abu Dhabi, and Sharjah.",
        },
        {
          question: "Can you manage catering and dessert stands?",
          answer:
            "Yes, we style and manage fully customized dessert tables, candy bars, and refreshment stations, sourcing premium cakes, chocolates, and pastries from top pastry chefs.",
        },
      ],
    },
  },
  {
    id: "cta",
    type: "ctaBanner",
    enabled: true,
    title: "Ready to plan something unforgettable?",
    subtitle: "Tell us about your event type, date, and venue. Our design team will share a tailored concept in the first call.",
    settings: {
      ctaLabel: "Speak to our team",
      ctaHref: "/contact",
      variant: "dark",
    },
  },
];

export const servicesSections: PageSection[] = [
  {
    id: "services-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "SERVICES",
    title: "Premium Event Styling & Production Services",
    subtitle:
      "Gaila offers a focused suite of event design and management services in Dubai. From breathtaking weddings and private celebrations to newborn room decorations and corporate event production.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Event styling team at work",
      ctaLabel: "Request proposal",
      ctaHref: "/contact",
      secondaryCtaLabel: "Browse gallery",
      secondaryCtaHref: "/gallery",
      categories: heroCategories,
    },
  },
  {
    id: "services-grid",
    type: "servicesEditorial",
    enabled: true,
    eyebrow: "OUR SERVICES",
    title: "Event Services Tailored to Your Milestone",
    subtitle:
      "Explore our core services and see how Gaila transforms spaces into magical moments.",
    settings: {
      limit: 5,
      layout: "stacked",
      cards: [...servicesOverviewCards],
    },
  },
  {
    id: "services-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Not sure which styling matches your occasion?",
    subtitle:
      "Tell us what you are celebrating. We will recommend the right starting concept or single service.",
    settings: { ctaLabel: "Send an event brief", ctaHref: "/contact?topic=services" },
  },
];

export const aboutSections: PageSection[] = [
  {
    id: "about-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "ABOUT US",
    title: "About Gaila | Premium Event Styling & Management in Dubai",
    subtitle: "We plan, design, and style milestone celebrations and corporate events across the UAE.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Gaila event planning team in Dubai",
      ctaLabel: "Plan your event",
      ctaHref: "/contact",
      secondaryCtaLabel: "Browse gallery",
      secondaryCtaHref: "/gallery",
      categories: heroCategories,
    },
  },
  {
    id: "about-who",
    type: "imageText",
    enabled: true,
    title: "Who We Are",
    subtitle:
      "Gaila is a premium, full-service event management studio built for families and brands who expect visual perfection and stress-free execution.",
    settings: {
      image: IMG.studioTeam,
      imageAlt: "Gaila styling team at work",
      align: "left",
      body: "We are a tight-knit team of visual designers, flower stylists, technical AV producers, and logistics experts. We do not use template styles or outsource our creative core. Every backdrop, balloon installation, and dessert display is styled and supervised in-house by our senior producers.",
      headingAs: "h2",
    },
  },
  {
    id: "about-why",
    type: "imageText",
    enabled: true,
    title: "Our Philosophy",
    subtitle:
      "Events are not just items on a checklist. They are emotional milestones and critical brand stories.",
    settings: {
      image: IMG.decor,
      imageAlt: "Bespoke styling detail",
      align: "right",
      body: "Whether it is a luxury wedding, a welcoming room for a newborn baby, a proud graduation setup, or a high-profile corporate gala, we put design first. We focus on clean geometry, elegant color palettes, and perfect lighting so your celebration looks breathtaking in person and timeless in photographs.",
      headingAs: "h2",
    },
  },
  {
    id: "about-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Let's plan your next milestone",
    subtitle: "Share your date, location, and style ideas. We'll outline a bespoke design concept for you.",
    settings: { ctaLabel: "Get in touch", ctaHref: "/contact" },
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

export const weddingPlanningSections: PageSection[] = [
  {
    id: "wedding-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Bespoke Wedding Planning & Design",
    subtitle: "We plan, style, and produce luxury weddings that honor your story and culture.",
    settings: {
      image: IMG.wedding,
      imageAlt: "Wedding reception design by Gaila",
      ctaLabel: "Plan your wedding",
      ctaHref: "/contact",
      categories: [],
    },
  },
  {
    id: "wedding-details",
    type: "imageText",
    enabled: true,
    title: "Elegance in Every Detail",
    subtitle: "From custom stages to botanical styling.",
    settings: {
      image: IMG.wedding,
      imageAlt: "Floral arch wedding details",
      align: "left",
      body: "We believe weddings should feel warm and deeply personal. We design custom stage backdrops, curate exquisite tablescapes, build romantic lighting plots, and coordinate floral schemes using premium fresh blooms. Our senior coordinators manage vendor timelines, catering logistics, sound checks, and stage directions, ensuring your day flows seamlessly.",
      headingAs: "h2",
    },
  },
  {
    id: "wedding-process",
    type: "processSteps",
    enabled: true,
    title: "Your Wedding Journey",
    subtitle: "Our structural timeline ensures a flawless, stress-free wedding day.",
    settings: {
      steps: [
        { title: "Design Concept", text: "We draft mood boards and color schemes based on your love story and venue choice." },
        { title: "3D Render & Curation", text: "We present a 3D visual markup of your stage, tablescapes, and entryways, making tweaks before fabrication." },
        { title: "Vendor Coordination", text: "We manage contracts and sound/lighting layouts with the best DJs, caterers, and photographers in Dubai." },
        { title: "Setup & Show calling", text: "Our team builds the setup on-site, runs sound checks, and directs the day-of program from start to finish." },
      ],
    },
  },
  {
    id: "wedding-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Let's create your dream wedding",
    subtitle: "Book a complimentary creative consult to discuss your vision, date, and venue.",
    settings: { ctaLabel: "Request consult", ctaHref: "/contact?topic=wedding" },
  },
];

export const newbornHospitalDecorSections: PageSection[] = [
  {
    id: "newborn-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Luxury Newborn Hospital Room Decor",
    subtitle: "Style a beautiful, cozy welcome suite for your new arrival and visiting guests.",
    settings: {
      image: IMG.babyDecor,
      imageAlt: "Baby welcome room decoration",
      ctaLabel: "Book hospital decor",
      ctaHref: "/contact",
      categories: [],
    },
  },
  {
    id: "newborn-details",
    type: "imageText",
    enabled: true,
    title: "A Breathtaking Welcoming Space",
    subtitle: "Custom door wreaths, organic balloon clouds, and guest refreshment bars.",
    settings: {
      image: IMG.babyDecor,
      imageAlt: "Hospital room decor setup details",
      align: "right",
      body: "Transform hospital recovery suites into cozy, welcoming spaces. Gaila designs premium balloon arches, custom name signs, soft bed linens, fresh baby floral arrays, and elegant chocolate and coffee bars to greet family and guests. We coordinate quietly with hospital staff, setting up and strikes without hassle.",
      headingAs: "h2",
    },
  },
  {
    id: "newborn-process",
    type: "processSteps",
    enabled: true,
    title: "How It Works",
    subtitle: "Simple, stress-free coordination for parents.",
    settings: {
      steps: [
        { title: "Select Theme", text: "Choose a theme, color palette, name sign style, and guest bar options at week 32-34." },
        { title: "Hospital Liaison", text: "We check suite dimensions and rules with your chosen hospital in Dubai or Abu Dhabi." },
        { title: "Setup on Birth", text: "Call us when you are admitted; our styling crew quietly installs the decor before visitors arrive." },
        { title: "Clean Strike", text: "Once you are ready to check out, we strike and clear the suite quickly, leaving no mess." },
      ],
    },
  },
  {
    id: "newborn-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Welcome your baby in style",
    subtitle: "Select a custom theme and secure your expected due-date slot on our calendar.",
    settings: { ctaLabel: "Secure your date", ctaHref: "/contact?topic=newborn" },
  },
];

export const graduationSetupSections: PageSection[] = [
  {
    id: "graduation-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Graduation Ceremony & Party Setups",
    subtitle: "Professional ceremony stages, high-end sound projection, and custom backdrop installations.",
    settings: {
      image: IMG.graduation,
      imageAlt: "Graduation celebration stage setup",
      ctaLabel: "Plan graduation setup",
      ctaHref: "/contact",
      categories: [],
    },
  },
  {
    id: "graduation-details",
    type: "imageText",
    enabled: true,
    title: "Engineering Proud Achievements",
    subtitle: "Stages that stand out and AV that performs.",
    settings: {
      image: IMG.graduation,
      imageAlt: "Ceremony staging details",
      align: "left",
      body: "We construct sturdy, wide stages and ramps styled in university colors. Our technical directors manage clear audio arrays, stage spotlights, and LED screens for presentations. In the foyer, we build large, beautifully lit backdrop structures where graduates and families capture professional memories.",
      headingAs: "h2",
    },
  },
  {
    id: "graduation-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Style a memorable graduation",
    subtitle: "From formal school stages to backyard private graduation marquees, we deliver both.",
    settings: { ctaLabel: "Request proposal", ctaHref: "/contact?topic=graduation" },
  },
];

export const corporateEventsSections: PageSection[] = [
  {
    id: "corporate-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Corporate Event Production & Management",
    subtitle: "SUMMITS · LAUNCHES · GALAS · AWARD NIGHTS",
    settings: {
      image: IMG.corporate,
      imageAlt: "Corporate event staging in Dubai",
      ctaLabel: "Request corporate brief",
      ctaHref: "/contact",
      categories: [],
    },
  },
  {
    id: "corporate-details",
    type: "imageText",
    enabled: true,
    title: "Brand Immersion & Flawless Logistics",
    subtitle: "Structured event delivery for leading UAE brands.",
    settings: {
      image: IMG.corporate,
      imageAlt: "Corporate product launch stage design",
      align: "right",
      body: "We provide high-impact stage designs, professional rigging, LED screens, sound engineering, and show calling. We map guest flows, manage registrations, and coordinate catering and transport. Our processes follow a thorough 120-item checklist to guarantee absolute precision on event day.",
      headingAs: "h2",
    },
  },
  {
    id: "corporate-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Partner with Gaila for corporate events",
    subtitle: "We deliver flawless, on-time, and on-budget events for ambitious brands in Dubai.",
    settings: { ctaLabel: "Speak to a producer", ctaHref: "/contact?topic=corporate" },
  },
];

export const dessertEventsSections: PageSection[] = [
  {
    id: "dessert-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Service · Dubai & UAE",
    title: "Dessert Table Styling & sweet displays",
    subtitle: "Visually stunning sweet displays and custom themed backdrops for milestones.",
    settings: {
      image: IMG.dessert,
      imageAlt: "Dessert table styling by Gaila",
      ctaLabel: "Book dessert styling",
      ctaHref: "/contact",
      categories: [],
    },
  },
  {
    id: "dessert-details",
    type: "imageText",
    enabled: true,
    title: "Sweet Centerpieces Built to Amaze",
    subtitle: "Exquisite styling paired with gourmet delicacies.",
    settings: {
      image: IMG.dessert,
      imageAlt: "Chocolate and custom cake displays",
      align: "left",
      body: "We design custom-themed cake backdrops, floral structures, and matching stands. We collaborate with top pastry chefs in Dubai to curate a selection of themed cakes, personalized cookies, premium cupcakes, and chocolates that look incredible and taste delicious. Perfect for baby showers, birthdays, weddings, or brand launches.",
      headingAs: "h2",
    },
  },
  {
    id: "dessert-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Style your sweet lounge",
    subtitle: "Work with our designers to sketch a dessert display that fits your event theme.",
    settings: { ctaLabel: "Request table draft", ctaHref: "/contact?topic=dessert" },
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

export const gallerySections: PageSection[] = [
  {
    id: "gallery-hero",
    type: "heroEditorial",
    enabled: true,
    eyebrow: "Gallery",
    title: "Moments we styled.",
    subtitle:
      "Browse through Gaila's catalog of gorgeous weddings, newborn baby Welcomes, graduation stages, corporate events, and dessert displays.",
    settings: {
      image: LOCAL_IMAGES.weddings[1],
      imageAlt: "Gaila wedding decor",
      backgroundImages: heroBackgroundSlides.slice(0, 4),
      backgroundIntervalSeconds: 6,
      ctaLabel: "Plan your event",
      ctaHref: "/contact",
      secondaryCtaLabel: "Explore services",
      secondaryCtaHref: "/services",
      categories: heroCategories,
    },
  },
  {
    id: "gallery-grid",
    type: "gallery",
    enabled: true,
    eyebrow: "Our portfolio",
    title: "Design is in the details.",
    subtitle:
      "Browse by category — weddings, events, corporate, gallery highlights, content, and dessert styling from recent Gaila productions.",
    settings: {
      columns: 4,
      defaultCategory: "weddings",
      categories: portfolioGalleryCategories,
    },
  },
  {
    id: "gallery-cta",
    type: "ctaBanner",
    enabled: true,
    title: "Inspired by our gallery?",
    subtitle: "Let's translate these styling elements into a custom layout for your upcoming date.",
    settings: { ctaLabel: "Plan your celebration", ctaHref: "/contact" },
  },
];

export const defaultPages = [
  {
    title: "Home",
    slug: "home",
    status: "published",
    template: "landing",
    showInHeader: false,
    headerLabel: "Home",
    headerOrder: 0,
    seo: {
      title: "Gaila | Event Management & Custom Styling Dubai",
      description:
        "Gaila plans, designs, and styles breathtaking weddings, newborn hospital welcomes, graduation ceremonies, corporate events, and dessert displays in Dubai.",
    },
    sections: homeSections,
  },
  {
    title: "Services",
    slug: "services",
    status: "published",
    template: "standard",
    showInHeader: false,
    headerLabel: "Services",
    headerOrder: 1,
    seo: {
      title: "Event Styling & Styling Services Dubai | Gaila",
      description:
        "Explore Gaila event services in Dubai: weddings, newborn hospital room decor, graduation stage setups, corporate events, and bespoke dessert displays.",
    },
    sections: servicesSections,
  },
  {
    title: "Wedding Planning",
    slug: "service-wedding-planning",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Wedding Planner Dubai | Luxury Wedding Planning & Design | Gaila",
      description:
        "Bespoke wedding planning and design in Dubai. We handle venue sourcing, floral styling, staging, custom décor, and show coordination for your perfect day.",
    },
    sections: weddingPlanningSections,
  },
  {
    title: "Newborn Hospital Decor",
    slug: "service-newborn-hospital-decor",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Newborn Hospital Decor Dubai | Baby Welcome Room Styling | Gaila",
      description:
        "Bespoke newborn hospital room decor in Dubai. Elegant balloon arches, fresh florals, custom signs, and guest welcoming setups.",
    },
    sections: newbornHospitalDecorSections,
  },
  {
    title: "Graduation Setup",
    slug: "service-graduation-setup",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Graduation Party Setup Dubai | Graduation Ceremony Stages | Gaila",
      description:
        "Premium graduation stage setups and private party design in Dubai. Stage building, lighting, sound, custom photo booths, and event styling.",
    },
    sections: graduationSetupSections,
  },
  {
    title: "Corporate Events",
    slug: "service-corporate-events",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Corporate Event Management Dubai | Gala & Summit Planners | Gaila",
      description:
        "Leading corporate event management in Dubai. Product launches, galas, leadership summits, and award ceremonies with flawless AV, staging, and logistics.",
    },
    sections: corporateEventsSections,
  },
  {
    title: "Dessert Events",
    slug: "service-dessert-events",
    status: "published",
    template: "service",
    showInHeader: false,
    headerLabel: "",
    headerOrder: 0,
    seo: {
      title: "Dessert Table Styling Dubai | Sweet & Cake Displays | Gaila",
      description:
        "Bespoke dessert table styling and cake display backdrops in Dubai. Customized dessert tables, candy bars, and floral setups for premium events.",
    },
    sections: dessertEventsSections,
  },
  {
    title: "Gallery",
    slug: "gallery",
    status: "published",
    template: "standard",
    showInHeader: false,
    headerLabel: "Gallery",
    headerOrder: 2,
    seo: {
      title: "Event Gallery Dubai | Weddings, Welcoming & Party Backdrops | Gaila",
      description:
        "Take a look at Gaila's stunning custom events: bridal stages, organic baby balloon clouds, sweet lounges, and graduation parties across the UAE.",
    },
    sections: gallerySections,
  },
  {
    title: "Blog",
    slug: "blog",
    status: "published",
    template: "standard",
    showInHeader: false,
    headerLabel: "Blog",
    headerOrder: 3,
    seo: {
      title: "Event Planning Blog Dubai | Gaila",
      description:
        "Practical event planning, newborn welcoming tips, graduation ideas, and Dubai-market event styling insights.",
    },
    sections: [
      {
        id: "blog-hero",
        type: "heroEditorial",
        enabled: true,
        eyebrow: "Blog",
        title: "Notes from Gaila Event Studio.",
        subtitle:
          "Insights on luxury weddings, newborn baby Welcomes, graduation setups, and corporate event management in Dubai.",
        settings: {
          image: IMG.studioTeam,
          imageAlt: "Gaila studio planners",
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
            "Wedding Planning",
            "Newborn Welcomes",
            "Graduation Stages",
            "Dessert Display",
            "Event Styling",
            "Dubai Venues",
          ],
        },
      },
      {
        id: "blog-grid",
        type: "caseStudyGrid",
        enabled: true,
        title: "Latest Thinking",
        settings: { categorySlug: "insights" },
      },
      {
        id: "blog-cta",
        type: "ctaBanner",
        enabled: true,
        title: "Get expert styling advice",
        subtitle: "Talk to our event designers about tailoring a concept for your upcoming occasion.",
        settings: { ctaLabel: "Speak to our team", ctaHref: "/contact?topic=insights" },
      },
    ],
  },
  {
    title: "About Us",
    slug: "about-us",
    status: "published",
    template: "standard",
    showInHeader: false,
    headerLabel: "About Us",
    headerOrder: 4,
    seo: {
      title: "About Gaila | Event Management Company Dubai",
      description:
        "Gaila is a premium, full-service event management studio in Dubai specializing in custom wedding design, newborn welcomes, graduations, and corporate events.",
    },
    sections: aboutSections,
  },
  {
    title: "Contact",
    slug: "contact",
    status: "published",
    template: "contact",
    showInHeader: false,
    headerLabel: "Contact",
    headerOrder: 5,
    seo: {
      title: "Contact Gaila | Event Management Company Dubai",
      description:
        "Contact Gaila in Dubai — custom weddings, newborn hospital welcome decor, graduation stages, corporate events, and dessert displays.",
    },
    sections: [
      {
        id: "contact-hero",
        type: "heroEditorial",
        enabled: true,
        eyebrow: "Contact",
        title: "Tell us about your event.",
        subtitle:
          "We typically respond within one business day. For urgent enquiries, WhatsApp or call the number in the footer.",
        settings: {
          image: IMG.heroDubai,
          imageAlt: "Dubai skyline",
          ctaLabel: "WhatsApp Us",
          ctaHref: "https://wa.me/971567045314",
          secondaryCtaLabel: "See our work",
          secondaryCtaHref: "/gallery",
          categories: heroCategories,
        },
      },
      {
        id: "contact-form",
        type: "contactForm",
        enabled: true,
        title: "Start a conversation",
        subtitle:
          "Share a little about your event type, date, guest count, and visual dreams. The more details you share, the better our first draft will be.",
        settings: {},
      },
      {
        id: "contact-imagetext",
        type: "imageText",
        enabled: true,
        eyebrow: "Response time",
        title: "Bespoke styling drafts sent within two business days.",
        subtitle: "Monday — Friday, 09:00 to 18:00 GST.",
        settings: {
          image: IMG.studioTeam,
          imageAlt: "Gaila team in the Dubai studio",
          align: "right",
          body:
            "Our studio in Dubai monitors inquiries daily. Draft concepts and visual options are prepared in-house by our design team, ensuring that your first proposal is relevant and accurately styled.",
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
                "A brief 20-minute phone call. We will note your event type, estimated budget, date, and visual preferences, then compile a custom design deck within two days.",
            },
            {
              question: "Do you travel outside of Dubai?",
              answer:
                "Yes, Gaila designs and installs decors for weddings, baby welcomes, and corporate events across Abu Dhabi, Sharjah, Ajman, and Ras Al Khaimah.",
            },
            {
              question: "Are your floral designs real or artificial?",
              answer:
                "We style with premium, fresh botanical options (roses, hydrangeas, eucalyptus) by default. For complex large-scale stages, we can integrate high-grade silk florals to match.",
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
