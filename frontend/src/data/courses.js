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
    tags: [
      'Python Basics',
      'AI Coding Tools',
      'Basic Programming',
      'Vibe Coding',
    ],
    startDate: 'Starts on June 2026',
    level: 'Beginner-friendly',
    mode: 'Online via Zoom',
    status: 'Open for registration',
    inclusions: COMMON_INCLUSIONS,
    registerHref: REGISTER_HREF,
    topics: [
      {
        icon: 'programming',
        title: 'Programming Foundations',
        desc: 'Learn how programming works and set up your Python environment with an AI coding assistant. Build your first simple program using basic concepts like variables and input/output.',
      },
      {
        icon: 'logic',
        title: 'Logic & Problem Solving',
        desc: 'Develop problem-solving skills using conditionals, loops, and functions. Apply these concepts by creating a simple tool like a calculator or text-based program.',
      },
      {
        icon: 'ai-assistant',
        title: 'Vibe Coding with Assistants & Builders',
        desc: 'Learn how programming works and set up your Python environment with an AI coding assistant. Build your first simple program using basic concepts like variables and input/output.',
      },
      {
        icon: 'claude',
        title: 'Build & Ship Your AI-Assisted App',
        desc: 'Learn how programming works and set up your Python environment with an AI coding assistant. Build your first simple program using basic concepts like variables and input/output.',
      },
    ],
  },
  {
    slug: 'ai-chatbots-and-agents',
    title: 'AI Chatbots & Agents',
    desc: 'Design, build, and deploy your own chatbot on platforms like websites. Learn how to train it using your own data so it can give more customized and useful responses for tasks like customer support or simple automation.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course2_r0hcgv.png',
    tags: ['AI Chatbot', 'Agents', 'Voice Agents', 'RAG'],
    startDate: 'Starts on June 2026',
    level: 'Beginner-friendly',
    mode: 'Online via Zoom',
    status: 'Open for registration',
    inclusions: COMMON_INCLUSIONS,
    registerHref: REGISTER_HREF,
    topics: [
      {
        icon: 'chatbot',
        title: 'Chatbots vs Agents — Foundations',
        desc: 'Understand the chatbot-to-agent spectrum, including how chatbots differ from AI agents in handling tasks. Learn LLM APIs (Claude, OpenAI), authentication, prompting, system design, and build a simple CLI chatbot.',
      },
      {
        icon: 'tools',
        title: 'Tool Use, Function Calling & MCP',
        desc: 'Learn how function calling and tool use turn chatbots into AI agents, along with an introduction to MCP. Explore memory, conversation history, guardrails, and build a tool-using agent.',
      },
      {
        icon: 'voice-agent',
        title: 'Agentic RAG & Voice Agents',
        desc: 'Understand RAG and how agents retrieve and use external data through vector databases and embeddings. Explore voice AI systems (STT, LLM, TTS) and build a basic doc-based or voice-enabled agent.',
      },
      {
        icon: 'deployment',
        title: 'Multi-Channel Deployment & Safety',
        desc: 'Learn how to deploy agents across platforms like Messenger, Viber, WhatsApp, and web using webhooks. Cover production safety, observability, and build a deployed real-world agent.',
      },
    ],
  },
  {
    slug: 'data-visualization-and-dashboard',
    title: 'Data Visulization and Dashboard',
    desc: 'Develop skills in data analysis, dashboard creation, and data storytelling as you turn raw data into actionable insights using tools like Python and Power BI to organize information and support better decision-making.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course3_izdc1n.png',
    tags: ['Dashboard', 'Data Analysis', 'Deployment', 'Python libraries'],
    startDate: 'Starts on July 2026',
    level: 'Beginner-friendly',
    mode: 'Online via Zoom',
    status: 'Open for registration',
    inclusions: COMMON_INCLUSIONS,
    registerHref: REGISTER_HREF,
    topics: [
      {
        icon: 'data-visualization',
        title: 'Data & Visulization Foundations',
        desc: 'Learn the importance of data visualization and explore different chart types for effective data presentation. Use Python (pandas) and AI tools like ChatGPT or Claude to load, clean, and analyze real-world datasets.',
      },
      {
        icon: 'charts',
        title: 'Creating Charts that Communicate',
        desc: 'Learn how to create clear and effective visualizations using Python libraries like Matplotlib, Seaborn, and Plotly. Apply design principles and use AI to quickly generate and improve chart outputs.',
      },
      {
        icon: 'first-dashboard',
        title: 'Building Your First Dashboard',
        desc: 'Build interactive dashboards using tools like Streamlit, Looker Studio, or Power BI depending on your path. Use AI to speed up development and connect multiple charts into a functional dashboard.',
      },
      {
        icon: 'deployment',
        title: ' Storytelling & Deployment',
        desc: 'Learn how to turn data into insights through storytelling, annotations, and narrative structure. Deploy your dashboard online and present it as a complete, shareable project.',
      },
    ],
  },
  {
    slug: 'automation-using-ai-and-python',
    title: 'Automation using AI and Python',
    desc: 'Create automation tools and AI agents that automate repetitive workflows, helping reduce manual work and improve efficiency by streamlining business processes and maximizing productivity in daily operations.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1777263856/Course4_kjvop6.png',
    tags: ['Python', 'Artificial Intelligence', 'Automation', 'Scheduling'],
    startDate: 'Starts on July 2026',
    level: 'Beginner-friendly',
    mode: 'Online via Zoom',
    status: 'Open for registration',
    inclusions: COMMON_INCLUSIONS,
    registerHref: REGISTER_HREF,
    topics: [
      {
        icon: 'automation',
        title: 'Foundations & the Modern Automation Landscape',
        desc: 'Learn the fundamentals of automation using Python, including working with files, folders, Excel, and CSV data. Compare code-based automation, low-code platforms, and AI agents by building the same workflow in both Python and tools like n8n or Make.',
      },
      {
        icon: 'agent',
        title: 'Building Your First Agent',
        desc: 'Understand what AI agents are and how they differ from scripts and workflows. Build a simple agent using LLM APIs, tool use, and safety patterns to handle tasks like inbox triage or lead classification.',
      },
      {
        icon: 'browser',
        title: 'Browser, Desktop & Document Automation',
        desc: 'Explore advanced automation techniques using browser tools like Playwright and AI-powered agents for web and desktop tasks. Build systems that extract, process, and summarize data from websites, documents, and files using AI.',
      },
      {
        icon: 'deployment',
        title: 'Deploying, Scheduling & Shipping',
        desc: 'Learn how to deploy and schedule automation workflows using tools like cron, cloud functions, and automation platforms. Build and ship a complete agent that runs automatically and integrates with real-world tools like Gmail, Sheets, or Slack.',
      },
    ],
  },
];

export function getCourseBySlug(slug) {
  return courses.find((c) => c.slug === slug);
}
