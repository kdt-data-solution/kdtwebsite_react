// Seed initial products on first boot (only if table is empty).
import db from './index.js';
import bcrypt from 'bcrypt';

const COMMON_BENEFITS_BLURB =
  "Get quick answers to the most common questions about using our system and services. We've organized everything here to make your experience simple, clear, and hassle-free.";
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

const PRODUCTS = [
  {
    slug: 'membership',
    title: 'Nexus',
    description:
      'A membership portal is an online system or platform that allows registered users (members) to access exclusive content, services, or features based on their account.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pay via QRPH', href: '#' },
      { label: 'Hit Pay', href: '#' },
    ],
    steps: COMMON_STEPS,
    benefits_title: 'Key Benefits of the Membership Portal',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 0,
  },
  {
    slug: 'construct-pro',
    title: 'Axis',
    description:
      'Construct Pro is a project and resource management platform built for construction and engineering teams.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pricing', href: '#' },
    ],
    steps: [
      { label: 'Step 1', desc: 'Create your project' },
      { label: 'Step 2', desc: 'Invite your team' },
      { label: 'Step 3', desc: 'Track progress' },
    ],
    benefits_title: 'Key Benefits of Construct Pro',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 0,
  },
  {
    slug: 'structural-chatbot',
    title: 'Vantage',
    description:
      'Structural Chatbot is an AI-powered assistant for structural engineering questions.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Try It', href: '#' },
    ],
    steps: COMMON_STEPS,
    benefits_title: 'Key Benefits of Structural Chatbot',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 0,
  },
  {
    slug: 'wms',
    title: 'Kuwalog',
    description:
      'A smart warehouse solution designed to improve visibility, accuracy, and control across daily operations. It supports faster tracking, efficient inventory handling, and more organized warehouse workflows through modern, reliable system processes.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Pricing', href: '#' },
      { label: 'Get Started', href: '#' },
    ],
    steps: [
      { label: 'Step 1', desc: 'Set up your warehouse' },
      { label: 'Step 2', desc: 'Track inventory in real-time' },
      { label: 'Step 3', desc: 'Fulfill orders efficiently' },
    ],
    benefits_title: 'Key Benefits of WMS',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 0,
  },
  {
    slug: 'cardko',
    title: 'TakeOff',
    description:
      'A digital business card and networking platform for professionals and organizations. Easily share your contact details, portfolio, and social links with a simple scan — no more paper cards, no more lost connections.',
    actions: [
      { label: 'Request a Demo', href: '#contact' },
      { label: 'Get Started', href: '#' },
    ],
    steps: [
      { label: 'Step 1', desc: 'Create your card' },
      { label: 'Step 2', desc: 'Share via QR or link' },
      { label: 'Step 3', desc: 'Grow your network' },
    ],
    benefits_title: 'Key Benefits of CardKo',
    benefits_blurb: COMMON_BENEFITS_BLURB,
    benefits: COMMON_BENEFITS,
    coming_soon: 0,
  },
];

