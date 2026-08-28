import '../styles/style.css';
import { getSiteSettings } from '../utils/siteSettings.js';

const BASE = import.meta.env.BASE_URL;
document.querySelector('#footer').innerHTML = renderFooter({});
getSiteSettings().then(settings => { const root = document.querySelector('#footer'); if (root) root.innerHTML = renderFooter(settings); });

function renderFooter(s) {
  const company = s.company_name || 'KDT Network and Data Solution';
  const socials = [
    { name: 'Facebook', url: s.facebook_url, icon: 'facebook.svg' },
    { name: 'LinkedIn', url: s.linkedin_url || 'https://www.linkedin.com/in/kristoffer-dave-tabong-7183b2a7/', icon: 'linkedin.svg' },
    { name: 'YouTube', url: s.youtube_url, icon: 'youtube.svg' },
  ].filter(item => item.url && item.url !== '#');
  const socialLinks = socials.map(item => `<a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.name}"><img src="${BASE}assets/images/${item.icon}" alt=""></a>`).join('');
  return `<footer class="kdt-footer"><div class="kdt-container"><div class="kdt-footer-grid">
    <div><img class="kdt-footer-logo" src="${BASE}assets/images/kdt-black.png" alt="KDT Network and Data Solution"><p class="kdt-eyebrow" style="color:#858580;margin-top:1.2rem;max-width:220px">Building useful systems for a connected world.</p>${socialLinks ? `<div class="kdt-socials">${socialLinks}</div>` : ''}</div>
    <div><h2 class="kdt-footer-heading">Services</h2><ul class="kdt-footer-list"><li><a href="${BASE}services.html">Architecture and Engineering</a></li><li><a href="${BASE}services-data.html">Data Science and Analytics</a></li><li><a href="${BASE}services-software.html">Software Development</a></li><li><a href="${BASE}services-bootcamp.html">Bootcamp</a></li></ul></div>
    <div><h2 class="kdt-footer-heading">Explore</h2><ul class="kdt-footer-list"><li><a href="${BASE}media.html">Media</a></li><li><a href="${BASE}about.html">Company Profile</a></li><li><a href="${BASE}#contact">Contact us</a></li></ul></div>
    <div><h2 class="kdt-footer-heading">Legal &amp; trust</h2><ul class="kdt-footer-list"><li><a href="${BASE}privacy.html">Privacy Notice</a></li><li><a href="${BASE}cookie.html">Cookie Policy</a></li></ul><img class="kdt-seal" src="${BASE}assets/images/kdt-seal.png" alt="DPO/DPS Registered" style="margin-top:1.2rem"></div>
  </div><div class="kdt-footer-bottom"><p>&copy; ${new Date().getFullYear()} ${company}. All rights reserved.</p><p>Network &amp; Data Solutions</p></div></div></footer>`;
}
