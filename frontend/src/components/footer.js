import "../styles/style.css";

document.querySelector("#footer").innerHTML = `
<footer class="bg-black text-white py-8 sm:py-10 md:py-12 px-6 sm:px-8 md:px-10 lg:px-16 font-sans">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-8">
      
      <div class="md:col-span-3 lg:col-span-2">
        <div class="mb-3">
          <img class="h-8 sm:h-10 md:h-12 w-auto" src="../assets/images/kdt-black.png" alt="kdt-black-logo">
        </div>
        <div class="flex space-x-3">
          <a href="#" aria-label="Facebook" class="border border-white/30 p-2 rounded-lg hover:bg-white/10 transition">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          <a href="#" aria-label="LinkedIn" class="border border-white/30 p-2 rounded-lg hover:bg-white/10 transition">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="#" aria-label="YouTube" class="border border-white/30 p-2 rounded-lg hover:bg-white/10 transition">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>

      <div>
        <h3 class="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Services</h3>
        <ul class="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
          <li><a href="#" class="hover:text-white transition">Architecture and Engineering</a></li>
          <li><a href="#" class="hover:text-white transition">Data Science and Analytics</a></li>
          <li><a href="#" class="hover:text-white transition">Software Development</a></li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Partners</h3>
        <ul class="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
          <li><a href="#" class="hover:text-white transition">JPF Design</a></li>
          <li><a href="#" class="hover:text-white transition">MSI</a></li>
        </ul>
      </div>

      <div>
        <h3 class="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
        <ul class="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
          <li><a href="#" class="hover:text-white transition">Privacy Notice</a></li>
          <li><a href="#" class="hover:text-white transition">Cookie Policy</a></li>
        </ul>
      </div>

      <div class="flex flex-col items-start lg:items-center">
        <h3 class="font-bold mb-3 sm:mb-4 text-sm sm:text-base lg:text-center">Data Protection</h3>
        <div class="w-16 sm:w-20 md:w-24">
          <img src="../assets/images/kdt-seal.png" alt="DPO/DPS Registered" class="w-full h-auto" />
        </div>
      </div>
    </div>

    <div class="border-t border-white/10 pt-5 sm:pt-6 text-center md:text-left">
      <p class="text-xs text-gray-400">
        © 2025 KDT Network and Data Solution. All rights reserved.
      </p>
    </div>
  </div>
</footer>


`;