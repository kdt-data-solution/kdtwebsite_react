import "../styles/style.css";

document.querySelector("#contact").innerHTML = `
<section class="pt-0 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-white">
  <div class="container mx-auto px-4 sm:px-6 md:px-8">

    <div class="text-center mb-12">
      <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Contact Us</h2>
      <p class="text-gray-600 text-sm md:text-m max-w-xl mx-auto">
        We are dedicated to providing efficient and care-driven service.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 xl:gap-24 items-stretch">

      <div class="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
        <h3 class="text-xl sm:text-sm md:text-xl lg:text-3xl font-bold text-gray-900 leading-snug">
          Have Questions?<br/>We're Here to Help
        </h3>
        <p class="text-gray-600 text-sm md:text-sm lg:text-m mt-3 md:mt-4 max-w-md lg:max-w-lg">
          Reach out with your concerns and questions, we are happy to be at your service. Please take note of our business hours to accommodate your questions.
        </p>

        <div class="mt-4 space-y-2 w-full text-left">
          <div class="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-md w-100  px-4 py-4">
            <img src="../assets/images/loc.svg" alt="Address" class="w-4 h-4 flex-shrink-0" />
            <div class="leading-tight">
              <p class="font-semibold text-gray-900 text-xs">Address</p>
              <p class="text-gray-600 text-xs">71 Detroit St., Brgy Pinagkaisahan, Cubao, Quezon City</p>
            </div>
          </div>

          <div class="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-md w-100 px-4 py-4">
            <img src="../assets/images/clock-01-stroke-rounded.svg" alt="Business Hours" class="w-4 h-4 flex-shrink-0" />
            <div class="leading-tight">
              <p class="font-semibold text-gray-900 text-xs">Business Hours</p>
              <p class="text-gray-600 text-xs">Monday - Friday: 9:00 am – 5:00 pm</p>
            </div>
          </div>
        </div>

        <div class="mt-5 md:mt-6 rounded-lg overflow-hidden w-full shadow-sm">
          <iframe
            src="https://maps.google.com/maps?q=71+Detroit+Street,+Pinagkaisahan,+Cubao,+Quezon+City,+Metro+Manila,+Philippines&t=m&z=18&ie=UTF8&iwloc=&output=embed"
            width="100%"
            class="block w-full h-56 h-70 rounded-md"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-300 rounded-lg p-5 sm:p-6 md:p-8 lg:p-10 w-full flex flex-col h-full">
        <h3 class="text-lg sm:text-lg md:text-xl font-bold text-gray-900">Send us a message</h3>
        <p class="text-gray-500 text-xs sm:text-sm md:text-base mt-1">Kindly provide the following info below.</p>

        <form class="mt-5 md:mt-6 space-y-4 md:space-y-5 flex flex-col flex-grow">
          <div>
            <label class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Name</label>
            <input type="text" class="w-full px-3 sm:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Email</label>
            <input type="email" class="w-full px-3 sm:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div class="flex flex-col flex-grow">
            <label class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Message</label>
            <textarea id="contact-message" rows="6" class="w-full flex-grow px-3 sm:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none overflow-y-auto" style="min-height: 140px; max-height: 360px;"></textarea>
          </div>
          <div class="flex justify-end mt-auto">
            <button type="submit" class="bg-black text-white px-5 sm:px-6 md:px-8 py-2 md:py-2.5 text-sm md:text-base rounded-md font-medium hover:bg-gray-800 transition-colors">
              Submit
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</section>
`;

