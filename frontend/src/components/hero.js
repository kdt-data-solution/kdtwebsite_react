import "../styles/style.css";

document.querySelector("#hero").innerHTML = `
<section class="py-6 sm:py-8 md:py-10 lg:py-12 overflow-x-hidden">
  <div class="container mx-auto px-4 sm:px-6 md:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center w-full min-w-0">

      <div class="order-2 md:order-1 text-center md:text-left flex flex-col items-center md:items-start w-full min-w-0">
        <h1 class="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4 md:mb-6 max-w-xs sm:max-w-sm md:max-w-full break-words">
          Your Engineering and Data Solutions Provider
        </h1>
        <p class="text-gray-600 text-sm sm:text-base md:text-sm lg:text-base mb-4 sm:mb-5 md:mb-8 max-w-xs sm:max-w-sm md:max-w-full break-words">
          We are dedicated to providing efficient and cost-effective data analytics, software development, and engineering professional design services.
        </p>
        <div>
          <a href="#" class="inline-block bg-black text-white px-5 sm:px-4 md:px- py-2 sm:py-2.5 text-sm md:text-sm rounded-sm font-medium hover:bg-gray-800 transition-colors duration-300">
            Connect with us
          </a>
        </div>
      </div>

      <div class="order-1 md:order-2 bg-gray-50 rounded-lg p-4 sm:p-2 md:p-8 flex justify-center items-center w-full max-w-[280px] sm:max-w-sm md:max-w-full mx-auto">
        <img src="../assets/images/here-illustration.png" alt="Engineering Illustration" class="w-full h-auto object-contain max-h-44 sm:max-h-56 md:max-h-none"/>
      </div>

    </div>

    <div class="mt-10 sm:mt-12 md:mt-16 flex flex-col md:flex-row items-center gap-6 md:gap-10">
      <div class="flex-shrink-0 max-w-xs text-center md:text-left">
        <h3 class="text-sm sm:text-base md:text-sm font-bold leading-snug text-black">
          Partnerships
        </h3>
      </div>

      <div class="marquee-wrapper relative overflow-hidden flex-grow w-full">
        <div class="marquee-track flex items-center gap-20 sm:gap-20 md:gap-64">
          <a href="#" class="marquee-item flex-shrink-0 hover:opacity-100 transition-opacity">
            <img src="../assets/images/partner-1.png" alt="Partner 1" class="h-10 sm:h-12 md:h-14 w-auto object-contain" onerror="this.src='../assets/images/jpf.png'"/>
          </a>
          <a href="#" class="marquee-item flex-shrink-0 hover:opacity-100 transition-opacity">
            <img src="../assets/images/partner-2.png" alt="Partner 2" class="h-10 sm:h-12 md:h-14 w-auto object-contain" onerror="this.src='../assets/images/mav.png'"/>
          </a>
          </a>

          </a>
        </div>
      </div>
    </div>
  </div>
</section>
<style>
  .marquee-track {
    width: max-content;
    animation: marquee-scroll 20s linear infinite;
  }
  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
</style>
`;

(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  const wrapper = document.querySelector('.marquee-wrapper');
  if (!track || !wrapper) return;

  const originalHTML = track.innerHTML;

  // Keep duplicating until the track is at least 2x the wrapper width,
  // then duplicate ONE more time so the -50% loop point is always offscreen.
  // Pixels per second — keeps the visual speed identical on phone and desktop.
  const SPEED_PX_PER_SEC = 60;

  const ensureWidth = () => {
    track.innerHTML = originalHTML;
    let safety = 0;
    while (track.scrollWidth < wrapper.clientWidth * 2 && safety < 20) {
      track.innerHTML += originalHTML;
      safety++;
    }
    // Duplicate the whole filled track once more for the seamless -50% loop
    track.innerHTML += track.innerHTML;

    // Set animation duration based on the half-width the animation actually travels,
    // so the perceived speed is constant across screen sizes.
    const halfWidth = track.scrollWidth / 2;
    const duration = halfWidth / SPEED_PX_PER_SEC;
    track.style.animationDuration = duration + 's';
  };

  ensureWidth();
  window.addEventListener('resize', ensureWidth);
})();