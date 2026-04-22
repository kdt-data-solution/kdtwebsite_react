// Product page content. Keyed by slug. Edit content here.
const COMMON_STEPS = [
  { label: 'Step 1', desc: 'Login / SignUp' },
  { label: 'Step 2', desc: 'Use the Portal' },
  { label: 'Step 3', desc: 'Save and Update' },
];

const COMMON_BENEFITS = [
  { title: 'Improves member experience and engagement', icon: 'smile' },
  { title: 'Secure and centralized data management', icon: 'shield' },
  { title: 'Better tracking and reporting', icon: 'calendar' },
  { title: 'Saves time and reduces manual work', icon: 'clock' },
];

const COMMON_BENEFITS_BLURB =
  "Get quick answers to the most common questions about using our system and services. We've organized everything here to make your experience simple, clear, and hassle-free.";

export const products = {
  membership: {
    title: 'Membership Portal',
    pageTitle: 'Membership Portal',
    description:
      'Professional engineering tools and solutions tailored to your project requirements. A membership portal is an online system or platform that allows registered users (members) to access exclusive content, services, or features based on their account. It typically includes functionalities such as user registration, login authentication, profile management, and access to member-specific resources like documents, events, or services. Organizations use membership portals to manage member information, track activities, and provide a centralized space where users can interact, submit requests, or receive updates efficiently.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pay via QRPH', href: '#' },
      { label: 'Hit Pay', href: '#' },
    ],
    images: ['https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776324221/mb-card_lnpi4c.png'],
    steps: COMMON_STEPS,
    benefitsTitle: 'Key Benefits of the Membership Portal',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    comingSoon: false,
  },
  'construct-pro': {
    title: 'Intelligent Search for Value-driven Properties',
    pageTitle: 'Intelligent Search for Value-driven Properties',
    description:
      'A smart property finder designed to help users discover affordable opportunities with greater speed and clarity. From regular listings to bank foreclosed properties, it streamlines search and tracking for a more efficient and value-focused property journey.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pricing', href: '#' },
      { label: 'Get Started', href: '#' },
    ],
    images: ['https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776324222/pf-card_rniidz.png'],
    steps: [
      { label: 'Step 1', desc: 'Search properties' },
      { label: 'Step 2', desc: 'Compare listings' },
      { label: 'Step 3', desc: 'Contact the agent' },
    ],
    benefitsTitle: 'Key Benefits of Property Finder',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: [
      { title: 'Advanced property search and filters', icon: 'smile' },
      { title: 'Verified and up-to-date listings', icon: 'shield' },
      { title: 'Map-based property discovery', icon: 'calendar' },
      { title: 'Direct connection to property agents', icon: 'clock' },
    ],
    comingSoon: false,
  },
  'structural-chatbot': {
    title: 'Smart Service Chat Agent for Selling and Ordering',
    pageTitle: 'AI Chatbot',
    description:
      'A smart conversational assistant designed to simplify and accelerate the way businesses handle selling and ordering. It enables customers and business owners to browse products, place orders, check availability, and get instant answers all through a natural, chat-based experience without the need for phone calls, manual order forms, or dedicated sales staff. By automating routine sales interactions and order processing, it reduces response time, minimizes human error, and keeps the business running efficiently even outside of operating hours — making it an ideal solution for small to medium enterprises looking to modernize their sales operations through accessible and intelligent technology.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Try It', href: '#' },
      { label: 'Learn More', href: '#' },
    ],
    images: ['https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776327212/chatbot-card_as2n2p.png'],
    steps: [
      { label: 'Step 1', desc: 'Ask a question' },
      { label: 'Step 2', desc: 'Review answer & sources' },
      { label: 'Step 3', desc: 'Apply to your business' },
    ],
    benefitsTitle: 'Key Benefits of the AI Chatbot',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: [
      { title: 'Instant customer responses', icon: 'smile' },
      { title: 'Always-available AI assistant', icon: 'shield' },
      { title: 'Automated order processing', icon: 'calendar' },
      { title: 'Boosts sales productivity', icon: 'clock' },
    ],
    comingSoon: false,
  },
  wms: {
    title: 'Sophisticated Tracking for Modern Warehousing',
    pageTitle: 'Sophisticated Tracking for Modern Warehousing',
    description:
      'A smart warehouse solution designed to improve visibility, accuracy, and control across daily operations. It supports faster tracking, efficient inventory handling, and more organized warehouse workflows through modern, reliable system processes.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pricing', href: '#' },
      { label: 'Get Started', href: '#' },
    ],
    images: ['https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776772755/wms-card_teymis.png'],
    steps: [
      { label: 'Step 1', desc: 'Set up your warehouse' },
      { label: 'Step 2', desc: 'Track inventory in real-time' },
      { label: 'Step 3', desc: 'Fulfill orders efficiently' },
    ],
    benefitsTitle: 'Key Benefits of WMS',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: [
      { title: 'Real-time inventory visibility', icon: 'smile' },
      { title: 'Secure and centralized data management', icon: 'shield' },
      { title: 'Better tracking and reporting', icon: 'calendar' },
      { title: 'Saves time and reduces manual work', icon: 'clock' },
    ],
    comingSoon: false,
  },
  cardko: {
    title: 'CardKo',
    pageTitle: 'CardKo',
    description:
      'A digital business card and networking platform for professionals and organizations. Easily share your contact details, portfolio, and social links with a simple scan — no more paper cards, no more lost connections.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Get Started', href: '#' },
    ],
    images: ['https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776324221/ck-card_ca85hx.png'],
    steps: [
      { label: 'Step 1', desc: 'Create your card' },
      { label: 'Step 2', desc: 'Share via QR or link' },
      { label: 'Step 3', desc: 'Grow your network' },
    ],
    benefitsTitle: 'Key Benefits of CardKo',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: [
      { title: 'Eco-friendly digital networking', icon: 'smile' },
      { title: 'Secure and centralized data management', icon: 'shield' },
      { title: 'Easy contact sharing via QR', icon: 'calendar' },
      { title: 'Saves time and reduces paper waste', icon: 'clock' },
    ],
    comingSoon: false,
  },
  tabs: {
    title: 'Three-dimensional AI-Powered Building Systems',
    pageTitle: 'TABS (Coming Soon)',
    description:
      'TABS (Three-dimensional AI-Powered Building Systems) is an intelligent architectural and engineering platform that transforms how professionals plan, visualize, and manage construction projects. By combining AI-driven 3D modeling, real-time structural analysis, and collaborative design tools, TABS streamlines complex workflows, reduces costly errors, and brings architectural concepts to life with unmatched precision. From concept to construction, it empowers architects, engineers, and project managers to make smarter, faster, and more informed decisions. Stay tuned — we are putting the finishing touches on TABS and an early access program is coming soon.',
    actions: [
      { label: 'Notify Me', href: '#contact' },
    ],
    images: ['https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776772399/tabs-card1_zuofsy.png'],
    steps: COMMON_STEPS,
    benefitsTitle: 'What to Expect from TABS',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    comingSoon: true,
  },
};
