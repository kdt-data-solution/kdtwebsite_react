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

export default defineConfig({
  base: '/kdtwebsite_react/',
  plugins: [tailwindcss(), notFoundFallback()],
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        services: resolve(__dirname, 'src/services.html'),
        login: resolve(__dirname, 'src/login.html'),
        admin: resolve(__dirname, 'src/admin.html'),
        about: resolve(__dirname, 'src/about.html'),
        project: resolve(__dirname, 'src/project.html'),
        servicesData: resolve(__dirname, 'src/services-data.html'),
        servicesSoftware: resolve(__dirname, 'src/services-software.html'),
        servicesBootcamp: resolve(__dirname, 'src/services-bootcamp.html'),
        product: resolve(__dirname, 'src/product.html'),
        productMembership: resolve(__dirname, 'src/product-membership.html'),
        productConstruct: resolve(__dirname, 'src/product-construct.html'),
        productChatbot: resolve(__dirname, 'src/product-chatbot.html'),
        productTabs: resolve(__dirname, 'src/product-tabs.html'),
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
