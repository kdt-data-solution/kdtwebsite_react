import "../styles/style.css";

document.querySelector("#services").innerHTML = `
<section class="py-8 sm:py-10 md:py-12 lg:py-14 bg-gray-50">
    <div class="container mx-auto px-10 sm:px-[60px] md:px-16 lg:px-20">
      <div class="text-center mb-6 sm:mb-8 md:mb-12">
        <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Services Offered</h2>
        <p class="text-gray-600 text-xs sm:text-sm md:text-base max-w-xl mx-auto">
          We provide a wide range of services to help you achieve your business goals.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div class="flex flex-col rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div class="bg-gray-200 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center rounded-t-md sm:rounded-t-lg lg:rounded-t-xl">
            <img src="${import.meta.env.BASE_URL}assets/images/engineering.png" alt="Engineering" class="h-full w-full object-cover"/>
          </div>
          <div class="bg-black p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col rounded-b-md sm:rounded-b-lg lg:rounded-b-xl">
            <h3 class="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Architecture and Engineering Services</h3>
            <p class="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
              Professional design and engineering solutions tailored to your project requirements.
            </p>
            <a href="${import.meta.env.BASE_URL}services.html" class="inline-block w-full bg-white text-black py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-sm lg:text-base rounded font-semibold hover:bg-gray-200 transition-colors text-center">
              More Info
            </a>
          </div>
        </div>

        <div class="flex flex-col rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div class="bg-gray-200 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center rounded-t-md sm:rounded-t-lg lg:rounded-t-xl">
            <img src="${import.meta.env.BASE_URL}assets/images/datascience.png" alt="Data Science" class="h-full w-full object-cover"/>
          </div>
          <div class="bg-black p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col rounded-b-md sm:rounded-b-lg lg:rounded-b-xl">
            <h3 class="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Data Science and Analytics</h3>
            <p class="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
              Transform your data into actionable insights with our advanced analytics solutions.
            </p>
            <a href="${import.meta.env.BASE_URL}services-data.html" class="inline-block w-full bg-white text-black py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-sm lg:text-base rounded font-semibold hover:bg-gray-200 transition-colors text-center">
              More Info
            </a>
          </div>
        </div>

        <div class="flex flex-col rounded-md sm:rounded-lg lg:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <div class="bg-gray-200 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center rounded-t-md sm:rounded-t-lg lg:rounded-t-xl">
            <img src="${import.meta.env.BASE_URL}assets/images/softwaredev.png" alt="Software Development" class="w-full h-full object-cover"/>
          </div>
          <div class="bg-black p-3 sm:p-4 md:p-6 lg:p-8 flex-grow flex flex-col rounded-b-md sm:rounded-b-lg lg:rounded-b-xl">
            <h3 class="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-2 sm:mb-3">Software Development</h3>
            <p class="text-gray-400 text-[11px] sm:text-xs md:text-sm lg:text-base mb-3 sm:mb-4 md:mb-6 flex-grow">
              Custom software and web applications tailored to your specific business needs.
            </p>
            <a href="${import.meta.env.BASE_URL}services-software.html" class="inline-block w-full bg-white text-black py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-sm lg:text-base rounded font-semibold hover:bg-gray-200 transition-colors text-center">
              More Info
            </a>
          </div>
        </div>
      </div>
    </div>
</section>
`;