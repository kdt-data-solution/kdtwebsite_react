import '../styles/style.css';

const servicesData = [
  {
    id: 1,
    category: "Architecture & Engineering",
    title: "Professional Design & Engineering Solutions",
    description: "Our architecture and engineering services combine technical expertise with creative innovation to deliver exceptional results for projects of all scales.",
    icon: `<svg class="w-48 h-48 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    </svg>`,
    features: [
      {
        title: "Structural Engineering",
        description: "Comprehensive structural analysis, design, and inspection services ensuring safety and compliance."
      },
      {
        title: "Civil Engineering",
        description: "Infrastructure planning, site development, and project management from concept to completion."
      },
      {
        title: "Architectural Design",
        description: "Innovative architectural solutions that balance aesthetics, functionality, and sustainability."
      }
    ],
    imagePosition: "right"
  },
  {
    id: 2,
    category: "Data Science & Analytics",
    title: "Transform Data Into Strategic Insights",
    description: "Leverage the power of data with our advanced analytics and machine learning solutions to drive informed decision-making and business growth.",
    icon: `<svg class="w-48 h-48 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>`,
    features: [
      {
        title: "Predictive Analytics",
        description: "Machine learning models that forecast trends and identify opportunities before they emerge."
      },
      {
        title: "Business Intelligence",
        description: "Interactive dashboards and reports that provide real-time visibility into your operations."
      },
      {
        title: "Data Engineering",
        description: "Robust data pipelines and infrastructure to collect, process, and store your data efficiently."
      }
    ],
    imagePosition: "left"
  },
  {
    id: 3,
    category: "Software Development",
    title: "Custom Software Solutions That Scale",
    description: "From enterprise applications to consumer-facing platforms, we build secure, scalable, and user-friendly software tailored to your unique requirements.",
    icon: `<svg class="w-48 h-48 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
    </svg>`,
    features: [
      {
        title: "Web Applications",
        description: "Modern, responsive web apps built with React, Vue, Angular, and other cutting-edge frameworks."
      },
      {
        title: "Mobile Development",
        description: "Native and cross-platform mobile apps for iOS and Android that deliver exceptional user experiences."
      },
      {
        title: "API Development",
        description: "RESTful and GraphQL APIs that enable seamless integration and data exchange between systems."
      }
    ],
    imagePosition: "right"
  }
];

function renderServiceSection(service, index) {
  const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  const contentOrder = service.imagePosition === 'right' ? '' : 'order-1 lg:order-2';
  const imageOrder = service.imagePosition === 'right' ? '' : 'order-2 lg:order-1';
  
  const featuresHTML = service.features.map(feature => `
    <div class="flex items-start">
      <svg class="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <div>
        <h3 class="font-semibold text-gray-900 mb-1">${feature.title}</h3>
        <p class="text-gray-600">${feature.description}</p>
      </div>
    </div>
  `).join('');

  return `
    <section class="py-16 md:py-20 ${bgColor}">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="${contentOrder}">
            <div class="inline-block bg-black text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ${service.category}
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              ${service.title}
            </h2>
            <p class="text-gray-600 text-lg mb-6">
              ${service.description}
            </p>
            <div class="space-y-4">
              ${featuresHTML}
            </div>
          </div>
          
          <div class="${imageOrder} bg-gray-100 rounded-2xl p-8 flex items-center justify-center h-96">
            ${service.icon}
          </div>
        </div>
      </div>
    </section>
  `;
}

document.querySelector("#services-page").innerHTML = `
  <!-- Hero Section -->
  <section class="pt-24 pb-16 bg-gradient-to-br from-gray-900 to-black text-white">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our Services</h1>
        <p class="text-lg md:text-xl text-gray-300">
          Delivering excellence through innovative engineering, data-driven insights, and cutting-edge software solutions.
        </p>
      </div>
    </div>
  </section>

  <!-- Service Sections -->
  ${servicesData.map((service, index) => renderServiceSection(service, index)).join('')}

  <!-- CTA Section -->
  <section class="py-16 md:py-20 bg-black text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
      <p class="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
        Let's discuss how our services can help transform your business and achieve your goals.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#" class="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors">
          Contact Us
        </a>
        <a href="#" class="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-black transition-colors">
          View Portfolio
        </a>
      </div>
    </div>
  </section>
`;
