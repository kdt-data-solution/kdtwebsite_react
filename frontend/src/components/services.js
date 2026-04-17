import "../styles/style.css";

document.querySelector('#services').innerHTML = `
<section class="py-8 sm:py-10 md:py-12 lg:py-14 bg-gray-50">
    <div class="container mx-auto px-8 sm:px-[60px] md:px-16 lg:px-20">
      <div class="text-center mb-6 sm:mb-8 md:mb-12">
        <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Services Offered</h2>
        <p class="text-gray-600 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
          We provide a wide range of services to help you achieve your business goals.
        </p>
      </div>

      <div class="relative">
        <button id="services-prev" aria-label="Previous" class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 lg:-translate-x-14 z-20 bg-foreground text-white rounded-full w-10 h-10 items-center justify-center shadow-lg hover:shadow-2xl transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button id="services-next" aria-label="Next" class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 lg:translate-x-14 z-20 bg-foreground text-white rounded-full w-10 h-10 items-center justify-center shadow-lg hover:shadow-2xl transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>

        <div id="services-carousel" class="flex gap-5 sm:gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2" style="scrollbar-width: none;">

          <div class="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden shadow-lg">
            <div class="bg-gray-200 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
              <img src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317603/eng-card_b99f6c.webp" alt="Engineering" class="h-full w-full object-cover"/>
            </div>
            <div class="bg-foreground p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
              <h3 class="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Architecture and Engineering Services</h3>
              <p class="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
                Professional design and engineering solutions tailored to your project requirements.
              </p>
              <a href="${import.meta.env.BASE_URL}services.html" class="inline-block w-full bg-background text-black py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-sm lg:text-base rounded font-semibold hover:bg-gray-200 transition-colors text-center">
                More Info
              </a>
            </div>
          </div>

          <div class="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden shadow-lg">
            <div class="bg-gray-200 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
              <img src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317603/dsa-card_bnnv0x.png" alt="Data Science" class="h-full w-full object-cover"/>
            </div>
            <div class="bg-foreground p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
              <h3 class="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Data Science and Analytics</h3>
              <p class="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
                Transform your data into actionable insights with our advanced analytics solutions.
              </p>
              <a href="${import.meta.env.BASE_URL}services-data.html" class="inline-block w-full bg-background text-black py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-sm lg:text-base rounded font-semibold hover:bg-gray-200 transition-colors text-center">
                More Info
              </a>
            </div>
          </div>

          <div class="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden shadow-lg">
            <div class="bg-gray-200 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
              <img src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776317604/sd-card_jwzlef.png" alt="Software Development" class="w-full h-full object-cover"/>
            </div>
            <div class="bg-foreground p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
              <h3 class="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Software Development</h3>
              <p class="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
                Custom software and web applications tailored to your specific business needs.
              </p>
              <a href="${import.meta.env.BASE_URL}services-software.html" class="inline-block w-full bg-background text-black py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-sm lg:text-base rounded font-semibold hover:bg-gray-200 transition-colors text-center">
                More Info
              </a>
            </div>
          </div>

          <div class="snap-start flex-shrink-0 w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden shadow-lg">
            <div class="bg-gray-200 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
              <img src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776347679/bot-card_zgmr5w.png" alt="Bootcamp" class="w-full h-full object-cover"/>
            </div>
            <div class="bg-foreground p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col">
              <h3 class="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Bootcamp</h3>
              <p class="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
                Intensive training programs designed to upskill professionals in technology and engineering.
              </p>
              <a href="${import.meta.env.BASE_URL}services-bootcamp.html" class="inline-block w-full bg-background text-black py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-sm lg:text-base rounded font-semibold hover:bg-gray-200 transition-colors text-center">
                More Info
              </a>
            </div>
          </div>

        </div>

        <div id="services-dots" class="flex md:hidden justify-center gap-2 mt-4"></div>
      </div>
    </div>
</section>
<style>
  #services-carousel::-webkit-scrollbar { display: none; }
</style>
`;

(function initServicesCarousel() {
  const carousel = document.getElementById('services-carousel');
  const prev = document.getElementById('services-prev');
  const next = document.getElementById('services-next');
  const dotsContainer = document.getElementById('services-dots');
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
      dot.className = 'w-2.5 h-2.5 rounded-full bg-foreground/30 transition-all';
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
        d.className = 'rounded-full transition-all ' + (i === index ? 'w-6 h-2.5 bg-foreground' : 'w-2.5 h-2.5 bg-foreground/30');
      });
    };

    carousel.addEventListener('scroll', updateDots);
    updateDots();
  }
})();