const EDITORIALS = [
  {
    slug: 'coordination-checkpoints-before-construction',
    title: 'Five Coordination Checkpoints Before Construction Begins',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'architecture',
    tags: 'design coordination, construction planning, quality assurance',
    image_url: 'assets/images/editorials/architecture-design-coordination.png',
    body: `Good coordination starts before drawings are issued. Align the design brief, scope boundaries, governing requirements, and decision owners at the beginning so every discipline works from the same baseline.

Before each major submission, review the interfaces between architectural layout, structural systems, building services, and site constraints. Pay particular attention to openings, clearances, loads, levels, access routes, and maintenance zones because these are common sources of late changes.

Close every checkpoint with documented decisions, assigned actions, and a clear revision status. Models and issue logs help with traceability, but their value depends on a team consistently resolving and recording what has changed.`,
  },
  {
    slug: 'structural-data-for-better-design-decisions',
    title: 'Using Structural Data to Make Better Design Decisions',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'architecture',
    tags: 'structural engineering, data, design decisions',
    image_url: 'assets/images/editorials/architecture-structural-data.png',
    body: `Structural analysis produces more than pass-or-fail results. Load paths, demand-to-capacity ratios, deflection patterns, and sensitivity studies can reveal where a design is robust and where assumptions deserve closer attention.

The most useful review begins with transparent inputs. Teams should understand the design criteria, material properties, boundary conditions, load combinations, and modeling simplifications before interpreting the output. Comparing alternative schemes against the same criteria makes trade-offs easier to explain.

Data supports engineering judgment; it does not replace it. Results should be checked against first principles, constructability, code requirements, and the real behavior expected from the structure throughout its service life.`,
  },
  {
    slug: 'digital-quality-assurance-multidisciplinary-projects',
    title: 'Digital Quality Assurance for Multidisciplinary Projects',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'architecture',
    tags: 'digital QA, BIM coordination, multidisciplinary delivery',
    image_url: 'assets/images/editorials/architecture-digital-qa.png',
    body: `Digital quality assurance works best as a repeatable process rather than a final inspection. Define the required information, naming rules, model responsibilities, and approval stages before production accelerates.

Automated checks can identify missing information, duplicate elements, clearance conflicts, and inconsistent parameters. These checks should be paired with professional review of intent, constructability, sequencing, and operational access—areas where context matters as much as geometry.

A shared issue register completes the process. Each item needs an owner, priority, due date, evidence of resolution, and verified closure so the project team can distinguish real progress from issues that have only moved between systems.`,
  },
  {
    slug: 'start-ai-with-measurable-business-problem',
    title: 'Start AI With a Measurable Business Problem',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'data',
    tags: 'artificial intelligence, business value, AI planning',
    image_url: 'assets/images/editorials/data-practical-ai.png',
    body: `Successful AI initiatives begin with a decision or workflow that needs improvement—not with a model looking for a purpose. Define who experiences the problem, what currently happens, and which result would be meaningfully better.

Turn that goal into measurable criteria such as reduced processing time, fewer errors, faster response, improved forecasting, or better service consistency. Establish a current baseline so the team can tell whether the new system creates real value.

Start with a narrow pilot using representative data and clear human oversight. A focused test exposes data gaps, operational constraints, and adoption risks early, making it easier to decide whether to refine, scale, or stop the initiative.`,
  },
  {
    slug: 'messy-data-to-dependable-dashboards',
    title: 'From Messy Data to Dependable Dashboards',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'data',
    tags: 'data engineering, dashboards, analytics',
    image_url: 'assets/images/editorials/data-reliable-dashboards.png',
    body: `A dashboard is only as dependable as the data pipeline behind it. Before choosing charts, identify the source systems, owners, refresh schedules, definitions, and known limitations that shape every reported metric.

Reliable pipelines validate formats, remove duplicates, handle missing values, and record transformation rules. Shared definitions are equally important: teams must agree on what each measure includes, when it is calculated, and which source is authoritative.

The final dashboard should prioritize decisions rather than decoration. Show the few indicators that need attention, provide enough context to interpret change, and make it possible to trace important numbers back to their source.`,
  },
  {
    slug: 'human-oversight-in-practical-ai-systems',
    title: 'Human Oversight in Practical AI Systems',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'data',
    tags: 'responsible AI, governance, human oversight',
    image_url: 'assets/images/editorials/data-human-oversight.png',
    body: `Human oversight should be designed into an AI workflow from the beginning. Teams need to identify which decisions can be automated, which require review, and which must always remain with an accountable person.

Useful review interfaces show the recommendation, relevant evidence, uncertainty, and the consequences of acting or not acting. Reviewers should be able to question, override, and document a decision without working around the system.

Oversight continues after launch. Monitor accuracy, exceptions, user feedback, and changes in the operating environment. Clear escalation paths and periodic evaluation help keep the system aligned with its intended purpose.`,
  },
  {
    slug: 'designing-internal-systems-people-use',
    title: 'Designing Internal Systems People Actually Use',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'software',
    tags: 'user experience, internal systems, workflow design',
    image_url: 'assets/images/editorials/software-usable-systems.png',
    body: `Internal software succeeds when it supports the way work is really done. Begin by observing users, mapping handoffs, and identifying where information is repeated, delayed, or lost across spreadsheets, messages, and disconnected tools.

Design the smallest clear workflow that removes friction. Use familiar language, sensible defaults, visible status, and role-appropriate actions. Early prototypes should be tested with the people who will use the system under real operating conditions.

Adoption also depends on trust. Explain changes, provide focused training, collect feedback, and improve the highest-friction tasks first. A useful system becomes part of the process because it saves effort—not because users are forced to tolerate it.`,
  },
  {
    slug: 'secure-maintainable-web-applications',
    title: 'Building Secure and Maintainable Web Applications',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'software',
    tags: 'web development, application security, maintainability',
    image_url: 'assets/images/editorials/software-secure-applications.png',
    body: `Security and maintainability reinforce each other. Clear architecture, limited responsibilities, reviewed dependencies, and consistent deployment practices make a system easier to understand and reduce the places where defects can hide.

Protect the application in layers: validate input, enforce authorization on the server, manage secrets outside the codebase, encrypt sensitive traffic, log important events, and keep libraries current. Automated tests and code review should cover the paths that matter most to users and the business.

Plan for operation as carefully as development. Reliable backups, monitoring, documented recovery steps, and controlled releases help the team respond to failures without improvising under pressure.`,
  },
  {
    slug: 'prototype-to-production-with-control',
    title: 'From Prototype to Production Without Losing Control',
    author: 'KDT Editorial Team',
    date: '2026-08-26',
    category: 'software',
    tags: 'product development, deployment, software delivery',
    image_url: 'assets/images/editorials/software-prototype-production.png',
    body: `A prototype proves that an idea can work; production proves that it can be operated reliably. Before scaling, separate experimental shortcuts from decisions that are safe to keep and document the risks that still need attention.

Build a controlled path through development, testing, staging, and production. Use versioned changes, automated checks, representative test data, and clear approval points so every release can be understood and repeated.

Launch with monitoring and a rollback plan. Measure performance, errors, security events, and user outcomes after release, then feed those observations into the next improvement cycle. Production readiness is an ongoing discipline rather than a one-time milestone.`,
  },
];

