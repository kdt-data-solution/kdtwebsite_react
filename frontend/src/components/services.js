import "../styles/style.css";

const services = [
  {
    title: 'Architecture and Engineering Services',
    desc: 'Professional design and engineering solutions tailored to your project requirements.',
    image: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317603/eng-card_b99f6c.webp',
    href: 'services.html',
  },
  {
    title: 'Data Science and Analytics',
    desc: 'Transform your data into actionable insights with our advanced analytics solutions.',
    image: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317603/dsa-card_bnnv0x.png',
    href: 'services-data.html',
  },
  {
    title: 'Software Development',
    desc: 'Custom software and web applications tailored to your specific business needs.',
    image: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317604/sd-card_jwzlef.png',
    href: 'services-software.html',
  },
  {
    title: 'Bootcamp',
    desc: 'Intensive training programs designed to upskill professionals in technology and engineering.',
    image: 'https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776347679/bot-card_zgmr5w.png',
    href: 'services-bootcamp.html',
  },
];

const BASE = import.meta.env.BASE_URL;

const cardsHtml = services.map(s => `
  <div class="flex flex-col rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl">
    <div class="bg-gray-200 h-40 sm:h-48 md:h-52 lg:h-56 flex items-center justify-center overflow-hidden">
      <img src="${s.image}" alt="${s.title}" class="h-full w-full object-cover" />
    </div>
    <div class="bg-foreground p-4 sm:p-5 md:p-6 lg:p-7 flex-grow flex flex-col">
      <h3 class="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">${s.title}</h3>
      <p class="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-4 md:mb-6 flex-grow">
        ${s.desc}
      </p>
      <a href="${BASE}${s.href}" class="inline-block w-full bg-background text-black py-2 md:py-2.5 text-xs sm:text-sm md:text-base rounded font-semibold hover:bg-gray-200 transition-colors text-center">
        More Info
      </a>
    </div>
  </div>
`).join('');

document.querySelector('#services').innerHTML = `
<section class="py-8 sm:py-10 md:py-12 lg:py-14 bg-gray-50">
  <div class="container mx-auto px-6 sm:px-8 md:px-12 lg:px-20">
    <div class="text-center mb-6 sm:mb-8 md:mb-12">
      <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Services Offered</h2>
      <p class="text-gray-600 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
        We provide a wide range of services to help you achieve your business goals.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
      ${cardsHtml}
    </div>
  </div>
</section>
`;
