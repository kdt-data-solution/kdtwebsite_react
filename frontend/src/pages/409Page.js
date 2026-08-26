import '../styles/style.css';

const BASE = import.meta.env.BASE_URL;

document.querySelector('#error-page').innerHTML = `
  <main class="bg-[#0b0b0b] text-white">
    <div class="kdt-container px-0 grid grid-cols-1 lg:grid-cols-2 min-h-[620px]">
      <div class="kdt-hero-copy flex flex-col justify-center items-start">
        <p class="kdt-eyebrow text-gray-400 mb-4">Error 409</p>
        <h1 class="kdt-display text-white">Conflict detected</h1>
        <p class="text-base sm:text-lg text-gray-300 mt-6 max-w-md">
          You may have entered something that’s already in use. Please check and try again.
        </p>
        <a href="${BASE}" class="kdt-btn kdt-btn-light mt-8">
          Return to homepage <span class="kdt-arrow-icon" aria-hidden="true"></span>
        </a>
      </div>
      <div class="bg-[#ededeb] flex items-center justify-center p-10">
        <img src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776393286/404_ct4tbo.png" alt="Conflict" class="w-56 sm:w-72 h-auto" onerror="this.style.display='none'" />
      </div>
    </div>
  </main>
`;
