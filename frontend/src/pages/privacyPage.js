import '../styles/style.css';

document.querySelector('#privacy-page').innerHTML = `
  <section class="pt-24 sm:pt-28 pb-16 md:pb-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">

      <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-8 md:mb-10">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-1">PRIVACY NOTICE</h1>
          <p class="text-xs text-gray-500">KDT Network and Data Solution</p>
        </div>
        <p class="text-xs text-gray-500 mt-2 md:mt-1"><span class="font-semibold">Effective Date:</span> September 7, 2024</p>
      </div>

      <p class="text-sm text-gray-700 leading-relaxed mb-8">
        KDT Network and Data Solution ("we," "our," or "us") is committed to protecting the privacy and personal data of our clients, users, and visitors. This Privacy Notice explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) and other relevant regulations in the Philippines.
      </p>

      <div class="space-y-8">

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">1. Information We Collect</h2>
          <p class="text-sm text-gray-700 mb-2">We may collect the following types of personal data:</p>
          <ul class="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li><span class="font-semibold">Personal Identification Information:</span> Name, email address, contact details, company information, and other identifiers provided voluntarily through our forms or when you communicate with us.</li>
            <li><span class="font-semibold">Technical Data:</span> Information about your use of our website, such as your IP address, browser type, and operating system.</li>
            <li><span class="font-semibold">Transactional Data:</span> Information related to services or inquiries you have requested from us.</li>
            <li><span class="font-semibold">Other Information:</span> Any additional information you choose to provide.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <p class="text-sm text-gray-700 mb-2">We use your personal data for the following purposes:</p>
          <ul class="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li>To provide, maintain, and improve our IT, Data Science, and Engineering services.</li>
            <li>To process inquiries, requests, or transactions.</li>
            <li>To communicate with you, including responding to inquiries and sending relevant updates.</li>
            <li>To comply with legal and regulatory requirements.</li>
            <li>To analyze website usage and improve user experience.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">3. How We Share Your Information</h2>
          <p class="text-sm text-gray-700 mb-2">We do not sell, trade, or otherwise transfer your personal data to third parties without your consent, except in the following cases:</p>
          <ul class="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li><span class="font-semibold">Service Providers:</span> We may share data with trusted third-party service providers who assist us in operating our business and providing services to you, subject to confidentiality agreements.</li>
            <li><span class="font-semibold">Legal Requirements:</span> We may disclose information if required by law, or in good faith belief that such action is necessary to comply with legal obligations.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">4. Data Security</h2>
          <p class="text-sm text-gray-700">
            We implement appropriate technical and organizational measures to safeguard your personal data from unauthorized access, alteration, or disclosure. However, no method of data transmission or storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">5. Retention of Data</h2>
          <p class="text-sm text-gray-700">
            We retain personal data for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless a longer retention period is required by law.
          </p>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">6. Your Data Privacy Rights</h2>
          <p class="text-sm text-gray-700 mb-2">Under the Data Privacy Act, you have the right to:</p>
          <ul class="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li>Access, correct, or update your personal data.</li>
            <li>Object to or restrict the processing of your personal data.</li>
            <li>Request deletion of your personal data.</li>
          </ul>
          <p class="text-sm text-gray-700 mt-3">
            You can exercise these rights by contacting us at <a href="mailto:developer@kdtdatasolution.com" class="text-black font-medium underline hover:no-underline">developer@kdtdatasolution.com</a>.
          </p>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">7. Cookies and Website Analytics</h2>
          <p class="text-sm text-gray-700">
            We may use cookies to enhance your website experience. You may choose to disable cookies through your browser settings, but this may affect your ability to use certain features of our site.
          </p>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">8. Changes to This Privacy Notice</h2>
          <p class="text-sm text-gray-700">
            We may update this Privacy Notice from time to time. Any changes will be posted on this page with an updated effective date.
          </p>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">9. Contact Us</h2>
          <p class="text-sm text-gray-700">
            If you have any questions or concerns regarding this Privacy Notice or your personal data, please contact us at <a href="mailto:developer@kdtdatasolution.com" class="text-black font-medium underline hover:no-underline">developer@kdtdatasolution.com</a>.
          </p>
        </div>

      </div>
    </div>
  </section>
`;
