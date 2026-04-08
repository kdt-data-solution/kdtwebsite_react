import "../styles/style.css";
import { Dropdown } from './Dropdown.js';

const faqData = [
  {
    question: "What services do you offer?",
    answer: "We provide data analytics, software development, and engineering professional design services tailored to your business needs."
  },
  {
    question: "How can I get started?",
    answer: "Simply contact us through our website or call our team. We'll schedule a consultation to discuss your project requirements."
  },
  {
    question: "What is your pricing model?",
    answer: "Our pricing is project-based and depends on the scope and complexity. We provide detailed quotes after understanding your needs."
  },
  {
    question: "Do you offer support after project completion?",
    answer: "Yes, we provide ongoing support and maintenance services to ensure your solution continues to perform optimally."
  }
];

const dropdownsHTML = faqData.map(item => new Dropdown(item.question, item.answer).render()).join('');

document.querySelector("#faq").innerHTML = `
<section class="py-6 sm:py-8 md:py-10">
  <div class="w-full px-4 sm:px-6 md:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-15 items-start mt-3 sm:mt-5">

      <div class="text-center md:text-left flex flex-col items-center md:items-start">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          Frequently Asked Questions
        </h1>
        <p class="text-gray-600 text-xs sm:text-sm md:text-base lg:text-base mt-2 sm:mt-3 md:mt-5">
          Get quick answers to the most common questions about using our system and services. We've organized everything here to make your experience simple, clear, and hassle-free.
        </p>
        <div class="mt-3 sm:mt-4 md:mt-5">
          <a href="#" class="inline-block bg-black text-white px-4 sm:px-5 md:px-8 py-1.5 sm:py-2 md:py-3 text-[11px] sm:text-xs md:text-base rounded-md font-medium hover:bg-gray-800 transition-colors duration-300">
            Chat with us
          </a>
        </div>
      </div>

      <div class="rounded-lg overflow-hidden min-h-[260px] sm:min-h-[325px] w-full max-w-md md:max-w-m lg:max-w-lg xl:max-w-xl mx-auto md:ml-auto md:mr-0 mt-2 md:mt-0">
        ${dropdownsHTML}
      </div>
      
    </div>
  </div>
</section>
`;

Dropdown.initializeDropdowns();
