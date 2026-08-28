import './styles/style.css'

document.querySelector("#app").innerHTML = `
<div>
  <div id="hero"></div>
  <div id="industries"></div>
  <div id="products"></div>
  <div id="services"></div>
  <div id="solution-divider"></div>
  <div id="product-directory"></div>
  <div id="faq"></div>
</div>
`;

// Load hero after DOM is ready
setTimeout(() => {
  import('./components/hero.js');
  import('./components/industries.js');
  import('./components/products.js');
  import('./components/services.js');
  import('./components/solutionDivider.js');
  import('./components/productDirectory.js');
  import('./components/faq.js');
}, 0);
