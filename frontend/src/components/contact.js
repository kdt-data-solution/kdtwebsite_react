import "../styles/style.css";
import { getSiteSettings } from '../utils/siteSettings.js';
import { toastSuccess, toastError } from '../utils/toast.js';

const BASE = import.meta.env.BASE_URL;

function renderContactInfo(s) {
  const address = s.address || '81 Detroit St., Brgy Pinagkaisahan Cubao, Quezon City';
  const hours = s.business_hours || 'Monday - Friday (8:00 am - 5:00 pm)';
  const phone = !s.contact_phone || s.contact_phone === '639+ 000 000 000'
    ? '84635344'
    : s.contact_phone;
  const email = !s.contact_email || s.contact_email === 'kdy@gmail.com'
    ? 'kristoffer.tabong@kdtdatasolution.com'
    : s.contact_email;
  const el = document.getElementById('contact-address');
  const el2 = document.getElementById('contact-hours');
  const phoneLink = document.getElementById('contact-phone');
  const emailLink = document.getElementById('contact-email');
  if (el) el.textContent = address;
  if (el2) el2.textContent = hours;
  if (phoneLink) {
    phoneLink.textContent = phone;
    phoneLink.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
  }
  if (emailLink) {
    emailLink.textContent = email;
    emailLink.href = `mailto:${email}`;
  }
}

document.querySelector("#contact").innerHTML = `
<section class="kdt-section bg-[#f7f7f5]" aria-labelledby="contact-heading">
  <div class="kdt-container">

    <div class="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5 lg:gap-16 items-end mb-8 md:mb-10">
      <div>
        <p class="kdt-eyebrow text-gray-500 mb-3">Contact KDT</p>
        <h2 id="contact-heading" class="kdt-section-title">Let’s solve the right problem.</h2>
      </div>
      <p class="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl lg:justify-self-end">
        Tell us what you are building, improving, or trying to understand. Our team will respond with a practical next step.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/15 border border-black/15 items-stretch">

      <div class="w-full bg-[#ededeb] p-6 sm:p-8 lg:p-10 flex flex-col items-start text-left">
        <h3 class="text-2xl sm:text-3xl font-semibold text-gray-950 leading-tight">
          Have Questions?<br/>We're Here to Help
        </h3>
        <p class="text-gray-600 text-sm sm:text-base leading-relaxed mt-4 max-w-lg">
          Reach out with your concerns and questions, we are happy to be at your service. Please take note of our business hours to accommodate your questions.
        </p>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/10 border border-black/10 w-full text-left">
          <div class="flex items-start gap-3 bg-white w-full p-4 sm:p-5">
            <img src="${BASE}assets/images/loc.svg" alt="Address" class="w-4 h-4 flex-shrink-0" />
            <div class="leading-tight min-w-0 flex-1">
              <p class="font-semibold text-gray-900 text-xs">Address</p>
              <p class="text-gray-600 text-[11px] sm:text-xs break-words" id="contact-address">Loading...</p>
            </div>
          </div>

          <div class="flex items-start gap-3 bg-white w-full p-4 sm:p-5">
            <img src="${BASE}assets/images/clock-01-stroke-rounded.svg" alt="Business Hours" class="w-4 h-4 flex-shrink-0" />
            <div class="leading-tight min-w-0 flex-1">
              <p class="font-semibold text-gray-900 text-xs">Business Hours</p>
              <p class="text-gray-600 text-[11px] sm:text-xs break-words" id="contact-hours">Loading...</p>
            </div>
          </div>

          <div class="flex items-start gap-3 bg-white w-full p-4 sm:p-5">
            <svg class="w-4 h-4 flex-shrink-0 text-gray-900" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 6 7.06 5.294a2 2 0 0 0 2.38 0L20.25 6" />
            </svg>
            <div class="leading-tight min-w-0 flex-1">
              <p class="font-semibold text-gray-900 text-xs">Email</p>
              <a id="contact-email" href="mailto:kristoffer.tabong@kdtdatasolution.com" class="text-gray-600 text-[11px] sm:text-xs break-all hover:text-black hover:underline">kristoffer.tabong@kdtdatasolution.com</a>
            </div>
          </div>

          <div class="flex items-start gap-3 bg-white w-full p-4 sm:p-5">
            <svg class="w-4 h-4 flex-shrink-0 text-gray-900" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 0 0-1.173.417l-.97 1.293a1.125 1.125 0 0 1-1.21.38 12.035 12.035 0 0 1-7.143-7.143 1.125 1.125 0 0 1 .38-1.21l1.293-.97c.365-.274.53-.74.417-1.173L6.963 3.102A1.125 1.125 0 0 0 5.872 2.25H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            <div class="leading-tight min-w-0 flex-1">
              <p class="font-semibold text-gray-900 text-xs">Telephone</p>
              <a id="contact-phone" href="tel:84635344" class="text-gray-600 text-[11px] sm:text-xs hover:text-black hover:underline">84635344</a>
            </div>
          </div>
        </div>

        <div class="mt-6 overflow-hidden w-full border border-black/15">
          <iframe
            title="KDT Network and Data Solution location map"
            src="https://maps.google.com/maps?q=71+Detroit+Street,+Pinagkaisahan,+Cubao,+Quezon+City,+Metro+Manila,+Philippines&t=m&z=18&ie=UTF8&iwloc=&output=embed"
            width="100%"
            class="block w-full h-64"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>

      <div class="bg-white p-6 sm:p-8 lg:p-10 w-full flex flex-col h-full">
        <p class="kdt-eyebrow text-gray-500 mb-3">Project inquiry</p>
        <h3 class="text-2xl sm:text-3xl font-semibold text-gray-950">Send us a message</h3>
        <p class="text-gray-600 text-sm sm:text-base mt-2">Kindly provide the following information below.</p>

        <form id="contact-form" class="mt-5 md:mt-6 space-y-4 md:space-y-5 flex flex-col flex-grow">
          <div>
            <label for="contact-name" class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Name</label>
            <input id="contact-name" name="name" type="text" required autocomplete="name" class="w-full px-4 py-3 text-sm md:text-base border border-gray-400 rounded-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
          </div>
          <div>
            <label for="contact-form-email" class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Email</label>
            <input id="contact-form-email" name="email" type="email" required autocomplete="email" class="w-full px-4 py-3 text-sm md:text-base border border-gray-400 rounded-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
          </div>
          <div class="flex flex-col flex-grow">
            <label for="contact-message" class="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1">Message</label>
            <textarea id="contact-message" name="message" rows="6" required class="w-full flex-grow px-4 py-3 text-sm md:text-base border border-gray-400 rounded-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 resize-y overflow-y-auto" style="min-height: 160px; max-height: 360px;"></textarea>
          </div>
          <p id="contact-status" class="text-xs sm:text-sm hidden" role="status" aria-live="polite"></p>
          <div class="flex justify-end mt-auto">
            <button id="contact-submit" type="submit" class="kdt-btn kdt-btn-dark disabled:opacity-60 disabled:cursor-not-allowed">
              Submit inquiry <span class="kdt-arrow-icon" aria-hidden="true"></span>
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
