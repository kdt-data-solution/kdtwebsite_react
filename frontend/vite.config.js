import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from 'path';

export default defineConfig({
  base: '/kdtwebsite_react/',
  plugins: [tailwindcss()],
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
        product: resolve(__dirname, 'src/product.html'),
        productMembership: resolve(__dirname, 'src/product-membership.html'),
        productConstruct: resolve(__dirname, 'src/product-construct.html'),
        productChatbot: resolve(__dirname, 'src/product-chatbot.html'),
        productTabs: resolve(__dirname, 'src/product-tabs.html'),
        portfolio: resolve(__dirname, 'src/portfolio.html'),
        media: resolve(__dirname, 'src/media.html'),
        article: resolve(__dirname, 'src/article.html'),
        notFound: resolve(__dirname, 'src/404.html'),
        privacy: resolve(__dirname, 'src/privacy.html'),
        cookie: resolve(__dirname, 'src/cookie.html'),
      },
    },
  },
});
