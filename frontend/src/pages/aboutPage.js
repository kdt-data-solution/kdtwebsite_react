import '../styles/style.css';
import { getSiteSettings } from '../utils/siteSettings.js';

const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '30+', label: 'Succesful Projects' },
  { value: '2+', label: 'Active Partners' },
  { value: '9+', label: 'Team Members' },
];

const img = (name) => `${import.meta.env.BASE_URL}assets/images/${name}`;

const values = [
  {
    title: 'Innovation',
    desc: 'Creating new ideas and improving solutions to meet changing needs.',
    icon: `<img src="${img('ai-innovation-01-stroke-rounded.svg')}" alt="Innovation" class="w-10 h-10" />`,
  },
  {
    title: 'Quality',
    desc: 'Delivering high-standard products and services that meet expectations.',
    icon: `<img src="${img('quality.svg')}" alt="Quality" class="w-10 h-10" />`,
  },
  {
    title: 'Integrity',
    desc: 'Serving with honesty, transparency, and strong moral principles.',
    icon: `<img src="${img('integrity.svg')}" alt="Integrity" class="w-10 h-10" />`,
  },
];

document.querySelector('#about-page').innerHTML = `
  <!-- About Hero -->
  <section class="pt-24 sm:pt-28 pb-12 md:pb-16 bg-background">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <span class="inline-block border border-border rounded-md px-3 py-1 text-xs font-medium text-foreground mb-4">About KDT</span>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
            KDT Network and Data Solution 
          </h1>
          <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
            KDT Network and Data Solution (KDT Solution) is a Philippine-based consultancy firm dedicated to providing efficient and cost-effective data science/analytics, Information technology, and Professional Design Services. Combining these skillsets, we aim to be digital enablers for companies, institutions, and organizations.
          </p>
          <a href="${import.meta.env.BASE_URL}about.html" class="inline-block bg-foreground text-white px-6 py-2.5 rounded-md text-sm font-medium hover:shadow-2xl transition">
            Company Profile
          </a>
        </div>
        <div class="w-full max-w-xl justify-self-end flex items-center">
          <img src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776392434/about-illustration_fj4suq.png" alt="About KDT" class="w-full h-auto" onerror="this.parentElement.classList.add('bg-gray-200');this.style.display='none'" />
        </div>
      </div>
    </div>
  </section>

  <!-- Stats bar -->
  <section class="bg-foreground text-white py-8 md:py-10">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
        ${stats
          .map(
            (s) => `
          <div>
            <p class="text-2xl md:text-3xl font-bold">${s.value}</p>
            <p class="text-xs md:text-sm text-gray-300 mt-1">${s.label}</p>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- We are Committed To -->
  <section class="py-12 md:py-20 bg-background">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="text-center mb-10 md:mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">We are Committed To</h2>
        <p class="text-gray-500 text-xs md:text-sm max-w-md mx-auto">
          Creating intuitive digital solutions that simplify everyday processes
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        ${values
          .map(
            (v) => `
          <div class="bg-background border border-border rounded-lg shadow-xl p-8 text-center flex flex-col items-center transition-all duration-300 ease-in-out hover:bg-muted hover:shadow-lg">
            <div class="text-gray-900 mb-4">${v.icon}</div>
            <h3 class="font-bold text-gray-900 text-base md:text-lg mb-3">${v.title}</h3>
            <p class="text-gray-500 text-xs md:text-sm leading-relaxed max-w-[14rem]">${v.desc}</p>
          </div>
        `,
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="container mx-auto px-4 sm:px-6 md:px-8">
    <hr class="border-gray-300" />
  </div>

  <!-- Our Story -->
  <section class="py-12 md:py-20 bg-background">
    <div class="container mx-auto px-4 sm:px-6 md:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-stretch">

        <div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-5">Our Story</h2>
          <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-5">
            KDT Network and Data Solution (KDT Solution) is a Philippine-based consultancy firm committed to helping organizations transform and improve through technology and design. By combining expertise in data science and analytics, information technology, and professional design services, KDT positions itself as a digital enabler for companies, institutions, and organizations. Their goal is to provide efficient and cost-effective solutions that support better decision-making, streamlined operations, and improved digital presence across various industries.
          </p>
          <p class="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
            KDT offers a wide range of services that cater to modern digital needs. Delivering practical digital solutions that help businesses and organizations adapt to the evolving technological landscape, improve productivity, and achieve long-term growth through innovation.
          </p>

          <div class="space-y-3">
            <div class="flex items-center gap-3 border border-gray-200 rounded-md w-100 px-4 py-3">
              <img src="${img('loc.svg')}" alt="Address" class="w-5 h-5 flex-shrink-0" />
              <div class="leading-tight">
                <p class="text-xs font-semibold text-gray-900">Address</p>
                <p class="text-xs text-gray-600" id="about-address">Loading...</p>
              </div>
            </div>

            <div class="flex items-center gap-3 border border-gray-200 rounded-md w-100 px-4 py-3">
              <img src="${img('clock-01-stroke-rounded.svg')}" alt="Business Hours" class="w-5 h-5 flex-shrink-0" />
              <div class="leading-tight">
                <p class="text-xs font-semibold text-gray-900">Business hours</p>
                <p class="text-xs text-gray-600" id="about-hours">Loading...</p>
              </div>
            </div>

            <div class="flex items-center gap-3 border border-gray-200 rounded-md w-100 px-4 py-3">
              <img src="${img('contact.svg')}" alt="Contact" class="w-5 h-5 flex-shrink-0" />
              <div class="leading-tight">
                <p class="text-xs font-semibold text-gray-900">Contact information</p>
                <p class="text-xs text-gray-600" id="about-contact">Loading...</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full min-h-[400px]">
          <div class="bg-foreground rounded-lg overflow-hidden flex items-center justify-center">
            <img src="${img('kdt-black.png')}" alt="KDT" class="max-h-20 w-auto" />
          </div>
          <div class="bg-background rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
            <img src="${img('kdt-logo.png')}" alt="KDT" class="max-h-20 w-auto" />
          </div>
          <div class="bg-background rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center">
            <img src="${img('kdt-logo.png')}" alt="KDT" class="max-h-20 w-auto" />
          </div>
          <div class="bg-foreground rounded-lg overflow-hidden flex items-center justify-center">
            <img src="${img('kdt-black.png')}" alt="KDT" class="max-h-20 w-auto" />
          </div>
        </div>

      </div>
    </div>
  </section>
`;

getSiteSettings().then(s => {
  const addr = document.getElementById('about-address');
  const hrs = document.getElementById('about-hours');
  const contact = document.getElementById('about-contact');
  if (addr) addr.textContent = s.address || '81 Detroit St., Brgy Pinagkaisahan Cubao, Quezon City';
  if (hrs) hrs.textContent = s.business_hours || 'Monday - Friday (8:00 am - 5:00 pm)';
  if (contact) contact.textContent = `${s.contact_phone || '639+ 000 000 000'} | ${s.contact_email || 'kdy@gmail.com'}`;
});
