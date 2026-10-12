import '../styles/style.css';
const BASE = import.meta.env.BASE_URL;

export const ready = Promise.resolve().then(() => {
  document.querySelector('#solution-divider').innerHTML = `
    <section class="kdt-community-section" aria-label="Community and education">
      <div class="kdt-container kdt-community-grid">
        <article id="community" class="kdt-community-feature">
          <img src="${BASE}assets/images/editorials/data-reliable-dashboards.png" alt="A data dashboard and information design illustration" loading="lazy" decoding="async" />
          <div class="kdt-community-copy"><p class="kdt-eyebrow">Community</p><h2>Ideas for the work you do.</h2><p>Read practical perspectives across engineering, data, and digital systems from the KDT team.</p><a href="${BASE}media.html">Explore KDT perspectives <span aria-hidden="true">↗</span></a></div>
        </article>
        <article id="education" class="kdt-education-feature">
          <div class="kdt-education-copy"><p class="kdt-eyebrow">Education</p><h2>Build practical skills.</h2><p>Explore KDT bootcamps and courses in programming, AI, data visualization, and automation.</p><div class="kdt-education-links"><a href="${BASE}services-bootcamp.html">Explore bootcamps <span aria-hidden="true">↗</span></a><a href="${BASE}course.html?slug=basic-programming-and-vibe-coding">Browse courses <span aria-hidden="true">↗</span></a></div></div>
          <img src="${BASE}assets/images/kdt-bootcamp-workshop.png" alt="Participants taking part in a KDT technology workshop" loading="lazy" decoding="async" />
        </article>
      </div>
    </section>
  `;
});
