import '../styles/style.css'

document.querySelector("#navbar").innerHTML = `
<nav class="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      
      <div class="flex-shrink-0">
        <img class="h-8 md:h-10 w-auto" src="../assets/images/kdt-logo.png" alt="KDT Logo">
      </div>

      <!-- Mobile Menu Button -->
      <button id="mobile-menu-button" class="md:hidden text-gray-900 hover:text-gray-600 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-1">
        <a href="/" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-black after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Home</a>
        <a href="/services.html" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-black after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Services</a>
        <a href="#products" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-black after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Products</a>
        <a href="#portfolio" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-black after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Portfolio</a>
        <a href="#media" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-black after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">Media</a>
        <a href="#about" class="relative text-gray-900 px-3 py-2 text-sm font-medium after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-0.5 after:bg-black after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out">About KDT</a>
        <button class="bg-black text-white px-4 md:px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors ml-4">
          Contact us
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div id="mobile-menu" class="hidden md:hidden pb-4">
      <div class="flex flex-col space-y-2">
        <a href="/" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Home</a>
        <a href="/services.html" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Services</a>
        <a href="#products" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Products</a>
        <a href="#portfolio" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Portfolio</a>
        <a href="#media" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Media</a>
        <a href="#about" class="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">About KDT</a>

        <button class="bg-black text-white p-0 rounded-sm text-sm font-medium hover:bg-gray-800 transition-colors w-10 text-center">
          Contact us
        </button>
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