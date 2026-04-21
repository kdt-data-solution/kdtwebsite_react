import "../styles/style.css";
import { getSiteSettings } from '../utils/siteSettings.js';

const BASE = import.meta.env.BASE_URL;

// Render with defaults first, then update with API data
document.querySelector("#footer").innerHTML = renderFooter({});
getSiteSettings().then(s => {
  document.querySelector("#footer").innerHTML = renderFooter(s);
});

function renderFooter(s) {
  const company = s.company_name || 'KDT Network and Data Solution';
  const fb = s.facebook_url || '#';
  const li = s.linkedin_url || '#';
  const yt = s.youtube_url || '#';
  const year = new Date().getFullYear();

  return `
<footer class="bg-foreground text-white py-8 sm:py-10 md:py-12 px-6 sm:px-8 md:px-10 lg:px-16 font-sans">
  <div class="container mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-8">

      <div>
        <div class="mb-3">
          <img class="h-8 sm:h-10 md:h-12 w-auto" src="${BASE}assets/images/kdt-black.png" alt="kdt-black-logo">
        </div>
        <div class="flex space-x-3">
          <a href="${fb}" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class=" p-2 rounded-lg hover:bg-white/10 transition">
            <img src="${BASE}assets/images/facebook.svg" alt="Facebook" class="w-7 h-7" />
          </a>
          <a href="${li}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="p-2 rounded-lg hover:bg-white/10 transition">
            <img src="${BASE}assets/images/linkedin.svg" alt="LinkedIn" class="w-7 h-7" />
          </a>
          <a href="${yt}" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class=" p-2 rounded-lg hover:bg-white/10 transition">
            <img src="${BASE}assets/images/youtube.svg" alt="YouTube" class="w-7 h-7" />
          </a>
        </div>
      </div>

      <div>
        <h3 class="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Services</h3>
        <ul class="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
          <li><a href="${BASE}services.html" class="hover:text-white transition">Architecture and Engineering</a></li>
          <li><a href="${BASE}services-data.html" class="hover:text-white transition">Data Science and Analytics</a></li>
          <li><a href="${BASE}services-software.html" class="hover:text-white transition">Software Development</a></li>
          <li><a href="${BASE}services-bootcamp.html" class="hover:text-white transition">Bootcamp</a></a></li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
        <ul class="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
          <li><a href="${BASE}privacy.html" class="hover:text-white transition">Privacy Notice</a></li>
          <li><a href="${BASE}cookie.html" class="hover:text-white transition">Cookie Policy</a></li>
        </ul>
      </div>

      <div class="flex flex-col items-start lg:items-center">
        <h3 class="font-bold mb-3 sm:mb-4 text-sm sm:text-base lg:text-center">Data Protection</h3>
        <div class="w-16 sm:w-20 md:w-24">
          <img src="${BASE}assets/images/kdt-seal.png" alt="DPO/DPS Registered" class="w-full h-auto" />
        </div>
      </div>
    </div>

    <div class="border-t border-white/10 pt-5 sm:pt-6 text-center md:text-left">
      <p class="text-xs text-gray-400">
        &copy; ${year} ${company}. All rights reserved.
      </p>
    </div>
  </div>
</footer>
`;
}
