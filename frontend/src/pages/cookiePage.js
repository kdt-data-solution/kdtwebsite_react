import '../styles/style.css';

document.querySelector('#cookie-page').innerHTML = `
  <section class="pt-24 sm:pt-28 pb-16 md:pb-20 bg-background">
    <div class="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">

      <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-8 md:mb-10">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-1">COOKIE POLICY</h1>
          <p class="text-xs text-gray-500">KDT Network and Data Solution</p>
        </div>
        <p class="text-xs text-gray-500 mt-2 md:mt-1"><span class="font-semibold">Effective Date:</span> September 7, 2024</p>
      </div>

      <p class="text-sm text-gray-700 leading-relaxed mb-8">
        This Cookie Policy explains how KDT Network and Data Solution ("we," "our," or "us") uses cookies and similar technologies on our website. By using our website, you consent to the use of cookies as described in this policy.
      </p>

      <div class="space-y-8">

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">1. What Are Cookies?</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. Cookies can also enhance your browsing experience by remembering your preferences.
          </p>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">2. Types of Cookies We Use</h2>
          <p class="text-sm text-gray-700 mb-3">We use the following types of cookies on our website:</p>
          <ul class="list-disc pl-6 space-y-2 text-sm text-gray-700">
            <li><span class="font-semibold">Essential Cookies:</span> Necessary for the website to function properly. Without these cookies, certain features and services may not be available.</li>
            <li><span class="font-semibold">Performance and Analytics Cookies:</span> These cookies collect information about how you use our website, such as which pages you visit most often. We use this data to improve the performance and functionality of our website.</li>
            <li><span class="font-semibold">Functionality Cookies:</span> These cookies allow the website to remember choices you make (such as your language preference) to provide a more personalized experience.</li>
            <li><span class="font-semibold">Targeting/Advertising Cookies:</span> These cookies track your online activity to help deliver relevant advertising or limit how often you see a particular advertisement.</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">3. Third-Party Cookies</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            In addition to our own cookies, we may also use third-party cookies from service providers such as analytics or advertising partners. These third-party cookies help us analyze website traffic or enable targeted advertising based on your browsing behavior.
          </p>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">4. How You Can Manage Cookies</h2>
          <p class="text-sm text-gray-700 mb-3">
            You can manage or block cookies by adjusting the settings in your web browser. Most browsers allow you to block or delete cookies. Please note that disabling cookies may affect the functionality and performance of our website.
          </p>
          <p class="text-sm text-gray-700 mb-2">Cookie settings can be found in:</p>
          <ul class="list-disc pl-6 space-y-1 text-sm text-gray-700">
            <li>Google Chrome</li>
            <li>Mozilla Firefox</li>
            <li>Microsoft Edge</li>
            <li>Safari</li>
          </ul>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">5. Cookies We Use</h2>
          <p class="text-sm text-gray-700 mb-3">
            We retain personal data for as long as necessary to fulfill the purposes outlined in the Privacy Notice unless a longer retention period is required by law.
          </p>
          <div class="overflow-x-auto">
            <table class="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead class="bg-gray-50">
                <tr>
                  <th class="text-left px-4 py-3 font-semibold text-gray-900 border-b border-gray-200">Category</th>
                  <th class="text-left px-4 py-3 font-semibold text-gray-900 border-b border-gray-200">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr>
                  <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap align-top">Essential Cookies</td>
                  <td class="px-4 py-3 text-gray-700">Necessary for the website's basic functionality, including security (e.g., CSRF protection) and session management. These cookies enable core features like login, form submission, and navigation.</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap align-top">Preference Cookies</td>
                  <td class="px-4 py-3 text-gray-700">Store user preferences, such as language or theme settings, to provide a personalized experience.</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap align-top">Analytics Cookies</td>
                  <td class="px-4 py-3 text-gray-700">Help us understand how visitors interact with the website by collecting data on user behavior. This data helps us improve website performance and user experience.</td>
                </tr>
                <tr>
                  <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap align-top">Consent Cookies</td>
                  <td class="px-4 py-3 text-gray-700">Track whether a user has consented to the use of cookies, ensuring compliance with privacy regulations.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">6. Changes to This Cookie Policy</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. Any updates will be posted on this page with an updated effective date.
          </p>
        </div>

        <div>
          <h2 class="text-base md:text-lg font-bold text-gray-900 mb-3">7. Contact Us</h2>
          <p class="text-sm text-gray-700 leading-relaxed">
            If you have any questions or concerns about our use of cookies, please contact us at <a href="mailto:developer@kdtdatasolution.com" class="text-black font-medium underline hover:no-underline">developer@kdtdatasolution.com</a>.
          </p>
        </div>

      </div>
    </div>
  </section>
`;