const CONTENT_SECTIONS = [
  {
    key: 'home.hero', page: 'home', label: 'Home webinar hero', display_order: 10,
    eyebrow: 'Free KDT webinar', title: 'Build smarter with KDT.',
    body: 'Join our free webinar on practical AI, engineering, and digital systems for real organizational challenges.',
    subtitle: 'Online · Free registration · Schedule to be announced',
    image_url: 'assets/images/kdt-webinar-command-center.png',
    cta_label: 'Register your interest', cta_url: '#contact',
  },
  {
    key: 'home.industries', page: 'home', label: 'Explore KDT by industry', display_order: 20,
    eyebrow: 'Industries', title: 'Explore KDT by industry',
    items: [
      { title: 'Artificial Intelligence', icon: 'assets/images/ai-innovation-01-stroke-rounded.svg', image: 'assets/images/industry-artificial-intelligence.png', image_alt: 'Abstract AI system transforming connected data into structured insights', href: 'services-data.html' },
      { title: 'Engineering and Construction', icon: 'assets/images/tools.svg', image: 'assets/images/industry-engineering-construction.png', image_alt: 'Building and bridge transitioning from engineering wireframe to completed structure', href: 'services.html' },
      { title: 'Organization', icon: 'assets/images/user.svg', image: 'assets/images/industry-organization.png', image_alt: 'Professional team coordinating connected organizational systems around a shared table', href: 'services-software.html' },
    ],
  },
  {
    key: 'home.products', page: 'home', label: 'Popular products', display_order: 30,
    eyebrow: 'Built by KDT', title: 'Popular products', subtitle: 'KDT products A–Z',
    items: [
      { name: 'Nexus', number: '01', slug: 'membership', href: 'product-membership.html', logo: 'assets/images/product-nexus.png' },
      { name: 'Axis', number: '02', slug: 'construct-pro', href: 'product-construct.html', logo: 'assets/images/product-axis.png' },
      { name: 'Vantage', number: '03', slug: 'structural-chatbot', href: 'product-chatbot.html', logo: 'assets/images/product-vantage.png' },
      { name: 'Kuwalog', number: '04', slug: 'wms', href: 'product-wms.html', logo: 'assets/images/product-kuwalog.png' },
      { name: 'TakeOff', number: '05', slug: 'cardko', href: 'product-cardko.html', logo: 'assets/images/product-takeoff.png' },
    ],
  },
  {
    key: 'home.services', page: 'home', label: 'What we offer', display_order: 40,
    eyebrow: 'What we offer', title: 'Expertise that moves work forward.',
    body: 'KDT brings engineering, data, software, and practical training together to help organizations move from challenge to working solution.',
    items: [
      { title: 'Architecture and Engineering Services', description: 'Professional design and engineering solutions tailored to your project requirements.', image: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317603/eng-card_b99f6c.webp', href: 'services.html' },
      { title: 'Data Science and Analytics', description: 'Transform your data into actionable insights with our advanced analytics solutions.', image: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317603/dsa-card_bnnv0x.png', href: 'services-data.html' },
      { title: 'Software Development', description: 'Custom software and web applications tailored to your specific business needs.', image: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317604/sd-card_jwzlef.png', href: 'services-software.html' },
      { title: 'Bootcamp', description: 'Intensive training programs designed to upskill professionals in technology and engineering.', image: 'assets/images/kdt-bootcamp-workshop.png', href: 'services-bootcamp.html' },
    ],
  },
  {
    key: 'home.partners', page: 'home', label: 'Industry partners', display_order: 50,
    eyebrow: 'Industry partners', title: 'Collaboration built around shared expertise.',
    body: 'KDT works with industry partners to connect specialist knowledge, technology, and practical delivery.',
    items: [
      { name: 'JPF', image: 'assets/images/jpf.png' },
      { name: 'Maverick', image: 'assets/images/mav.png' },
    ],
  },
  {
    key: 'home.solution-divider', page: 'home', label: 'Solution call to action', display_order: 60,
    eyebrow: 'From insight to execution', title: 'What can KDT help you build next?',
    image_url: 'assets/images/kdt-ai-engineering-divider.png',
    cta_label: 'Talk with our team', cta_url: '#contact',
  },
  {
    key: 'home.faq', page: 'home', label: 'Frequently asked questions', display_order: 70,
    eyebrow: 'Questions, answered', title: 'Frequently Asked Questions',
    body: 'Clear answers about KDT services, project engagement, pricing, and ongoing support.',
    items: [
      { question: 'What services do you offer?', answer: 'We provide data analytics, software development, and engineering professional design services tailored to your business needs.' },
      { question: 'How can I get started?', answer: "Simply contact us through our website or call our team. We'll schedule a consultation to discuss your project requirements." },
      { question: 'What is your pricing model?', answer: 'Our pricing is project-based and depends on the scope and complexity. We provide detailed quotes after understanding your needs.' },
      { question: 'Do you offer support after project completion?', answer: 'Yes, we provide ongoing support and maintenance services to ensure your solution continues to perform optimally.' },
    ],
  },
  {
    key: 'about.hero', page: 'about', label: 'Company profile hero', display_order: 10,
    eyebrow: 'Company Profile', title: 'KDT Network and Data Solution',
    body: 'KDT Network and Data Solution (KDT Solution) is a Philippine-based consultancy firm dedicated to providing efficient and cost-effective data science and analytics, information technology, and professional design services. Combining these skillsets, we aim to be digital enablers for companies, institutions, and organizations.',
    image_url: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776392434/about-illustration_fj4suq.png',
    image_alt: 'KDT engineering, data, and digital solutions',
    cta_label: 'View Company Profile (PDF)', cta_url: 'assets/documents/kdt-company-profile.pdf',
  },
  {
    key: 'about.stats', page: 'about', label: 'Company statistics', display_order: 20,
    items: [
      { value: '3+', label: 'Years Experience' }, { value: '30+', label: 'Successful Projects' },
      { value: '2+', label: 'Active Partners' }, { value: '9+', label: 'Team Members' },
    ],
  },
  {
    key: 'about.values', page: 'about', label: 'Company values', display_order: 30,
    eyebrow: 'Our principles', title: 'We are committed to',
    subtitle: 'Creating intuitive digital solutions that simplify everyday processes',
    items: [
      { title: 'Innovation', description: 'Creating new ideas and improving solutions to meet changing needs.', icon: 'assets/images/ai-innovation-01-stroke-rounded.svg' },
      { title: 'Quality', description: 'Delivering high-standard products and services that meet expectations.', icon: 'assets/images/quality.svg' },
      { title: 'Integrity', description: 'Serving with honesty, transparency, and strong moral principles.', icon: 'assets/images/integrity.svg' },
    ],
  },
  {
    key: 'about.story', page: 'about', label: 'Company story', display_order: 40,
    eyebrow: 'Who we are', title: 'Our Story',
    body: 'KDT Network and Data Solution (KDT Solution) is a Philippine-based consultancy firm committed to helping organizations transform and improve through technology and design. By combining expertise in data science and analytics, information technology, and professional design services, KDT positions itself as a digital enabler for companies, institutions, and organizations. Their goal is to provide efficient and cost-effective solutions that support better decision-making, streamlined operations, and improved digital presence across various industries.',
    subtitle: 'KDT offers a wide range of services that cater to modern digital needs. Delivering practical digital solutions that help businesses and organizations adapt to the evolving technological landscape, improve productivity, and achieve long-term growth through innovation.',
  },
  {
    key: 'owner.hero', page: 'owner', label: 'Owner page hero', display_order: 10,
    eyebrow: 'About KDT', title: 'Company Owner',
    body: 'Leadership grounded in software development, data science, artificial intelligence, and engineering.',
  },
  {
    key: 'owner.profile', page: 'owner', label: 'Owner profile', display_order: 20,
    eyebrow: 'KDT Leadership', title: 'Kristoffer Dave A. Tabong',
    subtitle: 'Company Owner & President',
    body: "Kristoffer is a data scientist and software development leader with twelve years of professional experience. As President, he leads KDT's overall operations and the end-to-end delivery of custom software, data science, and AI solutions across web, mobile, and desktop platforms.",
    image_url: 'assets/images/kdt-owner-transparent-840.png',
    image_alt: 'Kristoffer Dave A. Tabong, Company Owner and President of KDT Network and Data Solution',
    items: [
      { type: 'paragraph', text: 'His multidisciplinary background includes directing construction-systems analytics, teaching data science and AI at the University of Santo Tomas, and structural engineering for vertical structures and major infrastructure across Southeast Asia, North America, the Middle East, and Europe. He currently also serves as a Junior Managing Engineer (Structural) consultant at the University of the Philippines.' },
      { type: 'stat', value: '12 years', label: 'Professional experience' },
      { type: 'stat', value: '4 pillars', label: 'KDT service leadership' },
      { type: 'stat', value: '3rd & 8th', label: 'National board exam placements' },
      { type: 'credentials', text: 'MS in Data Science, Asian Institute of Management; BS Civil Engineering, Magna Cum Laude, University of Santo Tomas. AWS Academy Cloud Architecting graduate and passer of the NCEES FE Civil and PE Civil Structural Engineering examinations. Associate Member, Association of Structural Engineers of the Philippines (ASEP).' },
      { type: 'link', label: 'View Resume (PDF)', href: 'assets/documents/kristoffer-dave-tabong-resume.pdf' },
      { type: 'link', label: 'LinkedIn', href: 'https://www.linkedin.com/in/kristoffer-dave-tabong-7183b2a7/' },
    ],
  },
];

const SERVICES = [
  {
    slug: 'architecture',
    title: 'Architecture and Engineering Services',
    description: 'We deliver end-to-end architecture and engineering consultancy — from preliminary concept design and detailed structural planning to construction drawings and technical specifications. Our team blends aesthetic vision with engineering precision to ensure every project is safe, functional, compliant, and built to last.',
    offerings: [
      { title: 'Residential Projects', desc: 'Custom home and residential building designs that balance comfort, style, and practicality — crafted to reflect the needs and lifestyle of every homeowner.' },
      { title: 'Commercial Buildings', desc: 'Functional and modern designs for offices, retail spaces, and commercial establishments — built to maximize usability, brand identity, and long-term value.' },
      { title: 'Low to Mid-rise Buildings', desc: 'Structural and architectural planning for multi-storey buildings — combining engineering safety, space efficiency, and code-compliant design for modern urban developments.' },
    ],
  },
  {
    slug: 'data',
    title: 'Data Science and Analytics',
    description: 'We turn raw data into measurable business outcomes — building interactive dashboards, reliable data pipelines, and predictive machine learning models. From defining KPIs to deploying AI-driven insights, we help your team make faster, smarter, and more confident decisions.',
    offerings: [
      { title: 'Dashboarding', desc: 'Interactive, visually-rich dashboards that turn complex data into clear, real-time insights — empowering faster and more informed business decisions.' },
      { title: 'Database Management', desc: 'Secure, scalable database design, optimization, and maintenance — ensuring your data remains organized, accessible, and protected as your business grows.' },
      { title: 'AI and Machine Learning', desc: 'Custom machine learning models and AI solutions that uncover patterns, automate decisions, and predict outcomes — unlocking intelligent, data-driven growth.' },
    ],
  },
  {
    slug: 'software',
    title: 'Software Development',
    description: 'We build custom digital products from the ground up — intuitive UI/UX designs, responsive web applications, native mobile and desktop apps, and robust backend systems. Every solution is engineered to be secure, scalable, and crafted around the unique workflows of your business.',
    offerings: [
      { title: 'UI/UX', desc: 'User-focused interface and experience design that blends aesthetics with usability — creating intuitive, engaging digital journeys that keep users coming back.' },
      { title: 'Website App Development', desc: 'Fast, responsive, and scalable web applications built with modern frameworks — engineered to deliver seamless performance across every browser and device.' },
      { title: 'Mobile and Desktop App Development', desc: 'Native and cross-platform apps for iOS, Android, Windows, and macOS — delivering smooth, reliable, and feature-rich experiences wherever your users are.' },
    ],
  },
];

const COURSE_INCLUSIONS = ['Training handouts', 'Digital Certificates', 'Learning Management System', 'Access to Recordings and Resources'];
const COURSES = [
  {
    slug: 'basic-programming-and-vibe-coding', title: 'Basic Programming and Vibe Coding',
    description: 'Gain hands-on experience building real applications as you learn Python from scratch, develop practical problem-solving skills, and leverage AI coding assistants to turn your ideas into fully functional apps.',
    image_url: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course1_bcxagt.png',
    tags: ['Python Basics', 'AI Coding Tools', 'Basic Programming', 'Vibe Coding'], start_date: 'Starts on June 2026',
  },
  {
    slug: 'ai-chatbots-and-agents', title: 'AI Chatbots & Agents',
    description: 'Design, build, and deploy your own chatbot on platforms like websites. Learn how to train it using your own data so it can give more customized and useful responses for tasks like customer support or simple automation.',
    image_url: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course2_r0hcgv.png',
    tags: ['AI Chatbot', 'Agents', 'Voice Agents', 'RAG'], start_date: 'Starts on June 2026',
  },
  {
    slug: 'data-visualization-and-dashboard', title: 'Data Visulization and Dashboard',
    description: 'Develop skills in data analysis, dashboard creation, and data storytelling as you turn raw data into actionable insights using tools like Python and Power BI to organize information and support better decision-making.',
    image_url: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course3_izdc1n.png',
    tags: ['Dashboard', 'Data Analysis', 'Deployment', 'Python libraries'], start_date: 'Starts on July 2026',
  },
  {
    slug: 'automation-using-ai-and-python', title: 'Automation using AI and Python',
    description: 'Create automation tools and AI agents that automate repetitive workflows, helping reduce manual work and improve efficiency by streamlining business processes and maximizing productivity in daily operations.',
    image_url: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course4_kjvop6.png',
    tags: ['Python', 'Artificial Intelligence', 'Automation', 'Scheduling'], start_date: 'Starts on July 2026',
  },
].map(course => ({
  ...course,
  level: 'Beginner-friendly', mode: 'Online via Zoom', status: 'Open for registration',
  inclusions: COURSE_INCLUSIONS, register_url: 'https://events.kdtdatasolution.com', topics: [],
}));

// Seed an admin user on first boot if one doesn't already exist.
// Credentials come from backend/.env (ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME).
// Existing accounts are never overwritten here — use `npm run seed:admin` to reset.
export function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrator';

  if (!email || !password) {
    console.warn('[seed] ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed');
    return;
  }
  if (password.length < 8) {
    console.warn('[seed] ADMIN_PASSWORD must be at least 8 characters — skipping admin seed');
    return;
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return; // already seeded; leave it alone

  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare(
    "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'admin')"
  ).run(email, password_hash, name);
  console.log(`[seed] created admin user: ${email}`);
}

export function seedInitial() {
  seedAdminUser();

  const insertContent = db.prepare(`
    INSERT OR IGNORE INTO content_sections
      (key, page, label, eyebrow, title, subtitle, body, image_url, image_alt, cta_label, cta_url, items_json, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `);
  for (const section of CONTENT_SECTIONS) {
    insertContent.run(
      section.key, section.page, section.label || '', section.eyebrow || '',
      section.title || '', section.subtitle || '', section.body || '',
      section.image_url || '', section.image_alt || '', section.cta_label || '',
      section.cta_url || '', JSON.stringify(section.items || []),
      section.display_order || 0
    );
  }

  // Keep administrator-managed product names and ordering, while adding the
  // dedicated page metadata needed by every product navigation surface.
  const homeProductsSection = db.prepare(
    'SELECT items_json FROM content_sections WHERE key = ?'
  ).get('home.products');
  if (homeProductsSection) {
    const linkMap = {
      nexus: { slug: 'membership', href: 'product-membership.html', logo: 'assets/images/product-nexus.png' },
      axis: { slug: 'construct-pro', href: 'product-construct.html', logo: 'assets/images/product-axis.png' },
      vantage: { slug: 'structural-chatbot', href: 'product-chatbot.html', logo: 'assets/images/product-vantage.png' },
      kuwalog: { slug: 'wms', href: 'product-wms.html', logo: 'assets/images/product-kuwalog.png' },
      takeoff: { slug: 'cardko', href: 'product-cardko.html', logo: 'assets/images/product-takeoff.png' },
    };
    let items = [];
    try { items = JSON.parse(homeProductsSection.items_json || '[]'); } catch {}
    let changed = false;
    for (const item of items) {
      const mapped = linkMap[String(item.name || '').toLowerCase()];
      if (!mapped) continue;
      if (!item.slug) { item.slug = mapped.slug; changed = true; }
      if (!item.href) { item.href = mapped.href; changed = true; }
      if (!item.logo) { item.logo = mapped.logo; changed = true; }
    }
    if (changed) {
      db.prepare(
        "UPDATE content_sections SET items_json = ?, updated_at = datetime('now') WHERE key = ?"
      ).run(JSON.stringify(items), 'home.products');
    }
  }

  // Migrate only the legacy Bootcamp card image so existing administrator
  // edits to the rest of the services section remain untouched.
  const homeServicesSection = db.prepare(
    'SELECT items_json FROM content_sections WHERE key = ?'
  ).get('home.services');
  if (homeServicesSection) {
    let items = [];
    try { items = JSON.parse(homeServicesSection.items_json || '[]'); } catch {}
    const legacyImage = 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776772395/bootcamp-card_rceyil.png';
    let changed = false;
    for (const item of items) {
      if (String(item.title || '').toLowerCase() !== 'bootcamp' || item.image !== legacyImage) continue;
      item.image = 'assets/images/kdt-bootcamp-workshop.png';
      changed = true;
    }
    if (changed) {
      db.prepare(
        "UPDATE content_sections SET items_json = ?, updated_at = datetime('now') WHERE key = ?"
      ).run(JSON.stringify(items), 'home.services');
    }
  }

  const insertService = db.prepare(`
    INSERT OR IGNORE INTO services (slug, title, description, offerings_json)
    VALUES (?, ?, ?, ?)
  `);
  for (const service of SERVICES) {
    insertService.run(service.slug, service.title, service.description, JSON.stringify(service.offerings));
  }

  const insertCourse = db.prepare(`
    INSERT OR IGNORE INTO courses
      (slug, title, description, image_url, tags_json, start_date, level, mode, status, inclusions_json, register_url, topics_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const course of COURSES) {
    insertCourse.run(
      course.slug, course.title, course.description, course.image_url,
      JSON.stringify(course.tags), course.start_date, course.level, course.mode,
      course.status, JSON.stringify(course.inclusions), course.register_url,
      JSON.stringify(course.topics)
    );
  }

  const insertEditorial = db.prepare(`
    INSERT OR IGNORE INTO articles
      (slug, title, author, date, category, tags, image_url, body)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const editorial of EDITORIALS) {
    insertEditorial.run(
      editorial.slug, editorial.title, editorial.author, editorial.date,
      editorial.category, editorial.tags, editorial.image_url, editorial.body
    );
  }

  const insert = db.prepare(
      `INSERT OR IGNORE INTO products (slug, title, description, actions_json, steps_json, benefits_json, benefits_title, benefits_blurb, coming_soon)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  let insertedProducts = 0;
  for (const p of PRODUCTS) {
    const result = insert.run(
        p.slug, p.title, p.description,
        JSON.stringify(p.actions),
        JSON.stringify(p.steps),
        JSON.stringify(p.benefits),
        p.benefits_title, p.benefits_blurb, p.coming_soon
    );
    insertedProducts += result.changes;
  }
  if (insertedProducts) console.log(`[seed] inserted ${insertedProducts} products`);

  // Retire the discontinued TABS entry from databases created by older releases.
  const removedTabs = db.prepare(
    "DELETE FROM products WHERE lower(trim(slug)) = 'tabs' OR lower(trim(title)) = 'tabs'"
  ).run();
  if (removedTabs.changes) console.log(`[seed] removed ${removedTabs.changes} retired TABS product`);

  // One-time alignment of legacy product titles with their public KDT names.
  // The title guard preserves any later administrator-authored changes.
  const alignProductTitle = db.prepare(
    'UPDATE products SET title = ? WHERE slug = ? AND title = ?'
  );
  for (const [slug, publicTitle, legacyTitle] of [
    ['membership', 'Nexus', 'Membership Portal'],
    ['construct-pro', 'Axis', 'Construct Pro'],
    ['structural-chatbot', 'Vantage', 'Structural Chatbot'],
    ['wms', 'Kuwalog', 'Sophisticated Tracking for Modern Warehousing'],
    ['cardko', 'TakeOff', 'CardKo'],
  ]) {
    alignProductTitle.run(publicTitle, slug, legacyTitle);
  }
}
