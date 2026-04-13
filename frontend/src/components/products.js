import "../styles/style.css";

document.querySelector("#products").innerHTML = `
<section class="pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8 bg-black lg:h-190 md:h-160">
    <div class="container mx-auto px-8 sm:px-[60px] md:px-16 lg:px-20">
      <div class="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">Products</h2>
        <p class="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
          Explore our innovative products designed to streamline your business operations.
        </p>
      </div>

      <div class="relative">
        <button id="products-prev" aria-label="Previous" class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 lg:-translate-x-14 z-20 bg-white text-black rounded-full w-10 h-10 items-center justify-center shadow-lg hover:bg-gray-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button id="products-next" aria-label="Next" class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 lg:translate-x-14 z-20 bg-white text-black rounded-full w-10 h-10 items-center justify-center shadow-lg hover:bg-gray-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>

        <div id="products-carousel" class="flex gap-5 sm:gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2" style="scrollbar-width: none;">

          <div class="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col rounded-lg overflow-hidden shadow-lg bg-white">
            <div class="bg-white h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
              <img src="${import.meta.env.BASE_URL}assets/images/kdt-products.png" alt="Membership Portal" class="h-full w-full object-cover" />
            </div>
            <div class="bg-white p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
              <h3 class="text-gray-900 font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Membership Portal</h3>
              <p class="text-gray-600 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
                Professional engineering tools and solutions tailored to your project requirements.
              </p>
              <div class="flex flex-row gap-2 sm:gap-3 mt-auto">
                <a href="${import.meta.env.BASE_URL}product-membership.html" class="flex-1 bg-white text-black py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-100 transition-colors border border-gray-300 text-center">More Info</a>
                <a href="#contact" class="flex-1 text-white bg-black py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-800 transition-colors text-center">Get a Quote</a>
              </div>
            </div>
          </div>

          <div class="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col rounded-lg overflow-hidden shadow-lg bg-white">
            <div class="bg-white h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
              <img src="${import.meta.env.BASE_URL}assets/images/kdt-products.png" alt="Construct Pro" class="h-full w-full object-cover" />
            </div>
            <div class="bg-white p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
              <h3 class="text-gray-900 font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Construct Pro</h3>
              <p class="text-gray-600 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
                Advanced analytics platform to transform your data into actionable insights.
              </p>
              <div class="flex flex-row gap-2 sm:gap-3 mt-auto">
                <a href="${import.meta.env.BASE_URL}product-construct.html" class="flex-1 bg-white text-black py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-100 transition-colors border border-gray-300 text-center">More Info</a>
                <a href="#contact" class="flex-1 text-white bg-black py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-800 transition-colors text-center">Get a Quote</a>
              </div>
            </div>
          </div>

          <div class="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col rounded-lg overflow-hidden shadow-lg bg-white">
            <div class="bg-white h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
              <img src="${import.meta.env.BASE_URL}assets/images/kdt-products.png" alt="Structural Chatbot" class="h-full w-full object-cover" />
            </div>
            <div class="bg-white p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
              <h3 class="text-gray-900 font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Structural Chatbot</h3>
              <p class="text-gray-600 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
                Comprehensive software solutions to optimize your business workflows.
              </p>
              <div class="flex flex-row gap-2 sm:gap-3 mt-auto">
                <a href="${import.meta.env.BASE_URL}product-chatbot.html" class="flex-1 bg-white text-black py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-100 transition-colors border border-gray-300 text-center">More Info</a>
                <a href="#contact" class="flex-1 text-white bg-black py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-800 transition-colors text-center">Get a Quote</a>
              </div>
            </div>
          </div>

          <div class="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col rounded-lg overflow-hidden shadow-lg bg-white">
            <div class="bg-white h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
              <img src="${import.meta.env.BASE_URL}assets/images/kdt-products.png" alt="Tabs" class="h-full w-full object-cover" />
            </div>
            <div class="bg-white p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
              <h3 class="text-gray-900 font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Tabs <span class="text-xs text-gray-400 font-medium">(Soon)</span></h3>
              <p class="text-gray-600 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
                A membership website portal for membership dues collection, events registrations, missions, and rewards.
              </p>
              <div class="flex flex-row gap-2 sm:gap-3 mt-auto">
                <a href="${import.meta.env.BASE_URL}product-tabs.html" class="flex-1 bg-white text-black py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-100 transition-colors border border-gray-300 text-center">More Info</a>
                <a href="#contact" class="flex-1 text-white bg-black py-2 md:py-3 text-xs sm:text-sm md:text-base rounded-md font-semibold hover:bg-gray-800 transition-colors text-center">Get a Quote</a>
              </div>
            </div>
          </div>

        </div>

        <div id="products-dots" class="flex md:hidden justify-center gap-2 mt-4"></div>
      </div>
    </div>
</section>
<style>
  #products-carousel::-webkit-scrollbar { display: none; }
</style>
`;

(function initProductsCarousel() {
  const carousel = document.getElementById('products-carousel');
  const prev = document.getElementById('products-prev');
  const next = document.getElementById('products-next');
  const dotsContainer = document.getElementById('products-dots');
  if (!carousel || !prev || !next) return;

  const cards = carousel.querySelectorAll('div.snap-start');

  const scrollByCard = (dir) => {
    const card = cards[0];
    if (!card) return;
    const gap = parseFloat(getComputedStyle(carousel).columnGap || '24');
    carousel.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));

  if (dotsContainer) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.className = 'w-2.5 h-2.5 rounded-full bg-white/40 transition-all';
      dot.addEventListener('click', () => {
        const card = cards[i];
        carousel.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });

    const updateDots = () => {
      const card = cards[0];
      if (!card) return;
      const gap = parseFloat(getComputedStyle(carousel).columnGap || '24');
      const index = Math.round(carousel.scrollLeft / (card.offsetWidth + gap));
      dotsContainer.querySelectorAll('button').forEach((d, i) => {
        d.className = 'rounded-full transition-all ' + (i === index ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40');
      });
    };

    carousel.addEventListener('scroll', updateDots);
    updateDots();
  }
})();
