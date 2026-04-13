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
      'A membership portal is an online system or platform that allows registered users (members) to access exclusive content, services, or features based on their account. It typically includes functionalities such as user registration, login authentication, profile management, and access to member-specific resources like documents, events, or services. Organizations use membership portals to manage member information, track activities, and provide a centralized space where users can interact, submit requests, or receive updates efficiently.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pay via QRPH', href: '#' },
      { label: 'Hit Pay', href: '#' },
    ],
    images: ['assets/images/kdt-products.png', 'assets/images/kdt-products.png'],
    steps: COMMON_STEPS,
    benefitsTitle: 'Key Benefits of the Membership Portal',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    comingSoon: false,
  },
  'construct-pro': {
    title: 'Construct Pro',
    pageTitle: 'Construct Pro',
    description:
      'Construct Pro is a project and resource management platform built for construction and engineering teams. It centralizes project tracking, document management, and team collaboration so you can deliver projects on time and on budget.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pricing', href: '#' },
      { label: 'Get Started', href: '#' },
    ],
    images: ['assets/images/kdt-products.png', 'assets/images/kdt-products.png'],
    steps: [
      { label: 'Step 1', desc: 'Create your project' },
      { label: 'Step 2', desc: 'Invite your team' },
      { label: 'Step 3', desc: 'Track progress' },
    ],
    benefitsTitle: 'Key Benefits of Construct Pro',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: [
      { title: 'Real-time project visibility', icon: 'smile' },
      { title: 'Centralized document management', icon: 'shield' },
      { title: 'Improved team collaboration', icon: 'calendar' },
      { title: 'Reduced delays and rework', icon: 'clock' },
    ],
    comingSoon: false,
  },
  'structural-chatbot': {
    title: 'Structural Chatbot',
    pageTitle: 'Structural Chatbot',
    description:
      'Structural Chatbot is an AI-powered assistant for structural engineering questions. It helps your team get fast, reliable answers to common design and code questions, reducing time spent searching through manuals and references.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Try It', href: '#' },
      { label: 'Learn More', href: '#' },
    ],
    images: ['assets/images/kdt-products.png', 'assets/images/kdt-products.png'],
    steps: [
      { label: 'Step 1', desc: 'Ask a question' },
      { label: 'Step 2', desc: 'Review answer & sources' },
      { label: 'Step 3', desc: 'Apply to your project' },
    ],
    benefitsTitle: 'Key Benefits of Structural Chatbot',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: [
      { title: 'Fast, reliable engineering answers', icon: 'smile' },
      { title: 'Always-available AI assistant', icon: 'shield' },
      { title: 'Reduces time spent on research', icon: 'calendar' },
      { title: 'Boosts engineer productivity', icon: 'clock' },
    ],
    comingSoon: false,
  },
  tabs: {
    title: 'Tabs',
    pageTitle: 'Tabs (Coming Soon)',
    description:
      'Tabs is our upcoming product. We are putting the finishing touches on it — stay tuned for more information and an early access program.',
    actions: [
      { label: 'Notify Me', href: '#contact' },
    ],
    images: ['assets/images/kdt-products.png', 'assets/images/kdt-products.png'],
    steps: COMMON_STEPS,
    benefitsTitle: 'What to Expect from Tabs',
    benefitsBlurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    comingSoon: true,
  },
};
