import './styles/style.css'
import { markPageReady } from './utils/pageReady.js';

document.body.classList.add('kdt-home-page');
document.querySelector("#app").innerHTML = `
<main>
  <div id="hero"></div>
  <div id="industries"></div>
  <div id="services"></div>
  <div id="solution-divider"></div>
  <div id="faq"></div>
</main>
`;

const sections = [
  import('./components/hero.js'),
  import('./components/industries.js'),
  import('./components/services.js'),
  import('./components/solutionDivider.js'),
  import('./components/faq.js'),
];
Promise.allSettled(sections.map(async section => (await section).ready)).then(markPageReady);
