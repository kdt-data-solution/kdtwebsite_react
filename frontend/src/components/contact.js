import "../styles/style.css";
import { getSiteSettings } from '../utils/siteSettings.js';
import { toastSuccess, toastError } from '../utils/toast.js';

const BASE = import.meta.env.BASE_URL;

function renderContactInfo(s) {
  const address = s.address || '81 Detroit St., Brgy Pinagkaisahan Cubao, Quezon City';
  const hours = s.business_hours || 'Monday - Friday (8:00 am - 5:00 pm)';
  const el = document.getElementById('contact-address');
  const el2 = document.getElementById('contact-hours');
  if (el) el.textContent = address;
  if (el2) el2.textContent = hours;
}

document.querySelector("#contact").innerHTML = `
<section class="pt-0 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-background">
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
        <p class="text-gray-600 text-sm md:text-sm lg:text-base mt-3 md:mt-4 max-w-md lg:max-w-lg">
          Reach out with your concerns and questions, we are happy to be at your service. Please take note of our business hours to accommodate your questions.
        </p>

        <div class="mt-4 space-y-2 w-100 text-left">
          <div class="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-md w-full px-4 py-4">
            <img src="${BASE}assets/images/loc.svg" alt="Address" class="w-4 h-4 flex-shrink-0" />
            <div class="leading-tight">
              <p class="font-semibold text-gray-900 text-xs">Address</p>
              <p class="text-gray-600 text-xs" id="contact-address">Loading...</p>
            </div>
          </div>

          <div class="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-md w-full px-4 py-4">
            <img src="${BASE}assets/images/clock-01-stroke-rounded.svg" alt="Business Hours" class="w-4 h-4 flex-shrink-0" />
            <div class="leading-tight">
              <p class="font-semibold text-gray-900 text-xs">Business Hours</p>
              <p class="text-gray-600 text-xs" id="contact-hours">Loading...</p>
            </div>
          </div>
        </div>

        <div class="mt-5 md:mt-6 rounded-lg overflow-hidden w-full shadow-sm">
          <iframe
            src="https://maps.google.com/maps?q=71+Detroit+Street,+Pinagkaisahan,+Cubao,+Quezon+City,+Metro+Manila,+Philippines&t=m&z=18&ie=UTF8&iwloc=&output=embed"
            width="100%"
            class="block w-full h-56 rounded-md"
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

        <form id="contact-form" class="mt-5 md:mt-6 space-y-4 md:space-y-5 flex flex-col flex-grow">
          <div>
            <label class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Name</label>
            <input name="name" type="text" required class="w-full px-3 sm:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div>
            <label class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" required class="w-full px-3 sm:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-gray-300" />
          </div>
          <div class="flex flex-col flex-grow">
            <label class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Message</label>
            <textarea id="contact-message" name="message" rows="6" required class="w-full flex-grow px-3 sm:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-200 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none overflow-y-auto" style="min-height: 140px; max-height: 360px;"></textarea>
          </div>
          <p id="contact-status" class="text-xs sm:text-sm hidden"></p>
          <div class="flex justify-end mt-auto">
            <button id="contact-submit" type="submit" class="bg-foreground text-white px-5 sm:px-6 md:px-8 py-2 md:py-2.5 text-sm md:text-base rounded-md font-medium hover:shadow-2xl transition-colors disabled:opacity-60">
              Submit
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</section>
`;

getSiteSettings().then(renderContactInfo);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://www.kdtdatasolution.com';

document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const status = document.getElementById('contact-status');
  const submit = document.getElementById('contact-submit');
  const data = Object.fromEntries(new FormData(form).entries());

  submit.disabled = true;
  status.classList.remove('hidden', 'text-red-600', 'text-green-600');
  status.textContent = 'Sending...';

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Failed to send message');
    status.classList.add('hidden');
    toastSuccess('Message sent. Thank you!');
    form.reset();
  } catch (err) {
    status.classList.add('hidden');
    toastError(err.message);
  } finally {
    submit.disabled = false;
  }
});
