import './styles/style.css'

document.querySelector("#app").innerHTML = `
<div class="pt-16">
  <div class="container mx-auto flex items-center justify-center mt-10">
    <div id="hero"></div>
  </div>
  <div id="services"></div>
  <div id="products"></div>
  <div class="container mx-auto flex items-center justify-center mt-10">
    <div id="faq"></div>
  </div>
</div>
`;

// Load hero after DOM is ready
setTimeout(() => {
  import('./components/hero.js');
  import('./components/services.js');
  import('./components/products.js');
  import('./components/faq.js');
}, 0);
