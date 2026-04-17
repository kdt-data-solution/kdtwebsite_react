import "../styles/style.css";

document.querySelector('#hero').innerHTML = `
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
          <a href="#contact" class="inline-block bg-foreground text-white px-5 sm:px-4 md:px-5 py-2 sm:py-2.5 text-sm md:text-sm rounded-sm font-medium hover:shadow-2xl transition-colors duration-300">
            Connect with us
          </a>
        </div>
      </div>

      <div class="order-1 md:order-2 bg-gray-50 rounded-lg p-4 sm:p-2 md:p-8 flex justify-center items-center w-full max-w-[280px] sm:max-w-sm md:max-w-full mx-auto">
        <img src="https://res.cloudinary.com/dpf1qvyzt/image/upload/v1776326600/hero-illustration_pka0eb.png" alt="Engineering Illustration" class="w-full h-auto object-contain max-h-44 sm:max-h-56 md:max-h-none"/>
      </div>

    </div>

  </div>
</section>
`;