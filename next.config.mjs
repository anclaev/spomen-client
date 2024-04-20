/** @type {import('next').NextConfig} */

const nextConfig = {
  /** For GitHub Pages */
   basePath: process.env.CI === 'pages' ? '/spomen-client' : '',
   assetPrefix: process.env.CI === 'pages' ? '/spomen-client/' : '/'
};

export default nextConfig;
