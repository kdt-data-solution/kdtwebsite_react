import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';
import fs from 'fs';

// Serve custom 404.html for unknown URLs in dev.
const notFoundFallback = () => ({
  name: 'not-found-fallback',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.method !== 'GET' || !req.headers.accept?.includes('text/html')) return next();
      const originalEnd = res.end;
      res.end = function (chunk, ...args) {
        if (res.statusCode === 404) {
          const html = fs.readFileSync(resolve(__dirname, 'src/404.html'), 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          return originalEnd.call(this, html);
        }
        return originalEnd.call(this, chunk, ...args);
      };
      next();
    });
  },
});

const socialPreview = () => ({
  name: 'kdt-social-preview',
  transformIndexHtml(html) {
    // Article pages provide record-specific Open Graph metadata at runtime.
    if (html.includes('property="og:title"')) return html;

    return {
      html,
      tags: [
        { tag: 'meta', attrs: { name: 'description', content: 'KDT Network and Data Solution provides engineering, data science, AI, and custom software solutions.' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'KDT Network and Data Solution' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:title', content: 'KDT Network and Data Solution' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:description', content: 'Engineering insight. Digital intelligence.' }, injectTo: 'head' },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://www.kdtdatasolution.com/og.png' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'KDT Network and Data Solution' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:description', content: 'Engineering insight. Digital intelligence.' }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://www.kdtdatasolution.com/og.png' }, injectTo: 'head' },
      ],
    };
  },
});

export default defineConfig({
  base: '/',
  plugins: [tailwindcss(), socialPreview(), notFoundFallback()],
  root: 'src',
  // root is 'src', but .env files live in the frontend dir — load them from here.
  envDir: __dirname,
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        services: resolve(__dirname, 'src/services.html'),
        login: resolve(__dirname, 'src/kdt-portal.html'),
        admin: resolve(__dirname, 'src/admin.html'),
        about: resolve(__dirname, 'src/about.html'),
        owner: resolve(__dirname, 'src/owner.html'),
        project: resolve(__dirname, 'src/project.html'),
        servicesData: resolve(__dirname, 'src/services-data.html'),
        servicesSoftware: resolve(__dirname, 'src/services-software.html'),
        servicesBootcamp: resolve(__dirname, 'src/services-bootcamp.html'),
        course: resolve(__dirname, 'src/course.html'),
        product: resolve(__dirname, 'src/product.html'),
        productMembership: resolve(__dirname, 'src/product-membership.html'),
        productConstruct: resolve(__dirname, 'src/product-construct.html'),
        productChatbot: resolve(__dirname, 'src/product-chatbot.html'),
        productWms: resolve(__dirname, 'src/product-wms.html'),
        productCardko: resolve(__dirname, 'src/product-cardko.html'),
        portfolio: resolve(__dirname, 'src/portfolio.html'),
        media: resolve(__dirname, 'src/media.html'),
        article: resolve(__dirname, 'src/article.html'),
        notFound: resolve(__dirname, 'src/404.html'),
        error405: resolve(__dirname, 'src/405.html'),
        error409: resolve(__dirname, 'src/409.html'),
        privacy: resolve(__dirname, 'src/privacy.html'),
        cookie: resolve(__dirname, 'src/cookie.html'),
      },
    },
  },
});
