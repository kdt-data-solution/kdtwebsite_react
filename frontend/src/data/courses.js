// Course content for the AI Bootcamp Series. Keyed by slug.
// Used by both the bootcamp listing (services-bootcamp.html) and
// the course detail page (course.html?slug=...).

const COMMON_INCLUSIONS = [
  'Training handouts',
  'Digital Certificates',
  'Learning Management System',
  'Access to Recordings and Resources',
];

const REGISTER_HREF = 'https://events.kdtdatasolution.com';

export const courses = [
  {
    slug: 'basic-programming-and-vibe-coding',
    title: 'Basic Programming and Vibe Coding',
    desc: 'Gain hands-on experience building real applications as you learn Python from scratch, develop practical problem-solving skills, and leverage AI coding assistants to turn your ideas into fully functional apps.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course1_bcxagt.png',
    tags: ['Python Basics', 'AI Coding Tools', 'Basic Programming', 'Vibe Coding'],
    startDate: 'Starts on June 2026',
    level: 'Beginner-friendly',
    mode: 'Online via Zoom',
    status: 'Open for registration',
    inclusions: COMMON_INCLUSIONS,
    registerHref: REGISTER_HREF,
  },
  {
    slug: 'ai-chatbots-and-agents',
    title: 'AI Chatbots & Agents',
    desc: 'Design, build, and deploy your own chatbot on platforms like websites. Learn how to train it using your own data so it can give more customized and useful responses for tasks like customer support or simple automation.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course2_r0hcgv.png',
    tags: ['AI Chatbot', 'Agents', 'Basic Programming'],
    startDate: 'Starts on June 2026',
    level: 'Beginner-friendly',
    mode: 'Online via Zoom',
    status: 'Open for registration',
    inclusions: COMMON_INCLUSIONS,
    registerHref: REGISTER_HREF,
  },
  {
    slug: 'data-visualization-and-dashboard',
    title: 'Data Visulization and Dashboard',
    desc: 'Develop skills in data analysis, dashboard creation, and data storytelling as you turn raw data into actionable insights using tools like Python and Power BI to organize information and support better decision-making.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course3_izdc1n.png',
    tags: ['Dashboard', 'Data Analysis', 'Basic Programming'],
    startDate: 'Starts on July 2026',
    level: 'Beginner-friendly',
    mode: 'Online via Zoom',
    status: 'Open for registration',
    inclusions: COMMON_INCLUSIONS,
    registerHref: REGISTER_HREF,
  },
  {
    slug: 'automation-using-ai-and-python',
    title: 'Automation using AI and Python',
    desc: 'Create automation tools and AI agents that automate repetitive workflows, helping reduce manual work and improve efficiency by streamlining business processes and maximizing productivity in daily operations.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course4_kjvop6.png',
    tags: ['Python', 'Artificial Intelligence', 'Automation'],
    startDate: 'Starts on July 2026',
    level: 'Beginner-friendly',
    mode: 'Online via Zoom',
    status: 'Open for registration',
    inclusions: COMMON_INCLUSIONS,
    registerHref: REGISTER_HREF,
  },
];

export function getCourseBySlug(slug) {
  return courses.find((c) => c.slug === slug);
}
