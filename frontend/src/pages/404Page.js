import '../styles/style.css';

const BASE = import.meta.env.BASE_URL;

document.querySelector('#not-found-page').innerHTML = `
  <main class="flex-1 flex items-center justify-center px-4 py-20 mt-20">
    <div class="flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-3xl">
      <div class="flex-shrink-0">
        <img src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776393286/404_ct4tbo.png" alt="Page not found" class="w-48 sm:w-56 md:w-64 h-auto" />
      </div>
      <div class="text-center md:text-left">
        <h1 class="text-7xl sm:text-8xl md:text-9xl font-black text-gray-900 leading-none">404</h1>
        <p class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mt-2">Ooops! Page not found</p>
        <p class="text-sm text-gray-500 mt-2 max-w-sm">
          It seems that the page you are looking for doesn't exist. Let's get you back on track.
        </p>
        <a href="${BASE}" class="inline-block mt-6 bg-foreground text-white px-8 py-3 rounded-md text-sm font-semibold hover:shadow-2xl transition w-full md:w-auto text-center">
          Return to homepage
        </a>
      </div>
    </div>
  </main>
`;
