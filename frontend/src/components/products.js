import '../styles/style.css';

const BASE = import.meta.env.BASE_URL;

const products = [
  {
    title: 'Membership Portal',
    desc: 'Professional engineering tools and solutions tailored to your project requirements.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776324221/mb-card_lnpi4c.png',
    href: 'product-membership.html',
    soon: false,
  },
  {
    title: 'Intelligent Search for Value-driven Properties',
    desc: 'A smart property finder designed to help users discover affordable opportunities with greater speed and clarity. From regular listings to bank foreclosed properties, it streamlines search and tracking for a more efficient and value-focused property journey.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776324222/pf-card_rniidz.png',
    href: 'product-construct.html',
    soon: false,
  },
  {
    title: 'Smart Service Chat Agent for Selling and Ordering',
    desc: 'A smart conversational assistant designed to simplify and accelerate the way businesses handle selling and ordering. It enables customers and business owners to browse products, place orders, check availability, and get instant answers all through a natural, chat-based experience without the need for phone calls, manual order forms, or dedicated sales staff.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776837709/agentic-card_c3loqn.png',
    href: 'product-chatbot.html',
    soon: false,
  },
  {
    title: 'Sophisticated Tracking for Modern Warehousing',
    desc: 'A smart warehouse solution designed to improve visibility, accuracy, and control across daily operations.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776772755/wms-card_teymis.png',
    href: 'product-wms.html',
    soon: false,
  },
  {
    title: 'CardKo',
    desc: 'A digital business card and networking platform for professionals and organizations. Easily share your contact details, portfolio, and social links with a simple scan.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776324221/ck-card_ca85hx.png',
    href: 'product-cardko.html',
    soon: false,
  },
  {
    title: 'Three-dimensional AI-Powered Building Systems',
    desc: 'An AI-powered 3D building system that transforms how architects and engineers plan, visualize, and manage construction projects.',
    image:
      'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776772399/tabs-card1_zuofsy.png',
    href: '',
    soon: true,
  },
];

function cardHtml(p) {
  const title = `${p.title}${p.soon ? ' <span class="text-xs text-gray-400 font-medium">(Soon)</span>' : ''}`;
  const moreInfo = p.soon
    ? `<span class="flex-1 bg-gray-100 text-gray-400 py-2 md:py-2.5 text-xs sm:text-sm md:text-base rounded-md font-semibold border border-gray-200 text-center cursor-not-allowed select-none">More Info</span>`
    : `<a href="${BASE}${p.href}" class="flex-1 bg-background text-black py-2 md:py-2.5 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-100 transition-colors border border-gray-300 text-center">More Info</a>`;
  const quote = p.soon
    ? `<span class="flex-1 text-gray-300 bg-gray-500 py-2 md:py-2.5 text-xs sm:text-sm md:text-base rounded-md font-semibold text-center cursor-not-allowed select-none">Get a Quote</span>`
    : `<a href="#contact" class="flex-1 text-white bg-foreground py-2 md:py-2.5 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:shadow-2xl transition-colors text-center">Get a Quote</a>`;

  return `
    <div class="flex flex-col rounded-lg overflow-hidden shadow-lg bg-background transition-shadow duration-300 hover:shadow-2xl">
      <div class="bg-background h-40 sm:h-44 md:h-48 lg:h-52 flex items-center justify-center overflow-hidden">
        <img src="${p.image}" alt="${p.title}" class="h-full w-full object-cover" />
      </div>
      <div class="bg-background p-4 sm:p-5 md:p-6 flex-grow flex flex-col">
        <h3 class="text-gray-900 font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 line-clamp-2 min-h-[3rem]">${title}</h3>
        <p class="text-gray-600 text-[11px] sm:text-xs md:text-sm mb-4 line-clamp-3 overflow-hidden">
          ${p.desc}
        </p>
        <div class="flex-grow"></div>
        <div class="flex flex-row gap-2 sm:gap-3 mt-auto">
          ${moreInfo}
          ${quote}
        </div>
      </div>
    </div>
  `;
}

document.querySelector('#products').innerHTML = `
<section class="py-8 sm:py-10 md:py-12 lg:py-14 bg-foreground">
  <div class="container mx-auto px-6 sm:px-8 md:px-12 lg:px-20">
    <div class="text-center mb-6 sm:mb-8 md:mb-12">
      <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Products</h2>
      <p class="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
        Explore our innovative products designed to streamline your business operations.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
      ${products.map(cardHtml).join('')}
    </div>
  </div>
</section>
`;
