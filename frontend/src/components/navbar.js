import '../styles/style.css'

document.querySelector('#navbar').innerHTML = `
<nav class="bg-background border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      
      <div class="flex-shrink-0">
        <img class="h-8 md:h-10 w-auto" src="${import.meta.env.BASE_URL}assets/images/kdt-logo.png" alt="KDT Logo">
      </div>

      <!-- Mobile Menu Button -->
      <button id="mobile-menu-button" class="md:hidden text-gray-900 hover:text-gray-600 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-1">
        <a href="${import.meta.env.BASE_URL}" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-foreground after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Home</a>
        <div class="relative group">
          <button type="button" class="relative text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center gap-1 after:content-[''] after:absolute after:left-3 after:right-6 after:bottom-1 after:h-0.5 after:bg-foreground after:origin-left after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">
            Services
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
            <div class="bg-background border border-gray-200 rounded-md shadow-lg py-2 w-64">
              <a href="${import.meta.env.BASE_URL}services.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">Architecture and Engineering Services</a>
              <a href="${import.meta.env.BASE_URL}services-data.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">Data Science and Analytics</a>
              <a href="${import.meta.env.BASE_URL}services-software.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">Software Development</a>
              <a href="${import.meta.env.BASE_URL}services-bootcamp.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">Bootcamp</a>
            </div>
          </div>
        </div>
        <div class="relative group">
          <button type="button" class="relative text-gray-900 px-3 py-2 text-sm font-medium inline-flex items-center gap-1 after:content-[''] after:absolute after:left-3 after:right-6 after:bottom-1 after:h-0.5 after:bg-foreground after:origin-left after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">
            Products
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
            <div class="bg-background border border-gray-200 rounded-md shadow-lg py-2 w-56">
              <a href="${import.meta.env.BASE_URL}product-membership.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">Membership Portal</a>
              <a href="${import.meta.env.BASE_URL}product-construct.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">Property Finder</a>
              <a href="${import.meta.env.BASE_URL}product-chatbot.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">AI Chatbot</a>
              <a href="${import.meta.env.BASE_URL}product-wms.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">WMS</a>
              <a href="${import.meta.env.BASE_URL}product-cardko.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black">CardKo</a>
              <span class="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed select-none">TABS <span class="text-[10px] uppercase">(soon)</span></span>
            </div>
          </div>
        </div>
        <a href="${import.meta.env.BASE_URL}services-bootcamp.html" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-foreground after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Bootcamp</a>
        <a href="${import.meta.env.BASE_URL}portfolio.html" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-foreground after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Portfolio</a>
        <a href="${import.meta.env.BASE_URL}media.html" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-foreground after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Media</a>
        <a href="${import.meta.env.BASE_URL}about.html" class="relative whitespace-nowrap text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-foreground after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">About KDT</a>
        <a href="${import.meta.env.BASE_URL}#contact" class="bg-foreground text-white px-4 md:px-6 py-2 rounded-md text-sm font-medium hover:shadow-2xl whitespace-nowrap transition-colors ml-4 text-center">
          Contact us
        </a>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div id="mobile-menu" class="hidden md:hidden pb-4">
      <div class="flex flex-col space-y-2">
        <a href="${import.meta.env.BASE_URL}" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Home</a>
        <div class="px-3 py-2 text-sm font-medium text-gray-900">Services</div>
        <a href="${import.meta.env.BASE_URL}services.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">Architecture and Engineering Services</a>
        <a href="${import.meta.env.BASE_URL}services-data.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">Data Science and Analytics</a>
        <a href="${import.meta.env.BASE_URL}services-software.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">Software Development</a>
        <a href="${import.meta.env.BASE_URL}services-bootcamp.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">Bootcamp</a>
        <div class="px-3 py-2 text-sm font-medium text-gray-900">Products</div>
        <a href="${import.meta.env.BASE_URL}product-membership.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">Membership Portal</a>
        <a href="${import.meta.env.BASE_URL}product-construct.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">Property Finder</a>
        <a href="${import.meta.env.BASE_URL}product-chatbot.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">AI Chatbot</a>
        <a href="${import.meta.env.BASE_URL}product-wms.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">WMS</a>
        <a href="${import.meta.env.BASE_URL}product-cardko.html" class="text-gray-700 hover:bg-gray-100 pl-6 pr-3 py-2 rounded-md text-sm">CardKo</a>
        <span class="text-gray-400 cursor-not-allowed select-none pl-6 pr-3 py-2 rounded-md text-sm">TABS (soon)</span>
        <a href="${import.meta.env.BASE_URL}services-bootcamp.html" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Bootcamp</a>
        <a href="${import.meta.env.BASE_URL}portfolio.html" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Portfolio</a>
        <a href="${import.meta.env.BASE_URL}media.html" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Media</a>
        <a href="${import.meta.env.BASE_URL}about.html" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ">About KDT</a>

        <a href="${import.meta.env.BASE_URL}#contact" class=" bg-foreground text-white py-2 rounded-md text-sm font-medium hover:shadow-2xl transition-colors whitespace-nowrap w-full text-center mt-2">
          Contact us
        </a>
      </div>
    </div>
  </div>
</nav>
`;

// Mobile menu toggle
document.getElementById('mobile-menu-button')?.addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  menu?.classList.toggle('hidden');
});

// Active nav link underline
(function setActiveNavLink() {
  const links = document.querySelectorAll('#navbar nav a[href]');
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    const linkPath = href.replace(/\/$/, '') || '/';
    if (linkPath === currentPath) {
      link.classList.add('after:scale-x-100');
      link.classList.remove('after:scale-x-0');
    }
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(l => {
        l.classList.remove('after:scale-x-100');
        l.classList.add('after:scale-x-0');
      });
      link.classList.add('after:scale-x-100');
      link.classList.remove('after:scale-x-0');
    });
  });
})();